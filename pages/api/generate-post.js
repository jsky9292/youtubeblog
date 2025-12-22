// pages/api/generate-post.js
// 블로그 글 자동 생성 API (bloggogogo 스타일)

const axios = require('axios');
const { YoutubeTranscript } = require('youtube-transcript');
const { getConfigValue } = require('../../lib/config');
const { getVideoInfo, analyzeViralFactors } = require('../../lib/youtube');
const { createPost } = require('../../lib/db');

/**
 * YouTube 자막 추출 및 요약
 */
async function getTranscript(videoId) {
  try {
    console.log(`[INFO] 자막 추출 시작: ${videoId}`);
    const transcript = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'ko' });

    if (!transcript || transcript.length === 0) {
      console.log('[WARN] 한국어 자막 없음, 영어 시도');
      const enTranscript = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' });
      if (enTranscript && enTranscript.length > 0) {
        const fullText = enTranscript.map(item => item.text).join(' ');
        console.log(`[INFO] 영어 자막 추출 완료 (${fullText.length}자)`);
        return fullText;
      }
      return null;
    }

    const fullText = transcript.map(item => item.text).join(' ');
    console.log(`[INFO] 자막 추출 완료 (${fullText.length}자)`);
    return fullText;
  } catch (error) {
    console.error('[WARN] 자막 추출 실패:', error.message);
    return null;
  }
}

/**
 * Gemini API로 블로그 글 생성 (bloggogogo 구글 스타일)
 */
