// pages/api/posts/get.js
import { getPost } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ success: false, message: 'ID가 필요합니다.' });
    }

    const post = getPost(parseInt(id));

    if (!post) {
      return res.status(404).json({ success: false, message: '포스트를 찾을 수 없습니다.' });
    }

    return res.status(200).json({ success: true, post });
  } catch (error) {
    console.error('[ERROR] 포스트 조회 실패:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
