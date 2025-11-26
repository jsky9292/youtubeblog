// pages/api/config/validate.js
// API 키 검증 API

const { validateApiKeys } = require('../../../lib/config');

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const validation = validateApiKeys();

      return res.status(200).json({
        success: true,
        validation,
      });
    } catch (error) {
      console.error('[ERROR] API 키 검증 실패:', error);
      return res.status(500).json({
        success: false,
        error: '검증 중 오류가 발생했습니다',
      });
    }
  } else {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
    });
  }
}
