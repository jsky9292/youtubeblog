// pages/api/auth/login.js
// 관리자 로그인 API - JWT 기반 (Vercel 서버리스 호환)

import jwt from 'jsonwebtoken';

// JWT 시크릿 키 (환경변수 또는 기본값)
const JWT_SECRET = process.env.JWT_SECRET || process.env.ADMIN_PASSWORD || 'super-secret-jwt-key-change-in-production';

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

  // 관리자 계정 (하드코딩)
  const adminUsername = 'bidbuy';
  const adminPassword = 'bidbuy2024!';

  if (username === adminUsername && password === adminPassword) {
    // JWT 토큰 생성 (24시간 유효)
    const token = jwt.sign(
      {
        username,
        role: 'admin',
        iat: Math.floor(Date.now() / 1000)
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

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
