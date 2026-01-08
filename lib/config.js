// lib/config.js
// API 키 및 설정 관리

let fs;
let path;

// Vercel 서버리스 환경에서는 fs 모듈이 제한될 수 있음
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

if (!isServerless) {
  try {
    fs = require('fs');
    path = require('path');
  } catch (e) {
    // fs/path 모듈 로드 실패 시 무시
  }
}

const CONFIG_DIR = !isServerless && path ? path.join(process.cwd(), 'data') : '';
const CONFIG_FILE = !isServerless && path ? path.join(CONFIG_DIR, 'config.json') : '';

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
  // 서버리스 환경에서는 파일 시스템 사용 불가
  if (isServerless || !fs) return;

  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }

    if (!fs.existsSync(CONFIG_FILE)) {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2));
    }
  } catch (e) {
    // 서버리스 환경에서 파일 시스템 접근 실패 시 무시
  }
}

/**
 * 설정 읽기
 */
function getConfig() {
  // 서버리스 환경에서는 환경 변수만 사용
  if (isServerless || !fs) {
    return {
      youtube_api_key: process.env.YOUTUBE_API_KEY || '',
      gemini_api_key: process.env.GEMINI_API_KEY || '',
      telegram_bot_token: process.env.TELEGRAM_BOT_TOKEN || '',
      telegram_chat_id: process.env.TELEGRAM_CHAT_ID || '',
      email_user: process.env.EMAIL_USER || '',
      email_pass: process.env.EMAIL_PASS || '',
      site_url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ins-prosoultion.com',
      min_views: 10000,
      max_results: 20,
      sns_youtube: process.env.SNS_YOUTUBE || '',
      sns_instagram: process.env.SNS_INSTAGRAM || '',
      sns_facebook: process.env.SNS_FACEBOOK || '',
      sns_twitter: process.env.SNS_TWITTER || '',
      sns_blog: process.env.SNS_BLOG || '',
      sns_kakao: process.env.SNS_KAKAO || '',
    };
  }

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
  // 서버리스 환경에서는 파일 시스템에 쓸 수 없음
  if (isServerless || !fs) {
    console.log('[INFO] 서버리스 환경: 설정 저장 불가 (환경 변수 사용 필요)');
    return { success: false, error: '서버리스 환경에서는 설정을 저장할 수 없습니다. Vercel 환경 변수를 사용하세요.' };
  }

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