async function generateBlogContent(videoInfo, viralAnalysis, transcript) {
  const GEMINI_API_KEY = getConfigValue('gemini_api_key');

  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API 키가 설정되지 않았습니다. 관리자 설정 페이지에서 API 키를 입력해주세요.');
  }

  // 자막 텍스트 요약 (너무 길면 앞부분만)
  const transcriptSummary = transcript
    ? transcript.length > 3000
      ? transcript.substring(0, 3000) + '...'
      : transcript
    : '자막 없음';

  // 바이럴 분석 요약
  const viralSummary = viralAnalysis.insights.length > 0
    ? `바이럴 점수: ${viralAnalysis.viral_score}점 (${viralAnalysis.rating}) - ${viralAnalysis.summary}`
    : '';

  // 랜덤 테마 선택 (bloggogogo 스타일)
  const themes = [
    { name: '블루-그레이', primary: '#1a73e8', secondary: '#f5f5f5', accent: '#e8f4fd' },
    { name: '그린-오렌지', primary: '#00796b', secondary: '#fff3e0', accent: '#e0f2f1' },
    { name: '퍼플-옐로우', primary: '#6200ea', secondary: '#fffde7', accent: '#f3e5f5' }
  ];
  const theme = themes[Math.floor(Math.random() * themes.length)];

  // bloggogogo 구글 스타일 프롬프트 (초간결화)
  const prompt = `YouTube 영상 스크립트 기반 구글 SEO 블로그 작성

📹 영상 정보
제목: ${videoInfo.title}
${viralSummary}

🎬 영상 스크립트 (분석 필수!)
${transcriptSummary}

🎨 테마: ${theme.name} (색상: ${theme.primary})

✅ 필수 요구사항
- 2,500-3,000자 (한글, 공백 포함)
- ~이에요, ~해요 체
- 영상 스크립트 내용을 심층 분석하여 재구성
- 표(table) 1개 이상 필수
- **중요**: 유튜버/채널명 절대 언급 금지! 마치 내가 직접 경험한 것처럼 작성
- 예: "곽튜브가 방문한 곳" (X) → "제가 방문한 신혼여행지" (O)

📋 HTML 구조
<div style="font-family: 'Noto Sans KR', sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; font-size: 16px;">
  <div style="background-color: ${theme.secondary}; padding: 15px; border-radius: 8px; margin-bottom: 25px;"><strong>질문</strong> 설명</div>
  <p style="margin-bottom: 15px;">도입</p>
  <h2 style="font-size: 22px; color: ${theme.primary}; margin: 30px 0 15px; border-bottom: 2px solid #eaeaea; padding-bottom: 8px;"><strong>제목</strong></h2>
  <p style="margin-bottom: 15px;">본문</p>
  <div style="background-color: ${theme.accent}; border-left: 4px solid ${theme.primary}; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;"><strong>💡 팁</strong><br>내용</div>
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;"><thead><tr style="background-color: #f8f9fa;"><th style="padding: 12px; border: 1px solid #dee2e6;">항목</th></tr></thead><tbody><tr><td style="padding: 12px; border: 1px solid #dee2e6;">내용</td></tr></tbody></table>
  <h2 style="font-size: 22px; color: ${theme.primary}; margin: 30px 0 15px; border-bottom: 2px solid #eaeaea; padding-bottom: 8px;"><strong>FAQ</strong> ❓</h2>
  <h3 style="font-size: 18px; margin: 20px 0 10px;">질문?</h3>
  <p style="margin-bottom: 15px;">답변</p>
</div>

🖼️ 이미지 프롬프트 규칙 (매우 중요!)
- 이미지 프롬프트는 반드시 본문 내용과 직접 관련된 장면이어야 함
- 추상적이거나 일반적인 이미지 금지 (예: "modern office" 같은 일반적 표현 금지)
- 글의 주제, 핵심 키워드, 설명하는 내용을 시각적으로 표현
- 예시: 보험 청구 글 → "Korean person filling insurance claim form at desk with documents", 여행 글 → "Osaka castle with cherry blossoms tourists taking photos"

📤 JSON 출력
{
  "title": "SEO 최적화 제목 60자 이내",
  "meta_description": "메타 설명 130-150자",
  "content": "위 HTML 구조 + {{IMAGE_1}}, {{IMAGE_2}}, {{IMAGE_3}} 포함 (각 섹션 사이에 배치)",
  "keywords": ["키워드1", "키워드2", "키워드3"],
  "thumbnail_prompt": "블로그 주제를 대표하는 구체적인 영어 프롬프트, photorealistic, 16:9 aspect ratio, vibrant colors",
  "image_prompts": [
    "첫번째 섹션 내용과 직접 관련된 구체적 장면 영어 프롬프트",
    "두번째 섹션 내용과 직접 관련된 구체적 장면 영어 프롬프트",
    "세번째 섹션 내용과 직접 관련된 구체적 장면 영어 프롬프트"
  ]
}

JSON만 출력. 다른 텍스트 금지.`;

  try {
    // 여러 모델 시도 (503 오버로드 에러 방지)
    const models = ['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-pro'];
    let response;
    let lastError;

    for (const model of models) {
      try {
        console.log(`[INFO] ${model} 모델로 시도 중...`);
        response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
          {
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 16384,
            }
          },
          { timeout: 60000 }
        );
        console.log(`[INFO] ${model} 모델 사용 성공!`);
        break;
      } catch (err) {
        console.log(`[WARN] ${model} 모델 실패:`, err.response?.data?.error?.message || err.message);
        lastError = err;
        if (model === models[models.length - 1]) {
          throw lastError;
        }
        // 다음 모델 시도 전 1초 대기
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Gemini API 응답 확인
    if (!response.data.candidates || !response.data.candidates[0]) {
      console.error('[ERROR] Gemini API 응답 구조 이상:', JSON.stringify(response.data, null, 2));
      throw new Error('Gemini API에서 응답을 받지 못했습니다.');
    }

    const candidate = response.data.candidates[0];

    // content.parts 구조 확인
    if (!candidate.content || !candidate.content.parts || !candidate.content.parts[0]) {
      console.error('[ERROR] Gemini API content.parts 구조 이상:', JSON.stringify(candidate, null, 2));
      throw new Error('Gemini API 응답 형식이 올바르지 않습니다.');
    }

    const generatedText = candidate.content.parts[0].text;

    // JSON 파싱 개선 (HTML 이스케이프 처리 포함)
    let cleanedText = generatedText.trim();

    // 코드블록 제거 (```json, ``` 등)
    cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

    // JSON 객체만 추출 (앞뒤 불필요한 텍스트 제거)
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }

    // 잘못된 제어 문자 제거 (JSON 파싱 에러 방지)
    cleanedText = cleanedText.replace(/[\x00-\x1F\x7F]/g, '');

    // 디버깅을 위한 로그 (첫 500자만)
    console.log('[DEBUG] 파싱할 텍스트:', cleanedText.substring(0, 500));

    try {
      const result = JSON.parse(cleanedText);

      // 필수 필드 검증
      if (!result.title || !result.content) {
        throw new Error('필수 필드(title, content)가 누락되었습니다.');
      }

      // HTML 콘텐츠에서 불필요한 이스케이프 제거
      let htmlContent = result.content;

      // 이중 이스케이프 수정 (\\\" → \")
      htmlContent = htmlContent.replace(/\\\\"/g, '"');
      htmlContent = htmlContent.replace(/\\"/g, '"');
      htmlContent = htmlContent.replace(/\\n/g, '\n');

      // 기본값 설정
      return {
        title: result.title,
        content: htmlContent,
        meta_description: result.meta_description || result.title.substring(0, 150),
        keywords: result.keywords || []
      };
    } catch (parseError) {
      console.error('[ERROR] JSON 파싱 실패:', parseError.message);
      console.error('[DEBUG] 문제가 있는 JSON (처음 1500자):', cleanedText.substring(0, 1500));

      // 파싱 실패 시 재시도 로직
      try {
        // content 필드의 HTML을 임시로 base64 인코딩하여 재시도
        const contentMatch = cleanedText.match(/"content":\s*"([^"]*)"/);
        if (!contentMatch) {
          throw new Error('content 필드를 찾을 수 없습니다.');
        }

        // 간단한 대체: content가 너무 길어서 잘린 경우 기본 구조 사용
        console.log('[WARN] JSON 파싱 실패, 기본 구조로 재시도');
        throw new Error('AI가 생성한 JSON 형식이 올바르지 않습니다. 다시 시도해주세요.');
      } catch (retryError) {
        console.error('[ERROR] 재시도도 실패:', retryError.message);
        throw new Error('AI가 생성한 JSON 형식이 올바르지 않습니다. 다시 시도해주세요.');
      }
    }
  } catch (error) {
    console.error('[ERROR] Gemini API 호출 실패:', error.message);
    if (error.response) {
      console.error('응답 데이터:', error.response.data);
    }
    throw new Error('블로그 글 생성 중 오류가 발생했습니다');
  }
}

