import { updatePost } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { postId, scheduledAt } = req.body;

  if (!postId || !scheduledAt) {
    return res.status(400).json({ error: 'postId and scheduledAt are required' });
  }

  try {
    // 포스트를 예약 상태로 업데이트
    const updatedPost = await updatePost(parseInt(postId), {
      status: 'scheduled',
      scheduled_at: new Date(scheduledAt).toISOString()
    });

    return res.status(200).json({
      success: true,
      message: `포스트가 ${scheduledAt}에 예약되었습니다.`,
      post: updatedPost
    });
  } catch (error) {
    console.error('예약 실패:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
