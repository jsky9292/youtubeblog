#!/usr/bin/env python3
# automation/generate_post.py
# YouTube 영상 → 블로그 글 자동 생성

import os
import sys
import json
import sqlite3
from datetime import datetime
from youtube_transcript_api import YouTubeTranscriptApi
import google.generativeai as genai

# 환경 변수 로드
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
DB_PATH = os.getenv('DATABASE_PATH', '../database/blog.db')

# Gemini 설정
if not GEMINI_API_KEY:
    print("❌ GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.")
    sys.exit(1)

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')


def get_transcript(video_id):
    """YouTube 자막 추출"""
    print(f"📝 자막 추출 중: {video_id}")

    try:
        # 한국어 자막 우선, 없으면 자동 생성 자막
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

        # 한국어 자막 찾기
        try:
            transcript = transcript_list.find_transcript(['ko'])
        except:
            # 자동 생성 자막 중 한국어
            transcript = transcript_list.find_generated_transcript(['ko'])

        # 자막 텍스트 추출
        transcript_data = transcript.fetch()
        full_text = ' '.join([item['text'] for item in transcript_data])

        print(f"✅ 자막 추출 완료: {len(full_text)}자")
        return full_text

    except Exception as e:
        print(f"❌ 자막 추출 실패: {str(e)}")
        return None


def generate_blog_post(transcript, original_title, keyword):
    """Gemini API로 블로그 글 생성"""
    print(f"🤖 블로그 글 생성 중...")

    # 프롬프트 구성
    prompt = f"""
당신은 보험 및 손해사정 분야의 전문 블로그 작가입니다.
아래 유튜브 영상 자막을 분석하여 SEO 최적화된 블로그 글로 변환하세요.

[원본 영상 정보]
제목: {original_title}
주제: {keyword}

[요구사항]
1. 제목: 클릭을 유도하는 매력적인 제목 (35자 이내)
2. 본문: 2000자 이상, HTML 형식
3. 구조: <h2>, <h3>, <ul>, <ol>, <p> 태그 활용
4. SEO: "{keyword}" 키워드를 자연스럽게 5-7회 포함
5. 톤앤매너: 친근하면서도 전문적, 독자에게 도움이 되는 내용
6. 실용성: 독자가 바로 활용할 수 있는 구체적 정보 포함
7. 구성:
   - 서론: 독자의 고민/문제 제시
   - 본론: 해결 방법 상세 설명
   - 결론: 핵심 요약 및 행동 촉구

[자막 내용]
{transcript[:5000]}

[출력 형식]
반드시 아래 JSON 형식만 출력하세요. 다른 텍스트는 절대 포함하지 마세요.

{{
  "title": "블로그 제목",
  "meta_description": "150자 이내의 메타 설명",
  "content": "<h2>소제목</h2><p>본문...</p>",
  "keywords": ["키워드1", "키워드2", "키워드3"]
}}
"""

    try:
        # Gemini API 호출 (재시도 로직 포함)
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = model.generate_content(
                    prompt,
                    generation_config={
                        'temperature': 0.7,
                        'max_output_tokens': 4096,
                    }
                )

                text = response.text
                break

            except Exception as e:
                if attempt == max_retries - 1:
                    raise e
                print(f"⚠️ 재시도 {attempt + 1}/{max_retries}")
                import time
                time.sleep(2 ** attempt)  # 지수 백오프

        # JSON 정제
        text = text.strip()

        # 마크다운 코드 블록 제거
        if text.startswith('```json'):
            text = text[7:]
        if text.startswith('```'):
            text = text[3:]
        if text.endswith('```'):
            text = text[:-3]

        text = text.strip()

        # 첫 { 부터 마지막 } 까지만 추출
        start_idx = text.find('{')
        end_idx = text.rfind('}')
        if start_idx != -1 and end_idx != -1:
            text = text[start_idx:end_idx + 1]

        # JSON 파싱
        result = json.loads(text)

        print(f"✅ 글 생성 완료: {result['title']}")
        return result

    except json.JSONDecodeError as e:
        print(f"❌ JSON 파싱 에러: {str(e)}")
        print(f"원본 텍스트: {text[:200]}...")
        return None
    except Exception as e:
        print(f"❌ 글 생성 실패: {str(e)}")
        return None


