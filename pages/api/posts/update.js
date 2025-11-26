// pages/api/posts/update.js
import { updatePost } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, title, content, meta_description, thumbnail_url } = req.body;

    if (!id || !title || !content) {
      return res.status(400).json({ success: false, message: '필수 항목이 누락되었습니다.' });
    }

    await updatePost(parseInt(id), {
      title,
      content,
      meta_description,
      thumbnail_url
    });

    return res.status(200).json({ success: true, message: '포스트가 업데이트되었습니다.' });
  } catch (error) {
    console.error('[ERROR] 포스트 업데이트 실패:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
