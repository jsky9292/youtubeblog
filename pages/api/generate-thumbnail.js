// pages/api/generate-thumbnail.js
// Gemini Imagen API를 사용한 AI 썸네일 이미지 생성

const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const { getConfigValue } = require('../../lib/config');
const sharp = require('sharp');

// Supabase 클라이언트 생성
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 이미지를 Supabase Storage에 업로드하고 public URL 반환
 */
async function uploadToSupabaseStorage(base64Data, fileName) {
  try {
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Sharp로 이미지 최적화
    const optimizedBuffer = await sharp(imageBuffer)
      .resize(1280, 720, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from('thumbnails')
      .upload(fileName, optimizedBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error('[ERROR] Supabase Storage 업로드 실패:', error);
      throw error;
    }

    // Public URL 생성
    const { data: urlData } = supabase.storage
      .from('thumbnails')
      .getPublicUrl(fileName);

    console.log('[INFO] Supabase Storage 업로드 성공:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('[ERROR] 이미지 업로드 실패:', error.message);
    throw error;
  }
}

/**
 * Gemini 2.0 Flash로 AI 이미지 생성 (generateContent + responseModalities)
 */
async function generateImageWithGemini(postTitle, thumbnailPrompt) {
  const GEMINI_API_KEY = getConfigValue('gemini_api_key');

  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API 키가 설정되지 않았습니다.');
  }

  try {
    console.log('[INFO] Gemini 이미지 생성 시작');

    const imagePrompt = (thumbnailPrompt ? `${thumbnailPrompt}, photorealistic, real photo, no text, no words, no letters, no writing on image` : `Professional modern blog thumbnail for: ${postTitle}. High quality, photorealistic real photo, no text, no words, no letters, 16:9 aspect ratio`);

    console.log('[INFO] 이미지 생성 프롬프트:', imagePrompt);

    // Gemini 이미지 생성 모델 시도 (2.5 > 2.0 순서)
    const models = ['gemini-2.5-flash-image', 'gemini-2.0-flash-exp-image-generation'];
    let response;
    let lastError;

    for (const model of models) {
      try {
        console.log(`[INFO] ${model} 모델로 이미지 생성 시도...`);
        response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
          {
            contents: [{
              parts: [{ text: `Generate an image: ${imagePrompt}` }]
            }],
            generationConfig: {
              responseModalities: ['TEXT', 'IMAGE']
            }
          },
          { timeout: 60000 }
        );

        // 이미지 응답 확인
        if (response.data?.candidates?.[0]?.content?.parts) {
          const parts = response.data.candidates[0].content.parts;
          for (const part of parts) {
            if (part.inlineData?.mimeType?.startsWith('image/')) {
              const base64Image = part.inlineData.data;
              console.log(`[INFO] ${model} 이미지 생성 성공`);

              // Supabase Storage에 업로드
              const fileName = `thumbnail-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
              return await uploadToSupabaseStorage(base64Image, fileName);
            }
          }
        }
        console.log(`[WARN] ${model}: 이미지 응답 없음`);
      } catch (err) {
        console.log(`[WARN] ${model} 실패:`, err.response?.data?.error?.message || err.message);
        lastError = err;
      }
    }

    throw lastError || new Error('모든 Gemini 이미지 모델 실패');
  } catch (error) {
    console.error('[WARN] Gemini 이미지 생성 실패:', error.message);
    throw error;
  }
}

/**
 * 영어 프롬프트에서 Unsplash 검색용 키워드 추출
 */
function extractKeywordsFromPrompt(text) {
  // 영어 프롬프트라면 주요 명사/형용사 추출
  const englishKeywords = text.match(/\b[a-zA-Z]{4,}\b/g) || [];
  // 불용어 제거
  const stopWords = ['with', 'that', 'this', 'from', 'have', 'been', 'will', 'would', 'could', 'should', 'being', 'their', 'about', 'which', 'when', 'there', 'your', 'more', 'some', 'very', 'just', 'into', 'over', 'such', 'only', 'other', 'than', 'then', 'also', 'back', 'after', 'most', 'made', 'make', 'like', 'image', 'photo', 'style', 'aspect', 'ratio', 'high', 'quality', 'vibrant', 'colors', 'photorealistic', 'modern', 'professional'];
  const filtered = englishKeywords.filter(w => !stopWords.includes(w.toLowerCase()));

  if (filtered.length >= 2) {
    console.log('[INFO] 프롬프트에서 추출한 키워드:', filtered.slice(0, 3).join(','));
    return filtered.slice(0, 3).join(',');
  }

  // 영어 키워드가 충분하지 않으면 한글 키워드 추출
  return extractKeywords(text);
}

/**
 * Fallback: Unsplash API로 관련 이미지 검색 (한글 제목용)
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
    // 프롬프트가 있으면 프롬프트에서 키워드 추출, 없으면 제목에서 추출
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
    // 고유 ID 추가하여 매번 다른 이미지 반환
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

      // 2차 시도: Unsplash로 이미지 검색 (프롬프트 전달)
      imageUrl = await generateImageWithUnsplash(postTitle, thumbnailPrompt);
      console.log('[INFO] Unsplash 썸네일 생성 완료 (프롬프트 기반)');

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
