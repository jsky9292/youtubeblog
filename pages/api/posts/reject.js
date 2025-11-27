import { updatePost } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { postId } = req.body;

  if (!postId) {
    return res.status(400).json({ error: 'postId is required' });
  }

  try {
    // 포스트를 삭제 상태로 업데이트
    const updatedPost = await updatePost(postId, {
      status: 'deleted',
      deleted_at: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: '포스트가 삭제되었습니다.',
      post: updatedPost
    });
  } catch (error) {
    console.error('삭제 실패:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