def create_slug(title):
    """제목에서 URL slug 생성"""
    import re

    # 한글 제거, 영문/숫자만 남기기
    slug = re.sub(r'[^a-zA-Z0-9가-힣\s-]', '', title)
    slug = slug.lower()

    # 공백을 하이픈으로
    slug = re.sub(r'\s+', '-', slug)

    # 연속된 하이픈 제거
    slug = re.sub(r'-+', '-', slug)

    # 앞뒤 하이픈 제거
    slug = slug.strip('-')

    # 최대 50자
    slug = slug[:50]

    # 타임스탬프 추가 (중복 방지)
    timestamp = datetime.now().strftime('%Y%m%d')
    slug = f"{slug}-{timestamp}"

    return slug


def save_to_database(video_id, blog_data):
    """생성된 글을 데이터베이스에 저장"""
    print(f"💾 데이터베이스 저장 중...")

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Slug 생성
        slug = create_slug(blog_data['title'])

        # 중복 체크
        cursor.execute("SELECT id FROM posts WHERE slug = ?", (slug,))
        if cursor.fetchone():
            print(f"⚠️ 중복된 slug: {slug}")
            slug = f"{slug}-{datetime.now().strftime('%H%M%S')}"

        # 포스트 저장
        cursor.execute("""
            INSERT INTO posts
            (video_id, title, slug, content, meta_description, keywords, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 'draft', ?)
        """, (
            video_id,
            blog_data['title'],
            slug,
            blog_data['content'],
            blog_data['meta_description'],
            ','.join(blog_data['keywords']),
            datetime.now().isoformat()
        ))

        post_id = cursor.lastrowid

        conn.commit()
        conn.close()

        print(f"✅ 저장 완료: ID={post_id}, slug={slug}")
        return post_id, slug

    except Exception as e:
        print(f"❌ DB 저장 실패: {str(e)}")
        return None, None


def get_video_info(video_id):
    """DB에서 영상 정보 가져오기"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT title, keyword FROM discovered_videos
            WHERE video_id = ?
        """, (video_id,))

        result = cursor.fetchone()
        conn.close()

        if result:
            return {'title': result[0], 'keyword': result[1]}
        return None

    except Exception as e:
        print(f"❌ 영상 정보 조회 실패: {str(e)}")
        return None


def main(video_id):
    """메인 실행 함수"""
    print(f"\n{'='*50}")
    print(f"🎬 영상 처리 시작: {video_id}")
    print(f"{'='*50}\n")

    # 1. 영상 정보 가져오기
    video_info = get_video_info(video_id)
    if not video_info:
        print(f"❌ 영상 정보를 찾을 수 없습니다: {video_id}")
        return False

    print(f"📌 원본 제목: {video_info['title']}")
    print(f"🏷️  키워드: {video_info['keyword']}\n")

    # 2. 자막 추출
    transcript = get_transcript(video_id)
    if not transcript:
        return False

    # 3. 블로그 글 생성
    blog_data = generate_blog_post(
        transcript,
        video_info['title'],
        video_info['keyword']
    )
    if not blog_data:
        return False

    # 4. 데이터베이스 저장
    post_id, slug = save_to_database(video_id, blog_data)
    if not post_id:
        return False

    print(f"\n{'='*50}")
    print(f"🎉 완료!")
    print(f"📝 제목: {blog_data['title']}")
    print(f"🔗 Slug: {slug}")
    print(f"💾 Post ID: {post_id}")
    print(f"{'='*50}\n")

    return True


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("사용법: python generate_post.py VIDEO_ID")
        print("예시: python generate_post.py dQw4w9WgXcQ")
        sys.exit(1)

    video_id = sys.argv[1]
    success = main(video_id)

    sys.exit(0 if success else 1)
