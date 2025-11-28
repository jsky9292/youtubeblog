// pages/api/posts/update.js
import { updatePost } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, postId, title, content, meta_description, thumbnail_url, category } = req.body;
    const actualId = id || postId;

    if (!actualId || !title) {
      return res.status(400).json({ success: false, error: '필수 항목이 누락되었습니다.' });
    }

    const updates = { title };
    if (content !== undefined) updates.content = content;
    if (meta_description !== undefined) updates.meta_description = meta_description;
    if (thumbnail_url !== undefined) updates.thumbnail_url = thumbnail_url;
    if (category !== undefined) updates.category = category;

    await updatePost(parseInt(actualId), updates);

    return res.status(200).json({ success: true, message: '포스트가 업데이트되었습니다.' });
  } catch (error) {
    console.error('[ERROR] 포스트 업데이트 실패:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
