// pages/api/save-web-post.js
// 웹 URL에서 생성된 블로그 포스트 저장 API

import { createPost } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    title,
    content,
    meta_description,
    keywords,
    category,
    thumbnail_url,
    thumbnail_prompt,
    image_prompts,
    source_url,
    source_note
  } = req.body;

  // 필수 필드 검증
  if (!title || !content) {
    return res.status(400).json({
      success: false,
      error: '제목과 내용은 필수입니다.'
    });
  }

  try {
    // slug 생성 (타임스탬프 + 랜덤 문자열)
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const slug = `web-${timestamp}-${randomStr}`;

    // 썸네일 이미지 생성
    let generatedThumbnail = thumbnail_url;
    if (thumbnail_prompt) {
      try {
        console.log('[웹 포스트] 썸네일 이미지 생성 시작');
        const imageResponse = await fetch(`${req.headers.origin || 'http://localhost:3000'}/api/generate-thumbnail`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postTitle: title,
            thumbnailPrompt: thumbnail_prompt
          }),
        });

        const imageData = await imageResponse.json();
        if (imageData.success) {
          generatedThumbnail = imageData.imageUrl;
          console.log('[웹 포스트] 썸네일 생성 완료:', imageData.method);
        }
      } catch (imageError) {
        console.warn('[웹 포스트] 썸네일 생성 실패, 기본값 사용:', imageError.message);
      }
    }

    // 본문 이미지 생성 및 교체
    let finalContent = content;
    if (image_prompts && image_prompts.length > 0) {
      console.log('[웹 포스트] 본문 이미지 생성 시작');
      for (let i = 0; i < image_prompts.length; i++) {
        try {
          const imageResponse = await fetch(`${req.headers.origin || 'http://localhost:3000'}/api/generate-thumbnail`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              postTitle: title,
              thumbnailPrompt: image_prompts[i]
            }),
          });

          const imageData = await imageResponse.json();
          if (imageData.success) {
            const placeholder = `{{IMAGE_${i + 1}}}`;
            const imageHtml = `<img src="${imageData.imageUrl}" alt="${title} - 이미지 ${i + 1}" style="width: 100%; max-width: 800px; height: auto; margin: 20px 0; border-radius: 8px;" />`;
            finalContent = finalContent.replace(placeholder, imageHtml);
            console.log(`[웹 포스트] 이미지 ${i + 1} 생성 완료`);
          }
        } catch (imageError) {
          console.warn(`[웹 포스트] 이미지 ${i + 1} 생성 실패:`, imageError.message);
        }
      }
    }

    // 포스트 데이터 구성
    const postData = {
      title: title.trim(),
      slug: slug,
      content: finalContent,
      meta_description: meta_description || title.substring(0, 150),
      thumbnail_url: generatedThumbnail,
      status: 'draft',
      category: category || '일반',
      keywords: keywords || [],
      source_type: 'web',
      source_url: source_url,
      source_note: source_note,
      video_id: null
    };

    console.log('[웹 포스트 저장]', {
      title: postData.title,
      slug: postData.slug,
      category: postData.category,
      source_url: source_url,
      has_thumbnail: !!generatedThumbnail
    });

    // DB에 저장
    const savedPost = createPost(postData);

    return res.status(200).json({
      success: true,
      post: savedPost,
      message: '웹 콘텐츠 기반 블로그 글이 저장되었습니다. 관리자 대시보드에서 검토 후 발행하세요.'
    });

  } catch (error) {
    console.error('[웹 포스트 저장 실패]', error);

    return res.status(500).json({
      success: false,
      error: '포스트 저장 중 오류가 발생했습니다.',
      details: error.message
    });
  }
}
