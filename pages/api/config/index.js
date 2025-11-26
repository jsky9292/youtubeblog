// pages/api/config/index.js
// API 키 설정 관리 API

const { getConfig, updateConfig } = require('../../../lib/config');

export default function handler(req, res) {
  if (req.method === 'GET') {
    // 설정 조회
    try {
      const config = getConfig();

      // API 키는 부분적으로만 반환 (보안)
      const safeConfig = {
        ...config,
        youtube_api_key: config.youtube_api_key || '',
        gemini_api_key: config.gemini_api_key || '',
        telegram_bot_token: config.telegram_bot_token || '',
        telegram_chat_id: config.telegram_chat_id || '',
        // 비밀번호는 반환하지 않음
        email_pass: config.email_pass ? '••••••••' : '',
      };

      return res.status(200).json({
        success: true,
        config: safeConfig,
      });
    } catch (error) {
      console.error('[ERROR] 설정 조회 실패:', error);
      return res.status(500).json({
        success: false,
        error: '설정 조회 중 오류가 발생했습니다',
      });
    }
  } else if (req.method === 'POST') {
    // 설정 업데이트
    try {
      const newConfig = req.body;

      // 빈 값은 제외
      const filteredConfig = {};
      Object.keys(newConfig).forEach((key) => {
        const value = newConfig[key];
        // 문자열이면 trim, 숫자면 그대로
        if (typeof value === 'string' && value.trim() !== '') {
          filteredConfig[key] = value.trim();
        } else if (typeof value === 'number') {
          filteredConfig[key] = value;
        }
      });

      const result = updateConfig(filteredConfig);

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: '설정이 업데이트되었습니다',
        });
      } else {
        return res.status(500).json({
          success: false,
          error: result.error || '설정 업데이트 실패',
        });
      }
    } catch (error) {
      console.error('[ERROR] 설정 업데이트 실패:', error);
      return res.status(500).json({
        success: false,
        error: '설정 업데이트 중 오류가 발생했습니다',
      });
    }
  } else {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
    });
  }
}
