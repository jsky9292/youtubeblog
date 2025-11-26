// pages/api/analyze-url.js
// 웹 URL 분석 및 AI 재작성 API (저작권 준수)

import { scrapeWebContent, validateUrl } from '../../lib/scraper';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getConfig } from '../../lib/config';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  // 1. URL 검증
  const urlValidation = validateUrl(url);
  if (!urlValidation.valid) {
    return res.status(400).json({
      success: false,
      error: urlValidation.error
    });
  }

  console.log('[URL 분석 시작]', url);

  try {
    // 2. 웹 콘텐츠 스크래핑
    const scraped = await scrapeWebContent(url);

    if (!scraped.success) {
      return res.status(400).json({
        success: false,
        error: scraped.error
      });
    }

    console.log('[스크래핑 완료]', {
      title: scraped.metadata.title,
      contentLength: scraped.content.length
    });

    // 3. Gemini API 키 가져오기
    const config = getConfig();
    if (!config.gemini_api_key) {
      return res.status(400).json({
        success: false,
        error: 'Gemini API 키가 설정되지 않았습니다. 설정 페이지에서 API 키를 입력해주세요.'
      });
    }

    // 4. 랜덤 테마 선택 (bloggogogo 스타일)
    const themes = [
      { name: '블루-그레이', primary: '#1a73e8', secondary: '#f5f5f5', accent: '#e8f4fd' },
      { name: '그린-오렌지', primary: '#00796b', secondary: '#fff3e0', accent: '#e0f2f1' },
      { name: '퍼플-옐로우', primary: '#6200ea', secondary: '#fffde7', accent: '#f3e5f5' }
    ];
    const theme = themes[Math.floor(Math.random() * themes.length)];

    // 5. Gemini AI로 완전히 새로운 콘텐츠 생성 (저작권 준수)
    const genAI = new GoogleGenerativeAI(config.gemini_api_key);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp'
    });

    const prompt = `웹 콘텐츠 기반 구글 SEO 블로그 작성

📄 원본 정보 (참고만 할 것!)
제목: ${scraped.metadata.title || '제목 없음'}
설명: ${scraped.metadata.description || ''}

📝 원본 내용 (심층 분석 필수!)
${scraped.content.substring(0, 3000)}

🎨 테마: ${theme.name} (색상: ${theme.primary})

⚠️ 저작권 준수 필수!
- 원문 복사 절대 금지! 내용을 완전히 재해석
- 마치 내가 직접 경험하고 작성한 것처럼
- 원저자/블로거 언급 금지

✅ 필수 요구사항
- 2,500-3,000자 (한글, 공백 포함)
- ~이에요, ~해요 체
- 원본 내용을 심층 분석하여 재구성
- 표(table) 1개 이상 필수
- 개인적 관점과 경험 추가

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
- 추상적이거나 일반적인 이미지 금지
- 글의 주제, 핵심 키워드를 시각적으로 표현
- 예: 보험 청구 글 → "Korean person filling insurance claim form at desk with documents"

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
  ],
  "originalSourceNote": "이 글은 ${url} 내용을 참고하여 작성되었습니다."
}

JSON만 출력. 다른 텍스트 금지.`;

    console.log('[Gemini AI 호출 중...]');

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    console.log('[AI 응답 받음]', aiResponse.substring(0, 200));

    // 4. JSON 파싱
    let generated;
    try {
      // JSON 코드 블록 제거
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) ||
                        aiResponse.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('AI 응답에서 JSON을 찾을 수 없습니다.');
      }

      const jsonText = jsonMatch[1] || jsonMatch[0];
      generated = JSON.parse(jsonText);

      console.log('[JSON 파싱 성공]', {
        title: generated.title,
        contentLength: generated.content?.length
      });

    } catch (parseError) {
      console.error('[JSON 파싱 실패]', parseError);
      return res.status(500).json({
        success: false,
        error: 'AI 응답 파싱 실패. 다시 시도해주세요.',
        debug: aiResponse.substring(0, 500)
      });
    }

    // 5. 응답 반환
    return res.status(200).json({
      success: true,
      data: {
        title: generated.title,
        content: generated.content,
        meta_description: generated.meta_description,
        keywords: generated.keywords || [],
        thumbnail_prompt: generated.thumbnail_prompt || '',
        image_prompts: generated.image_prompts || [],
        category: generated.category || '일반',
        thumbnail_url: scraped.metadata.image || null, // 원본 이미지를 썸네일 참고용으로
        source: {
          url: url,
          originalTitle: scraped.metadata.title,
          note: generated.originalSourceNote || `이 글은 ${url} 내용을 참고하여 작성되었습니다.`
        }
      },
      warning: '✅ 이 콘텐츠는 AI가 원본을 참고하여 새롭게 작성한 오리지널 콘텐츠입니다.',
      copyrightNotice: '원본 출처는 하단에 표기되었습니다. 저작권을 준수합니다.'
    });

  } catch (error) {
    console.error('[URL 분석 오류]', error);

    return res.status(500).json({
      success: false,
      error: error.message || '콘텐츠 생성 중 오류가 발생했습니다.',
      details: error.toString()
    });
  }
}
