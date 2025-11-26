// pages/admin/settings.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function Settings() {
  const router = useRouter();
  const [config, setConfig] = useState({
    youtube_api_key: '',
    gemini_api_key: '',
    telegram_bot_token: '',
    telegram_chat_id: '',
    min_views: 10000,
    max_results: 20,
    // SNS 채널
    sns_youtube: '',
    sns_instagram: '',
    sns_facebook: '',
    sns_twitter: '',
    sns_blog: '',
    sns_kakao: '',
  });

  const [validation, setValidation] = useState({
    youtube: false,
    gemini: false,
    telegram: false,
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [keyStatus, setKeyStatus] = useState({
    youtube: false,
    gemini: false,
    telegram: false,
  });

  // 설정 불러오기
  useEffect(() => {
    fetchConfig();
    fetchValidation();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      if (data.success) {
        // API 키는 빈 문자열로 표시 (보안상 서버에서 마스킹된 값만 옴)
        // 새로운 값을 입력해야만 저장됨
        setConfig({
          youtube_api_key: '',
          gemini_api_key: '',
          telegram_bot_token: '',
          telegram_chat_id: data.config.telegram_chat_id || '',
          min_views: data.config.min_views || 10000,
          max_results: data.config.max_results || 20,
          // SNS 채널
          sns_youtube: data.config.sns_youtube || '',
          sns_instagram: data.config.sns_instagram || '',
          sns_facebook: data.config.sns_facebook || '',
          sns_twitter: data.config.sns_twitter || '',
          sns_blog: data.config.sns_blog || '',
          sns_kakao: data.config.sns_kakao || '',
        });
        // 저장된 키가 있는지 표시
        setKeyStatus({
          youtube: !!data.config.youtube_api_key,
          gemini: !!data.config.gemini_api_key,
          telegram: !!data.config.telegram_bot_token,
        });
      }
    } catch (error) {
      console.error('설정 불러오기 실패:', error);
    }
  };

  const fetchValidation = async () => {
    try {
      const res = await fetch('/api/config/validate');
      const data = await res.json();
      if (data.success) {
        setValidation(data.validation);
      }
    } catch (error) {
      console.error('검증 실패:', error);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // 빈 값은 제외하고 전송 (빈 문자열이면 기존 값 유지)
      const updateData = {};
      Object.keys(config).forEach((key) => {
        const value = config[key];
        if (typeof value === 'string' && value.trim() !== '') {
          updateData[key] = value.trim();
        } else if (typeof value === 'number') {
          updateData[key] = value;
        }
      });

      const res = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: '✅ 설정이 저장되었습니다!' });
        alert('✅ 설정이 성공적으로 저장되었습니다!');
        fetchValidation();
        setTimeout(() => {
          fetchConfig();
        }, 1000);
      } else {
        setMessage({ type: 'error', text: `❌ ${data.error}` });
        alert(`❌ 저장 실패: ${data.error}`);
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ 저장 실패: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">⚙️ 시스템 설정</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← 대시보드로 돌아가기
          </button>
        </div>
        <p className="text-gray-600 mb-8">
          API 키 및 시스템 설정을 관리합니다
        </p>

        {/* 상태 표시 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📊 API 상태</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`p-4 rounded-lg border-2 ${
                validation.youtube
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">YouTube API</span>
                <span className="text-2xl">
                  {validation.youtube ? '✅' : '❌'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {validation.youtube ? '정상 작동' : '키 필요'}
              </p>
            </div>

            <div
              className={`p-4 rounded-lg border-2 ${
                validation.gemini
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Gemini API</span>
                <span className="text-2xl">
                  {validation.gemini ? '✅' : '❌'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {validation.gemini ? '정상 작동' : '키 필요'}
              </p>
            </div>

            <div
              className={`p-4 rounded-lg border-2 ${
                validation.telegram
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Telegram (선택)</span>
                <span className="text-2xl">
                  {validation.telegram ? '✅' : '⚪'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {validation.telegram ? '정상 작동' : '선택사항'}
              </p>
            </div>
          </div>
        </div>

        {/* 설정 폼 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">🔑 API 키 설정</h2>

          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* YouTube API */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube Data API v3 키 <span className="text-red-500">*</span>
              {keyStatus.youtube && <span className="ml-2 text-green-600 text-xs">(저장됨 ✓)</span>}
            </label>
            <input
              type="text"
              name="youtube_api_key"
              value={config.youtube_api_key}
              onChange={handleChange}
              placeholder={keyStatus.youtube ? "새 키를 입력하면 기존 키가 교체됩니다" : "AIza..."}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google Cloud Console에서 발급 →
              </a>
            </p>
          </div>

          {/* Gemini API */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Gemini API 키 <span className="text-red-500">*</span>
              {keyStatus.gemini && <span className="ml-2 text-green-600 text-xs">(저장됨 ✓)</span>}
            </label>
            <input
              type="text"
              name="gemini_api_key"
              value={config.gemini_api_key}
              onChange={handleChange}
              placeholder={keyStatus.gemini ? "새 키를 입력하면 기존 키가 교체됩니다" : "AIza..."}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google AI Studio에서 발급 →
              </a>
            </p>
          </div>

          {/* Telegram Bot */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telegram Bot Token (선택사항)
              {keyStatus.telegram && <span className="ml-2 text-green-600 text-xs">(저장됨 ✓)</span>}
            </label>
            <input
              type="text"
              name="telegram_bot_token"
              value={config.telegram_bot_token}
              onChange={handleChange}
              placeholder={keyStatus.telegram ? "새 토큰을 입력하면 기존 토큰이 교체됩니다" : "1234567890:ABCdef..."}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telegram Chat ID (선택사항)
            </label>
            <input
              type="text"
              name="telegram_chat_id"
              value={config.telegram_chat_id}
              onChange={handleChange}
              placeholder="123456789"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              <a
                href="https://t.me/botfather"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                BotFather에서 봇 생성 →
              </a>
            </p>
          </div>

          {/* SNS 채널 설정 */}
          <hr className="my-8" />
          <h2 className="text-xl font-semibold mb-6">📱 SNS 채널 설정</h2>
          <p className="text-gray-600 mb-4 text-sm">
            블로그 하단에 표시될 SNS 채널 링크를 설정합니다. 빈 칸으로 두면 해당 아이콘이 표시되지 않습니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* YouTube 채널 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📺 YouTube 채널
              </label>
              <input
                type="url"
                name="sns_youtube"
                value={config.sns_youtube}
                onChange={handleChange}
                placeholder="https://youtube.com/@채널명"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📷 Instagram
              </label>
              <input
                type="url"
                name="sns_instagram"
                value={config.sns_instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/계정명"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Facebook */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👤 Facebook
              </label>
              <input
                type="url"
                name="sns_facebook"
                value={config.sns_facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/페이지명"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Twitter/X */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🐦 Twitter (X)
              </label>
              <input
                type="url"
                name="sns_twitter"
                value={config.sns_twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/계정명"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 네이버 블로그 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 네이버 블로그
              </label>
              <input
                type="url"
                name="sns_blog"
                value={config.sns_blog}
                onChange={handleChange}
                placeholder="https://blog.naver.com/블로그ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 카카오톡 채널 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💬 카카오톡 채널
              </label>
              <input
                type="url"
                name="sns_kakao"
                value={config.sns_kakao}
                onChange={handleChange}
                placeholder="https://pf.kakao.com/채널ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 검색 설정 */}
          <hr className="my-8" />
          <h2 className="text-xl font-semibold mb-6">🔍 검색 설정</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              최소 조회수 필터
            </label>
            <input
              type="number"
              name="min_views"
              value={config.min_views}
              onChange={handleChange}
              min="0"
              step="1000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              이 조회수 이상인 영상만 검색 결과에 표시됩니다
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              최대 검색 결과 수
            </label>
            <input
              type="number"
              name="max_results"
              value={config.max_results}
              onChange={handleChange}
              min="5"
              max="50"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              한 번에 검색할 최대 영상 수 (5-50개)
            </p>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? '저장 중...' : '💾 설정 저장'}
          </button>
        </form>

        {/* 안내 메시지 */}
        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                보안 주의사항
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>API 키는 절대 외부에 공유하지 마세요</li>
                  <li>정기적으로 API 키를 갱신하세요</li>
                  <li>Git 저장소에 커밋되지 않도록 주의하세요</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