/**
 * Slug 생성 (한글 제목을 URL-safe 문자열로 변환)
 */
function generateSlug(title) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `post-${timestamp}-${random}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
    });
  }

  const { videoId, thumbnailPrompt, imagePrompts: userImagePrompts, imageCount = 3 } = req.body;

  if (!videoId) {
    return res.status(400).json({
      success: false,
      error: '영상 ID가 필요합니다',
    });
  }

  console.log('[INFO] 블로그 글 생성 시작:', videoId);

  try {
    // 1. YouTube 영상 정보 가져오기
    console.log('[INFO] 영상 정보 조회 중...');
    const videoInfo = await getVideoInfo(videoId);

    // 2. YouTube 자막 추출
    let transcript = null;
    try {
      console.log('[INFO] 영상 자막 추출 시도 중...');
      transcript = await getTranscript(videoId);
      if (transcript) {
        console.log(`[INFO] 자막 추출 성공 (${transcript.length}자)`);
      } else {
        console.log('[WARN] 자막 없음 - 영상 설명과 제목으로 작성');
      }
    } catch (transcriptError) {
      console.log('[WARN] 자막 추출 실패:', transcriptError.message);
    }

    // 3. 영상 바이럴 요인 분석
    console.log('[INFO] 영상 바이럴 요인 분석 중...');
    const viralAnalysis = analyzeViralFactors(videoInfo);
    console.log(`[INFO] 바이럴 분석 완료 - 점수: ${viralAnalysis.viral_score}점 (${viralAnalysis.rating})`);

    // 4. Gemini API로 블로그 글 생성 (자막 + 바이럴 분석 포함)
    console.log('[INFO] AI 블로그 글 생성 중...');
    const blogContent = await generateBlogContent(videoInfo, viralAnalysis, transcript);

    // 4. 이미지 생성 (썸네일 + 본문 이미지)
    console.log('[INFO] 이미지 생성 중...');

    // 환경에 따른 baseUrl 설정 (Vercel, 로컬 등)
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
    const baseUrl = req.headers.origin || `${protocol}://${host}`;
    console.log('[INFO] 이미지 API baseUrl:', baseUrl);

    // 썸네일 생성
    let thumbnailUrl = null;
    try {
      const thumbnailResponse = await axios.post(
        `${baseUrl}/api/generate-thumbnail`,
        {
          postTitle: blogContent.title,
          thumbnailPrompt: blogContent.thumbnail_prompt || thumbnailPrompt || null
        },
        { timeout: 60000 }
      );
      if (thumbnailResponse.data.success) {
        thumbnailUrl = thumbnailResponse.data.imageUrl;
        console.log('[INFO] 썸네일 생성 완료');
      }
    } catch (thumbnailError) {
      console.error('[WARN] 썸네일 생성 실패:', thumbnailError.message);
      thumbnailUrl = `https://picsum.photos/seed/${Date.now()}/1280/720`;
    }

    // 본문 이미지 생성 (사용자 설정 개수만큼)
    let finalContent = blogContent.content;
    // 사용자 입력 프롬프트 우선, 없으면 AI 생성 프롬프트 사용
    const aiImagePrompts = blogContent.image_prompts || [];
    const finalImageCount = Math.min(imageCount, 5);

    console.log(`[INFO] 본문 이미지 ${finalImageCount}장 생성 예정`);

    for (let i = 0; i < finalImageCount; i++) {
      const placeholder = `{{IMAGE_${i + 1}}}`;
      // 사용자 프롬프트가 있으면 우선 사용, 없으면 AI 프롬프트
      const imgPrompt = (userImagePrompts && userImagePrompts[i]) || aiImagePrompts[i] || `${blogContent.title} 관련 이미지 ${i + 1}`;

      try {
        console.log(`[INFO] 본문 이미지 ${i + 1} 생성 중... 프롬프트: ${imgPrompt}`);
        const imgResponse = await axios.post(
          `${baseUrl}/api/generate-thumbnail`,
          {
            postTitle: blogContent.title,
            thumbnailPrompt: imgPrompt
          },
          { timeout: 60000 }
        );
        if (imgResponse.data.success && imgResponse.data.imageUrl) {
          const imgTag = `<div style="margin: 20px 0; text-align: center;"><img src="${imgResponse.data.imageUrl}" alt="본문 이미지 ${i + 1}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" /></div>`;
          // 플레이스홀더가 있으면 교체, 없으면 본문 중간에 삽입
          if (finalContent.includes(placeholder)) {
            finalContent = finalContent.replace(placeholder, imgTag);
          } else {
            // 본문을 대략 n등분하여 이미지 삽입
            const contentParts = finalContent.split('</p>');
            const insertIdx = Math.floor((contentParts.length / (finalImageCount + 1)) * (i + 1));
            if (insertIdx < contentParts.length) {
              contentParts[insertIdx] = contentParts[insertIdx] + '</p>' + imgTag;
              finalContent = contentParts.join('</p>');
            }
          }
          console.log(`[INFO] 본문 이미지 ${i + 1} 생성 완료`);
        }
      } catch (imgError) {
        console.error(`[WARN] 본문 이미지 ${i + 1} 생성 실패:`, imgError.message);
        if (finalContent.includes(placeholder)) {
          finalContent = finalContent.replace(placeholder, '');
        }
      }
    }

    // 남은 플레이스홀더 제거
    finalContent = finalContent.replace(/\{\{IMAGE_\d+\}\}/g, '');

    // 5. 데이터베이스에 저장
    console.log('[INFO] 데이터베이스에 저장 중...');
    const slug = generateSlug(blogContent.title);

    const post = createPost({
      video_id: videoId,
      title: blogContent.title,
      slug: slug,
      content: finalContent,
      meta_description: blogContent.meta_description,
      keywords: Array.isArray(blogContent.keywords)
        ? blogContent.keywords.join(', ')
        : String(blogContent.keywords || ''),
      thumbnail_url: thumbnailUrl,
      status: 'draft',
    });

    console.log('[INFO] 블로그 글 생성 완료:', post.id);

    return res.status(200).json({
      success: true,
      message: '블로그 글이 생성되었습니다!',
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
      },
    });
  } catch (error) {
    console.error('[ERROR] 블로그 글 생성 실패:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message || '블로그 글 생성 중 오류가 발생했습니다',
    });
  }
}
