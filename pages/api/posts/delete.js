// pages/api/posts/delete.js
// 포스트 삭제 API

import { deletePost } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug } = req.body;

  if (!slug) {
    return res.status(400).json({
      success: false,
      error: '슬러그가 필요합니다.'
    });
  }

  try {
    const result = deletePost(slug);

    if (result) {
      return res.status(200).json({
        success: true,
        message: '포스트가 삭제되었습니다.'
      });
    } else {
      return res.status(404).json({
        success: false,
        error: '포스트를 찾을 수 없습니다.'
      });
    }
  } catch (error) {
    console.error('[포스트 삭제 오류]', error);
    return res.status(500).json({
      success: false,
      error: '포스트 삭제 중 오류가 발생했습니다.'
    });
  }
}
