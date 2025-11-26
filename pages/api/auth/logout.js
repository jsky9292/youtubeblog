// pages/api/auth/logout.js
// 로그아웃 API

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    
    // 토큰 삭제
    global.adminTokens = global.adminTokens || {};
    delete global.adminTokens[token];
  }

  return res.status(200).json({
    success: true,
    message: '로그아웃 되었습니다.'
  });
}
