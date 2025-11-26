// pages/api/auth/verify.js
// 토큰 검증 API

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      error: '인증 토큰이 필요합니다.' 
    });
  }

  const token = authHeader.split(' ')[1];
  
  // 토큰 검증
  global.adminTokens = global.adminTokens || {};
  const tokenData = global.adminTokens[token];

  if (!tokenData) {
    return res.status(401).json({ 
      success: false, 
      error: '유효하지 않은 토큰입니다.' 
    });
  }

  // 만료 확인
  if (Date.now() > tokenData.expiresAt) {
    delete global.adminTokens[token];
    return res.status(401).json({ 
      success: false, 
      error: '토큰이 만료되었습니다. 다시 로그인해주세요.' 
    });
  }

  return res.status(200).json({
    success: true,
    user: { username: tokenData.username }
  });
}
