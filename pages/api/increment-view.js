// pages/api/increment-view.js
// 페이지뷰 증가 API

const fs = require('fs');
const path = require('path');

const POSTS_FILE = path.join(process.cwd(), 'data', 'posts.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { slug } = req.body;

  if (!slug) {
    return res.status(400).json({ success: false, error: 'slug가 필요합니다' });
  }

  try {
    const posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
    const postIndex = posts.findIndex(p => p.slug === slug);

    if (postIndex === -1) {
      return res.status(404).json({ success: false, error: '포스트를 찾을 수 없습니다' });
    }

    // 조회수 증가
    posts[postIndex].view_count = (posts[postIndex].view_count || 0) + 1;
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));

    return res.status(200).json({
      success: true,
      view_count: posts[postIndex].view_count
    });
  } catch (error) {
    console.error('[ERROR] 조회수 증가 실패:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
