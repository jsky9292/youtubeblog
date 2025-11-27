import { getDraftPosts, getPublishedPosts, updatePost } from '../../../lib/db';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { postId, category } = req.body;

  if (!postId) {
    return res.status(400).json({ error: 'postId is required' });
  }

  try {
    console.log(`[Approve] 발행 요청 - postId: ${postId}, category: ${category}`);

    // 포스트를 발행 상태로 업데이트 (카테고리 포함)
    const updatedPost = await updatePost(postId, {
      status: 'published',
      published_at: new Date().toISOString(),
      category: category || 'life' // 기본값: 생활정보
    });

    console.log(`[Approve] 업데이트 완료 - id: ${updatedPost.id}, status: ${updatedPost.status}, slug: ${updatedPost.slug}, category: ${updatedPost.category}`);

    // 홈페이지 재검증 시도 (ISR)
    try {
      await res.revalidate('/');
      console.log('[Approve] 홈페이지 재검증 완료');

      // 포스트 상세 페이지도 재검증
      if (updatedPost.slug) {
        await res.revalidate(`/posts/${updatedPost.slug}`);
        console.log(`[Approve] 포스트 페이지 재검증 완료: /posts/${updatedPost.slug}`);
      }

      // 카테고리 페이지 재검증
      if (updatedPost.category) {
        await res.revalidate(`/category/${updatedPost.category}`);
        console.log(`[Approve] 카테고리 페이지 재검증 완료: /category/${updatedPost.category}`);
      }
    } catch (revalidateError) {
      console.error('[Approve] 재검증 실패 (무시):', revalidateError.message);
    }

    return res.status(200).json({
      success: true,
      message: '포스트가 발행되었습니다!',
      post: {
        id: updatedPost.id,
        title: updatedPost.title,
        slug: updatedPost.slug,
        status: updatedPost.status,
        category: updatedPost.category,
        published_at: updatedPost.published_at
      }
    });
  } catch (error) {
    console.error('발행 실패:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
