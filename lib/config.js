// lib/config.js
// API 키 및 설정 관리

const fs = require('fs');
const path = require('path');

const CONFIG_DIR = path.join(process.cwd(), 'data');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

/**
 * 기본 설정
 */
const DEFAULT_CONFIG = {
  youtube_api_key: '',
  gemini_api_key: '',
  telegram_bot_token: '',
  telegram_chat_id: '',
  email_user: '',
  email_pass: '',
  site_url: '',
  min_views: 10000,
  max_results: 20,
  // SNS 채널
  sns_youtube: '',
  sns_instagram: '',
  sns_facebook: '',
  sns_twitter: '',
  sns_blog: '',
  sns_kakao: '',
};

/**
 * 설정 디렉토리 초기화
 */
function initConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }

  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2));
  }
}

/**
 * 설정 읽기
 */
function getConfig() {
  initConfigDir();

  try {
    const data = fs.readFileSync(CONFIG_FILE, 'utf8');
    const config = JSON.parse(data);

    // 환경 변수 우선 (개발 시 사용)
    return {
      youtube_api_key: process.env.YOUTUBE_API_KEY || config.youtube_api_key || '',
      gemini_api_key: process.env.GEMINI_API_KEY || config.gemini_api_key || '',
      telegram_bot_token: process.env.TELEGRAM_BOT_TOKEN || config.telegram_bot_token || '',
      telegram_chat_id: process.env.TELEGRAM_CHAT_ID || config.telegram_chat_id || '',
      email_user: process.env.EMAIL_USER || config.email_user || '',
      email_pass: process.env.EMAIL_PASS || config.email_pass || '',
      site_url: process.env.NEXT_PUBLIC_SITE_URL || config.site_url || 'http://localhost:3000',
      min_views: config.min_views || 10000,
      max_results: config.max_results || 20,
      // SNS 채널
      sns_youtube: config.sns_youtube || '',
      sns_instagram: config.sns_instagram || '',
      sns_facebook: config.sns_facebook || '',
      sns_twitter: config.sns_twitter || '',
      sns_blog: config.sns_blog || '',
      sns_kakao: config.sns_kakao || '',
    };
  } catch (error) {
    console.error('[ERROR] 설정 파일 읽기 실패:', error);
    return DEFAULT_CONFIG;
  }
}

/**
 * 설정 업데이트 (파일 기반만 - 환경변수 무시)
 */
function updateConfig(newConfig) {
  initConfigDir();

  try {
    // 파일에서 직접 읽기 (환경변수 무시)
    let currentConfig = DEFAULT_CONFIG;
    try {
      const data = fs.readFileSync(CONFIG_FILE, 'utf8');
      currentConfig = JSON.parse(data);
    } catch (e) {
      // 파일 없으면 기본값 사용
    }

    const updatedConfig = {
      ...currentConfig,
      ...newConfig,
    };

    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updatedConfig, null, 2));
    console.log('[INFO] 설정 저장됨:', Object.keys(newConfig).join(', '));
    return { success: true, config: updatedConfig };
  } catch (error) {
    console.error('[ERROR] 설정 파일 쓰기 실패:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 특정 설정값 가져오기
 */
function getConfigValue(key) {
  const config = getConfig();
  return config[key] || '';
}

/**
 * API 키 검증
 */
function validateApiKeys() {
  const config = getConfig();

  return {
    youtube: !!config.youtube_api_key,
    gemini: !!config.gemini_api_key,
    telegram: !!config.telegram_bot_token && !!config.telegram_chat_id,
    email: !!config.email_user && !!config.email_pass,
  };
}

module.exports = {
  getConfig,
  updateConfig,
  getConfigValue,
  validateApiKeys,
  DEFAULT_CONFIG,
};
