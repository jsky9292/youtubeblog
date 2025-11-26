// pages/api/config/sns.js
// SNS 채널 정보 조회 API (공개용)

const { getConfig } = require('../../../lib/config');

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const config = getConfig();

    // SNS 정보만 반환 (보안상 API 키는 제외)
    const snsConfig = {
      youtube: config.sns_youtube || '',
      instagram: config.sns_instagram || '',
      facebook: config.sns_facebook || '',
      twitter: config.sns_twitter || '',
      blog: config.sns_blog || '',
      kakao: config.sns_kakao || '',
    };

    return res.status(200).json({
      success: true,
      sns: snsConfig,
    });
  } catch (error) {
    console.error('[ERROR] SNS 설정 조회 실패:', error);
    return res.status(500).json({
      success: false,
      error: 'SNS 설정 조회 중 오류가 발생했습니다',
    });
  }
}
