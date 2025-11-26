// pages/api/generate-image.js
// Gemini Imagen API를 사용한 이미지 생성

const axios = require('axios');
const { getConfigValue } = require('../../lib/config');

/**
 * 사용자 프롬프트 기반으로 이미지 프롬프트 다양하게 생성
 */
async function generateImagePrompt(userPrompt, count = 1) {
  const GEMINI_API_KEY = getConfigValue('gemini_api_key');

  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API 키가 설정되지 않았습니다.');
  }

  const analysisPrompt = `다음 요청에 맞는 이미지 생성 프롬프트를 ${count}개 만들어주세요:

사용자 요청: ${userPrompt}

요구사항:
1. 주제와 관련된 전문적이고 신뢰감 있는 이미지
2. 사진 스타일의 현실적인 이미지 (일러스트 X)
3. 글의 맥락에 맞는 고품질 이미지
4. 텍스트나 로고가 없는 순수한 이미지
5. 각 프롬프트는 100자 이내의 영어로 작성
6. ${count}개의 서로 다른 각도/구도/스타일로 다양하게 생성

출력 형식 (JSON만):
{
  "prompts": [
    {"prompt": "영어 프롬프트 1", "suggestion": "활용 팁 1"},
    {"prompt": "영어 프롬프트 2", "suggestion": "활용 팁 2"}
    ...
  ]
}`;

  try {
    // 여러 모델 시도
    const models = ['gemini-2.5-flash', 'gemini-2.0-flash-exp', 'gemini-2.0-flash'];
    let response;
    let lastError;

    for (const model of models) {
      try {
        console.log(`[INFO] 이미지 프롬프트 생성 - ${model} 모델로 시도 중...`);
        response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
          {
            contents: [{
              parts: [{
                text: analysisPrompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            }
          },
          { timeout: 30000 }
        );
        console.log(`[INFO] ${model} 모델 사용 성공!`);
        break;
      } catch (err) {
        console.log(`[WARN] ${model} 모델 실패:`, err.response?.data?.error?.message || err.message);
        lastError = err;
        if (model === models[models.length - 1]) {
          throw lastError;
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // 응답 검증
    if (!response.data.candidates || !response.data.candidates[0]) {
      console.error('[ERROR] Gemini API 응답 없음:', JSON.stringify(response.data, null, 2));
      throw new Error('Gemini API에서 응답을 받지 못했습니다');
    }

    const candidate = response.data.candidates[0];
    if (!candidate.content || !candidate.content.parts || !candidate.content.parts[0]) {
      console.error('[ERROR] Gemini API 응답 구조 이상:', JSON.stringify(candidate, null, 2));
      throw new Error('Gemini API 응답 형식이 올바르지 않습니다');
    }

    const generatedText = candidate.content.parts[0].text;
    console.log('[DEBUG] Gemini 원본 응답:', generatedText);

    const cleanedText = generatedText
      .replace(/```json\n/g, '')
      .replace(/```/g, '')
      .trim();

    const result = JSON.parse(cleanedText);

    if (result.prompts && Array.isArray(result.prompts)) {
      return result.prompts;
    } else if (result.prompt) {
      return [{ prompt: result.prompt, suggestion: result.suggestion || '' }];
    } else {
      throw new Error('생성된 프롬프트 형식이 올바르지 않습니다');
    }
  } catch (error) {
    console.error('[ERROR] 이미지 프롬프트 생성 실패:', error.message);
    if (error.response) {
      console.error('[ERROR] Gemini API 응답:', error.response.data);
    }
    throw new Error('이미지 프롬프트 생성 중 오류가 발생했습니다');
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
    });
  }

  const { customPrompt, count = 1 } = req.body;

  if (!customPrompt) {
    return res.status(400).json({
      success: false,
      error: '이미지 프롬프트를 입력해주세요',
    });
  }

  console.log(`[INFO] 이미지 프롬프트 생성 시작 (${count}개)`);

  try {
    // 사용자 프롬프트로 다양한 이미지 프롬프트 생성
    console.log('[INFO] AI 이미지 프롬프트 생성 중...');
    const imagePrompts = await generateImagePrompt(customPrompt, count);
    console.log('[INFO] 생성된 프롬프트 개수:', imagePrompts.length);

    console.log('[INFO] 이미지 프롬프트 생성 완료');

    return res.status(200).json({
      success: true,
      message: `이미지 프롬프트 ${imagePrompts.length}개가 생성되었습니다!`,
      images: imagePrompts,
    });
  } catch (error) {
    console.error('[ERROR] 이미지 생성 실패:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message || '이미지 생성 중 오류가 발생했습니다',
    });
  }
}
