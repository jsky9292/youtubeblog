// pages/api/auth/login.js
// 관리자 로그인 API

import crypto from 'crypto';

// 간단한 토큰 생성
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      error: '아이디와 비밀번호를 입력해주세요.' 
    });
  }

  // 환경변수에서 관리자 계정 확인
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234';

  if (username === adminUsername && password === adminPassword) {
    const token = generateToken();
    
    // 토큰 저장 (실제 운영에서는 Redis나 DB 사용 권장)
    // 여기서는 간단하게 메모리에 저장
    global.adminTokens = global.adminTokens || {};
    global.adminTokens[token] = {
      username,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24시간
    };

    return res.status(200).json({
      success: true,
      token,
      user: { username },
      message: '로그인 성공'
    });
  }

  return res.status(401).json({
    success: false,
    error: '아이디 또는 비밀번호가 올바르지 않습니다.'
  });
}
