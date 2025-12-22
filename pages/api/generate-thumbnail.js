// pages/api/generate-thumbnail.js
// Gemini Imagen API를 사용한 AI 썸네일 이미지 생성

const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const { getConfigValue } = require('../../lib/config');
const sharp = require('sharp');

// Supabase 클라이언트
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Supabase Storage에 이미지 업로드
 */
async function uploadToStorage(base64Data) {
  const imageBuffer = Buffer.from(base64Data, 'base64');

  const optimizedBuffer = await sharp(imageBuffer)
    .resize(1280, 720, { fit: 'cover' })
    .jpeg({ quality: 70, progressive: true })
    .toBuffer();

  const fileName = `thumb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;

  const { data, error } = await supabase.storage
    .from('thumbnails')
    .upload(fileName, optimizedBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    });

  if (error) {
    console.error('[ERROR] Storage 업로드 실패:', error);
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from('thumbnails')
    .getPublicUrl(fileName);

  console.log('[INFO] Storage 업로드 성공:', urlData.publicUrl);
  return urlData.publicUrl;
}

/**
 * Gemini로 AI 이미지 생성 - 2025 최신 모델
 * Nano Banana Pro (gemini-3-pro-image-preview) > Nano Banana (gemini-2.5-flash-image)
 */
async function generateImageWithGemini(postTitle, thumbnailPrompt) {
  const GEMINI_API_KEY = getConfigValue('gemini_api_key');

  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API 키가 설정되지 않았습니다.');
  }

  try {
    console.log('[INFO] Gemini 이미지 생성 시작');

    const imagePrompt = thumbnailPrompt
      ? `${thumbnailPrompt}, photorealistic, 1280x720 resolution, optimized for web, 16:9 aspect ratio, no text overlay`
      : `Professional blog thumbnail about: ${postTitle}. Photorealistic, modern style, 1280x720 resolution, optimized for web, 16:9 aspect ratio, no text`;

    console.log('[INFO] 이미지 생성 프롬프트:', imagePrompt);

    // 2025년 최신 Gemini 이미지 모델 (우선순위 순)
    const models = [
      'gemini-3-pro-image-preview',    // Nano Banana Pro - 최고 품질 (4096px)
      'gemini-2.5-flash-image',         // Nano Banana - 빠른 생성 (1024px)
      'gemini-2.0-flash-exp-image-generation'  // 레거시 폴백
    ];

    let lastError;

    for (const model of models) {
      try {
        console.log(`[INFO] ${model} 모델로 이미지 생성 시도...`);

        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
          {
            contents: [{
              parts: [{ text: `Generate a high-quality image: ${imagePrompt}` }]
            }],
            generationConfig: {
              responseModalities: ['IMAGE', 'TEXT']
            }
          },
          {
            timeout: 90000,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        console.log(`[DEBUG] ${model} 응답 상태:`, response.status);

        // 이미지 응답 확인
        if (response.data?.candidates?.[0]?.content?.parts) {
          const parts = response.data.candidates[0].content.parts;
          for (const part of parts) {
            if (part.inlineData?.mimeType?.startsWith('image/')) {
              const base64Image = part.inlineData.data;
              console.log(`[INFO] ${model} 이미지 생성 성공! (${part.inlineData.mimeType})`);
              // Supabase Storage에 업로드하고 URL 반환
              return await uploadToStorage(base64Image);
            }
          }
          console.log(`[WARN] ${model}: 응답에 이미지 없음, parts:`, parts.map(p => Object.keys(p)));
        } else {
          console.log(`[WARN] ${model}: candidates 없음`);
        }
      } catch (err) {
        const errorMsg = err.response?.data?.error?.message || err.message;
        console.log(`[WARN] ${model} 실패:`, errorMsg);
        lastError = err;

        // 모델이 없는 경우 다음 모델로
        if (errorMsg.includes('not found') || errorMsg.includes('does not exist')) {
          continue;
        }
      }
    }

    throw lastError || new Error('모든 Gemini 이미지 모델 실패');
  } catch (error) {
    console.error('[ERROR] Gemini 이미지 생성 실패:', error.message);
    throw error;
  }
}

/**
 * 영어 프롬프트에서 Unsplash 검색용 키워드 추출
 */
function extractKeywordsFromPrompt(text) {
  const englishKeywords = text.match(/\b[a-zA-Z]{4,}\b/g) || [];
  const stopWords = ['with', 'that', 'this', 'from', 'have', 'been', 'will', 'would', 'could', 'should', 'being', 'their', 'about', 'which', 'when', 'there', 'your', 'more', 'some', 'very', 'just', 'into', 'over', 'such', 'only', 'other', 'than', 'then', 'also', 'back', 'after', 'most', 'made', 'make', 'like', 'image', 'photo', 'style', 'aspect', 'ratio', 'high', 'quality', 'vibrant', 'colors', 'photorealistic', 'modern', 'professional'];
  const filtered = englishKeywords.filter(w => !stopWords.includes(w.toLowerCase()));

  if (filtered.length >= 2) {
    console.log('[INFO] 프롬프트에서 추출한 키워드:', filtered.slice(0, 3).join(','));
    return filtered.slice(0, 3).join(',');
  }

  return extractKeywords(text);
}

/**
 * Fallback: Unsplash API로 관련 이미지 검색
 */
function extractKeywords(title) {
  const keywordMap = {
    '여행': 'travel',
    '맛집': 'food',
    '일본': 'japan',
    '오사카': 'osaka',
    '교토': 'kyoto',
    '도쿄': 'tokyo',
    '보험': 'insurance',
    '손해사정': 'insurance claim',
    '건강': 'health',
    '운동': 'fitness',
    '요리': 'cooking',
    '카페': 'cafe',
    '레스토랑': 'restaurant',
    '패션': 'fashion',
    '뷰티': 'beauty',
    '기술': 'technology',
    '리뷰': 'review',
    '가이드': 'guide',
    '팁': 'tips'
  };

  const foundKeywords = [];
  Object.keys(keywordMap).forEach(korean => {
    if (title.includes(korean)) {
      foundKeywords.push(keywordMap[korean]);
    }
  });

  if (foundKeywords.length === 0) {
    foundKeywords.push('modern', 'blog', 'content');
  }

  return foundKeywords.slice(0, 3).join(',');
}

async function generateImageWithUnsplash(postTitle, thumbnailPrompt) {
  try {
    console.log('[INFO] Fallback: Unsplash API로 이미지 검색');
    const searchText = thumbnailPrompt || postTitle;
    const keywords = extractKeywordsFromPrompt(searchText);
    const uniqueId = Date.now();

    const response = await axios.get(
      `https://source.unsplash.com/1280x720/?${keywords}`,
      { timeout: 10000, maxRedirects: 5 }
    );

    const imageUrl = response.request?.res?.responseUrl || `https://source.unsplash.com/1280x720/?${keywords}&sig=${uniqueId}`;
    console.log('[INFO] Unsplash 이미지 URL:', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('[WARN] Unsplash 실패:', error.message);
    const uniqueId = Date.now();
    return `https://picsum.photos/seed/${uniqueId}/1280/720`;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
    });
  }

  const { postTitle, thumbnailPrompt } = req.body;

  if (!postTitle) {
    return res.status(400).json({
      success: false,
      error: '포스트 제목이 필요합니다',
    });
  }

  console.log(`[INFO] 썸네일 생성 시작 - 제목: ${postTitle}`);

  try {
    // 1차 시도: Gemini로 AI 이미지 생성
    let imageUrl;
    try {
      imageUrl = await generateImageWithGemini(postTitle, thumbnailPrompt);
      console.log('[INFO] Gemini AI 썸네일 생성 완료');

      return res.status(200).json({
        success: true,
        imageUrl,
        message: 'AI 썸네일이 생성되었습니다!',
        method: 'gemini'
      });
    } catch (geminiError) {
      console.log('[WARN] Gemini 실패, Unsplash로 전환:', geminiError.message);

      // 2차 시도: Unsplash로 이미지 검색
      imageUrl = await generateImageWithUnsplash(postTitle, thumbnailPrompt);
      console.log('[INFO] Unsplash 썸네일 생성 완료');

      return res.status(200).json({
        success: true,
        imageUrl,
        message: '썸네일이 생성되었습니다!',
        method: 'unsplash'
      });
    }
  } catch (error) {
    console.error('[ERROR] 썸네일 생성 완전 실패:', error.message);

    // 3차 시도: 플레이스홀더 반환
    const uniqueId = Date.now();
    return res.status(200).json({
      success: true,
      imageUrl: `https://picsum.photos/seed/${uniqueId}/1280/720`,
      message: '기본 썸네일이 생성되었습니다',
      method: 'placeholder'
    });
  }
}
