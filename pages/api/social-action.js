// pages/api/social-action.js
// 좋아요/댓글 API

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');
const SOCIAL_FILE = path.join(DATA_DIR, 'social.json');

function initSocialFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(SOCIAL_FILE)) {
    fs.writeFileSync(SOCIAL_FILE, JSON.stringify({}, null, 2));
  }
}

function getSocialData() {
  initSocialFile();
  return JSON.parse(fs.readFileSync(SOCIAL_FILE, 'utf8'));
}

function saveSocialData(data) {
  fs.writeFileSync(SOCIAL_FILE, JSON.stringify(data, null, 2));
}

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ success: false, error: 'slug가 필요합니다' });
  }

  // GET: 소셜 데이터 조회
  if (req.method === 'GET') {
    try {
      const social = getSocialData();
      const postSocial = social[slug] || { likes: 0, comments: [] };
      return res.status(200).json({ success: true, data: postSocial });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // POST: 좋아요 또는 댓글 추가
  if (req.method === 'POST') {
    const { action, comment, author } = req.body;

    try {
      const social = getSocialData();

      if (!social[slug]) {
        social[slug] = { likes: 0, comments: [] };
      }

      if (action === 'like') {
        social[slug].likes += 1;
        saveSocialData(social);
        return res.status(200).json({ success: true, likes: social[slug].likes });
      }

      if (action === 'comment' && comment) {
        const newComment = {
          id: Date.now(),
          author: author || '익명',
          content: comment,
          created_at: new Date().toISOString()
        };
        social[slug].comments.push(newComment);
        saveSocialData(social);
        return res.status(200).json({ success: true, comment: newComment });
      }

      return res.status(400).json({ success: false, error: '잘못된 요청입니다' });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
