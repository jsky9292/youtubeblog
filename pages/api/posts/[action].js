// pages/api/posts/[action].js
// 포스트 관리 API (승인, 거절, 수정 등)

const fs = require('fs');
const path = require('path');

const POSTS_FILE = path.join(process.cwd(), 'data', 'posts.json');

function readPosts() {
  const data = fs.readFileSync(POSTS_FILE, 'utf-8');
  return JSON.parse(data);
}

function writePosts(posts) {
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf-8');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: '허용되지 않은 메소드입니다' });
  }

  const { action } = req.query;
  const { postId, title, content, meta_description, keywords } = req.body;

  if (!postId) {
    return res.status(400).json({ success: false, error: 'postId가 필요합니다' });
  }

  try {
    const posts = readPosts();
    const postIndex = posts.findIndex((p) => p.id === postId);

    if (postIndex === -1) {
      return res.status(404).json({ success: false, error: '포스트를 찾을 수 없습니다' });
    }

    switch (action) {
      case 'approve':
        // 즉시 발행
        posts[postIndex].status = 'published';
        posts[postIndex].updated_at = new Date().toISOString();
        writePosts(posts);
        console.log(`[INFO] 포스트 발행: ID=${postId}`);
        return res.status(200).json({ success: true, message: '포스트가 발행되었습니다' });

      case 'reject':
        // 포스트 삭제
        posts.splice(postIndex, 1);
        writePosts(posts);
        console.log(`[INFO] 포스트 삭제: ID=${postId}`);
        return res.status(200).json({ success: true, message: '포스트가 삭제되었습니다' });

      case 'update':
        // 포스트 수정
        if (title) posts[postIndex].title = title;
        if (content) posts[postIndex].content = content;
        if (meta_description) posts[postIndex].meta_description = meta_description;
        if (keywords) posts[postIndex].keywords = keywords;
        posts[postIndex].updated_at = new Date().toISOString();
        writePosts(posts);
        console.log(`[INFO] 포스트 수정: ID=${postId}`);
        return res.status(200).json({ success: true, message: '포스트가 수정되었습니다' });

      default:
        return res.status(400).json({ success: false, error: '알 수 없는 작업입니다' });
    }
  } catch (error) {
    console.error('[ERROR] 포스트 관리 실패:', error.message);
    return res.status(500).json({
      success: false,
      error: '포스트 관리 중 오류가 발생했습니다',
      details: error.message,
    });
  }
}
