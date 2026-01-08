// pages/admin/discover.js
// 영상 검색 및 선택 페이지 (개선된 UI)

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';

export default function Discover() {
  const [searchMode, setSearchMode] = useState('keyword'); // 'keyword', 'youtube', or 'web'
  const [keyword, setKeyword] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [webUrl, setWebUrl] = useState('');
  const [minViews, setMinViews] = useState(0);
  const [maxResults, setMaxResults] = useState(20);
  const [periodDays, setPeriodDays] = useState(0); // 0 = 전체 기간
  const [videoDuration, setVideoDuration] = useState('any'); // 'short', 'long', 'any'
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  // 최근 검색 기록 로드
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history.slice(0, 5));
  }, []);

  const saveSearchHistory = (kw) => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const newHistory = [kw, ...history.filter(h => h !== kw)].slice(0, 10);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    setSearchHistory(newHistory.slice(0, 5));
  };

  // YouTube URL에서 video ID 추출
  const extractVideoId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (searchMode === 'youtube') {
      // YouTube URL 모드: 바로 글 생성
      handleDirectGenerate();
    } else if (searchMode === 'web') {
      // 웹사이트/블로그 URL 모드: 웹 스크래핑 후 글 생성
      handleWebUrlGenerate();
    } else {
      // 키워드 모드: 기존 검색
      setLoading(true);
      setError('');
      setVideos([]);

      try {
        const response = await fetch('/api/search-videos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            keyword,
            minViews: parseInt(minViews),
            maxResults: parseInt(maxResults),
            periodDays: parseInt(periodDays),
            videoDuration // 숏츠/롱폼/전체 선택
          }),
        });

        const data = await response.json();

        if (data.success) {
          setVideos(data.videos);
          if (data.videos.length === 0) {
            setError('검색 결과가 없습니다. 조회수 필터를 낮추거나 다른 키워드를 시도해보세요.');
          } else {
            saveSearchHistory(keyword);
          }
        } else {
          setError(data.error || '검색 중 오류가 발생했습니다');
        }
      } catch (err) {
        setError('검색 중 오류가 발생했습니다: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleWebUrlGenerate = async () => {
    if (!webUrl.trim()) {
      setError('웹사이트 URL을 입력해주세요.');
      return;
    }

    if (!confirm(`⚠️ 저작권 확인\n\n이 웹사이트의 내용을 참고하여 완전히 새로운 글로 재작성합니다.\n원본을 복사하지 않고 AI가 새롭게 작성합니다.\n\n계속하시겠습니까?`)) {
      return;
    }

    setLoading(true);
    setError('');
    setProgressStatus('🔍 웹페이지 분석 중...');

    try {
      // 1. 웹 URL 분석 및 콘텐츠 생성
      const response = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: webUrl }),
      });

      const data = await response.json();

      if (data.success) {
        setProgressStatus('💾 블로그 저장 중...');

        // 2. 생성된 콘텐츠를 포스트로 저장
        const saveResponse = await fetch('/api/save-web-post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: data.data.title,
            content: data.data.content,
            meta_description: data.data.meta_description,
            keywords: data.data.keywords,
            category: data.data.category,
            thumbnail_url: data.data.thumbnail_url,
            thumbnail_prompt: data.data.thumbnail_prompt,
            image_prompts: data.data.image_prompts,
            source_url: data.data.source.url,
            source_note: data.data.source.note
          }),
        });

        const saveData = await saveResponse.json();

        if (saveData.success) {
          alert(`✅ 블로그 글 생성 완료!\n\n제목: ${data.data.title}\n카테고리: ${data.data.category}\n\n⚠️ ${data.copyrightNotice}\n\n관리자 대시보드에서 확인하고 검토하세요.`);
          window.location.href = '/admin/dashboard';
        } else {
          setError(saveData.error || '글 저장 중 오류가 발생했습니다');
        }
      } else {
        setError(data.error || '웹페이지 분석 실패');
      }
    } catch (error) {
      setError('오류 발생: ' + error.message);
    } finally {
      setLoading(false);
      setProgressStatus('');
    }
  };

  const handleDirectGenerate = async () => {
    const videoId = extractVideoId(youtubeUrl);

    if (!videoId) {
      setError('올바른 YouTube URL을 입력해주세요. (예: https://youtube.com/watch?v=VIDEO_ID)');
      return;
    }

    if (!confirm(`이 영상으로 블로그 글을 생성하시겠습니까?\n\n영상 ID: ${videoId}`)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // AbortController로 긴 타임아웃 설정 (5분)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000);

      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // 응답 텍스트를 먼저 확인
      const responseText = await response.text();

      // JSON 파싱 시도
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON 파싱 실패:', responseText.substring(0, 200));
        // 타임아웃이나 서버 에러지만 글은 생성되었을 수 있음
        alert('⚠️ 응답 처리 중 문제가 발생했지만, 글이 생성되었을 수 있습니다.\n\n대시보드에서 확인해주세요.');
        window.location.href = '/admin/dashboard';
        return;
      }

      if (data.success) {
        alert(`✅ 블로그 글 생성 완료!\n\n제목: ${data.post.title}\n\n관리자 대시보드에서 확인하고 검토하세요.`);
        window.location.href = '/admin/dashboard';
      } else {
        setError(data.error || '글 생성 중 오류가 발생했습니다');
      }
    } catch (error) {
      // 타임아웃이나 네트워크 에러 시에도 글은 생성되었을 수 있음
      if (error.name === 'AbortError') {
        alert('⚠️ 요청 시간이 초과되었지만, 글이 생성되었을 수 있습니다.\n\n대시보드에서 확인해주세요.');
      } else {
        alert('⚠️ 오류가 발생했지만, 글이 생성되었을 수 있습니다.\n\n대시보드에서 확인해주세요.\n\n오류: ' + error.message);
      }
      window.location.href = '/admin/dashboard';
    } finally {
      setLoading(false);
    }
  };

  const [generating, setGenerating] = useState(null);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [currentScript, setCurrentScript] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState('');
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');
  const [loadingScript, setLoadingScript] = useState(false);

  // 이미지 설정 상태
  const [imageCount, setImageCount] = useState(3);
  const [thumbnailPromptInput, setThumbnailPromptInput] = useState('');
  const [imagePrompts, setImagePrompts] = useState(['', '', '', '', '']);

  // 생성 진행 상태 모달
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressStatus, setProgressStatus] = useState('');
  const [scriptSummary, setScriptSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);

  // 스크립트 보기 핸들러
  const handleViewScript = async (videoId, videoTitle) => {
    setCurrentVideoId(videoId);
    setCurrentVideoTitle(videoTitle);
    setShowScriptModal(true);
    setLoadingScript(true);
    setCurrentScript('');
    setScriptSummary('');
    // 이미지 설정 초기화
    setThumbnailPromptInput('');
    setImagePrompts(['', '', '', '', '']);
    setImageCount(3);

    try {
      const response = await fetch('/api/get-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId })
      });

      const data = await response.json();

      if (data.success && data.transcript) {
        setCurrentScript(data.transcript);
      } else {
        // 자막 없으면 영상 정보로 대체
        const videoInfoResponse = await fetch('/api/get-video-description', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId })
        });

        const videoData = await videoInfoResponse.json();

        if (videoData.success) {
          setCurrentScript(`[자막 없음 - 영상 설명으로 대체]\n\n${videoData.description || '영상 설명도 없습니다.'}`);
        } else {
          setCurrentScript('자막을 가져올 수 없습니다. 이 영상은 자막이 없거나 자막 추출이 불가능합니다.');
        }
      }
    } catch (error) {
      setCurrentScript('스크립트 로드 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setLoadingScript(false);
    }
  };

  // 스크립트 요약 핸들러
  const handleSummarizeScript = async () => {
    setSummarizing(true);
    try {
      const response = await fetch('/api/summarize-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: currentScript,
          videoTitle: currentVideoTitle
        })
      });

      const data = await response.json();

      if (data.success) {
        setScriptSummary(data.summary);
      } else {
        alert('요약 생성 실패: ' + data.message);
      }
    } catch (error) {
      alert('요약 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setSummarizing(false);
    }
  };

  // 모달에서 글 생성 (이미지 프롬프트 포함)
  const handleGenerateFromModal = async () => {
    if (!currentVideoId) return;

    setShowScriptModal(false);
    setShowProgressModal(true);
    setProgressStatus('📄 블로그 글 생성 중...');
    setGenerating(currentVideoId);

    try {
      const validImagePrompts = imagePrompts.slice(0, imageCount).filter(p => p.trim());

      setProgressStatus('🎬 영상 정보 분석 중...');

      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: currentVideoId,
          thumbnailPrompt: thumbnailPromptInput || undefined,
          imagePrompts: validImagePrompts.length > 0 ? validImagePrompts : undefined,
          imageCount: imageCount
        }),
      });

      setProgressStatus('✨ 최종 처리 중...');
      const data = await response.json();

      if (data.success) {
        setProgressStatus('✅ 완료!');
        setTimeout(() => {
          setShowProgressModal(false);
          window.location.href = '/admin/dashboard';
        }, 1000);
      } else {
        setShowProgressModal(false);
        alert(`❌ 생성 실패\n\n${data.error}`);
      }
    } catch (error) {
      setShowProgressModal(false);
      alert(`❌ 오류 발생\n\n${error.message}`);
    } finally {
      setGenerating(null);
    }
  };

  const handleGeneratePost = async (videoId, videoTitle) => {
    // 스크립트 모달 열기 (이미지 설정 포함)
    handleViewScript(videoId, videoTitle);
  };

  // 기존 방식 (prompt로 직접 입력) - 더 이상 사용 안함
  const handleGeneratePostLegacy = async (videoId, videoTitle) => {
    const thumbnailPrompt = prompt(
      `"${videoTitle}"\n\n블로그 썸네일 이미지를 위한 프롬프트를 입력하세요:`,
      ''
    );

    if (thumbnailPrompt === null) return;

    setGenerating(videoId);

    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId,
          thumbnailPrompt: thumbnailPrompt || undefined
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ 블로그 글 생성 완료!\n\n제목: ${data.post.title}\n\n관리자 대시보드에서 확인하고 검토하세요.`);
        // 대시보드로 이동
        window.location.href = '/admin/dashboard';
      } else {
        alert(`❌ 생성 실패\n\n${data.error}`);
      }
    } catch (error) {
      alert(`❌ 오류 발생\n\n${error.message}`);
    } finally {
      setGenerating(null);
    }
  };

  return (
    <Layout title="영상 검색">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🔍 콘텐츠 검색</h1>
              <p className="text-gray-600 mt-1">키워드로 검색하거나 YouTube URL을 입력하여 블로그 글을 생성하세요</p>
            </div>
            <Link href="/admin/dashboard">
              <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors">
                ← 대시보드
              </button>
            </Link>
          </div>

          {/* 검색 폼 */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
            <form onSubmit={handleSearch} className="space-y-6">
              {/* 검색 모드 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  검색 방법 선택
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSearchMode('keyword')}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                      searchMode === 'keyword'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🔍 키워드 검색
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchMode('youtube')}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                      searchMode === 'youtube'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🎥 YouTube URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchMode('web')}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                      searchMode === 'web'
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🌐 웹사이트/블로그 URL
                  </button>
                </div>
              </div>

              {/* 키워드 검색 모드 */}
              {searchMode === 'keyword' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    검색 키워드 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="예: 손해사정사 비용, 자동차보험 청구"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    required
                  />

                  {/* 최근 검색 */}
                  {searchHistory.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-xs text-gray-500">최근 검색:</span>
                      {searchHistory.map((kw, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setKeyword(kw)}
                          className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                        >
                          {kw}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* YouTube URL 직접 입력 모드 */}
              {searchMode === 'youtube' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube URL 입력 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="예: https://www.youtube.com/watch?v=VIDEO_ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 YouTube 영상 URL을 입력하면 바로 블로그 글이 생성됩니다
                  </p>
                </div>
              )}

              {/* 웹사이트/블로그 URL 입력 모드 */}
              {searchMode === 'web' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    웹사이트/블로그 URL 입력 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={webUrl}
                    onChange={(e) => setWebUrl(e.target.value)}
                    placeholder="예: https://blog.naver.com/..., https://news.naver.com/..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                    required
                  />
                  <p className="text-xs text-red-600 mt-2 font-medium">
                    ⚠️ 저작권 준수: 원본을 복사하지 않고 AI가 내용을 참고하여 완전히 새롭게 재작성합니다
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    💡 지원: 네이버 블로그, 네이버 뉴스, 티스토리, 일반 웹사이트
                  </p>
                </div>
              )}

              {/* 필터 설정 (키워드 모드에서만 표시) */}
              {searchMode === 'keyword' && (
                <>
                  {/* 영상 길이 선택 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      영상 길이 선택
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setVideoDuration('any')}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                          videoDuration === 'any'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        📺 전체
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoDuration('short')}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                          videoDuration === 'short'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        ⚡ 숏츠 (&lt; 4분)
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoDuration('long')}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                          videoDuration === 'long'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        🎬 롱폼 (&gt; 20분)
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      💡 숏츠는 알고리즘 우대를 받아 바이럴 가능성이 높습니다
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        검색 기간
                      </label>
                      <select
                        value={periodDays}
                        onChange={(e) => setPeriodDays(parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="0">전체 기간 (추천)</option>
                        <option value="7">최근 7일</option>
                        <option value="30">최근 30일</option>
                        <option value="90">최근 90일</option>
                        <option value="365">최근 1년</option>
                        <option value="1825">최근 5년</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        정확한 매칭을 위해 '전체 기간' 추천
                      </p>
                    </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      최소 조회수
                    </label>
                    <select
                      value={minViews}
                      onChange={(e) => setMinViews(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="0">제한 없음</option>
                      <option value="1000">1,000회 이상</option>
                      <option value="5000">5,000회 이상</option>
                      <option value="10000">10,000회 이상</option>
                      <option value="50000">50,000회 이상</option>
                      <option value="100000">100,000회 이상</option>
                      <option value="500000">500,000회 이상</option>
                      <option value="1000000">1,000,000회 이상</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      조회수가 높은 영상일수록 품질이 좋습니다
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      최대 검색 결과 수
                    </label>
                    <select
                      value={maxResults}
                      onChange={(e) => setMaxResults(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="10">10개</option>
                      <option value="20">20개</option>
                      <option value="30">30개</option>
                      <option value="50">50개 (최대)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      API 할당량 절약을 위해 적절한 수를 선택하세요
                    </p>
                  </div>
                </div>
                </>
              )}

              {/* 검색 정보 */}
              <div className={`border-l-4 p-4 rounded-r-lg ${
                searchMode === 'web' ? 'bg-yellow-50 border-yellow-400' :
                searchMode === 'youtube' ? 'bg-red-50 border-red-400' :
                'bg-blue-50 border-blue-400'
              }`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-xl">
                      {searchMode === 'web' ? '⚠️' : 'ℹ️'}
                    </span>
                  </div>
                  <div className="ml-3">
                    {searchMode === 'keyword' ? (
                      <p className="text-sm text-blue-700">
                        <strong>검색 조건:</strong> 선택한 기간 내 업로드된 영상을 조회수 순으로 검색합니다
                      </p>
                    ) : searchMode === 'youtube' ? (
                      <p className="text-sm text-red-700">
                        <strong>YouTube URL:</strong> 영상 URL을 입력하면 해당 영상으로 바로 블로그 글이 생성됩니다
                      </p>
                    ) : (
                      <p className="text-sm text-yellow-800">
                        <strong>저작권 안내:</strong> AI가 원본 콘텐츠를 참고하여 완전히 새로운 글로 재작성합니다. 원본을 복사하지 않으므로 저작권 문제가 없습니다. 단, 출처는 하단에 표기됩니다.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 검색/생성 버튼 */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-lg font-medium text-white text-lg transition-colors ${
                  loading ? 'bg-gray-400 cursor-not-allowed' :
                  searchMode === 'web' ? 'bg-green-600 hover:bg-green-700' :
                  searchMode === 'youtube' ? 'bg-red-600 hover:bg-red-700' :
                  'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {searchMode === 'keyword' ? '검색 중...' :
                     searchMode === 'web' ? '웹 분석 및 글 생성 중...' : '글 생성 중...'}
                  </span>
                ) : (
                  searchMode === 'keyword' ? '🔍 영상 검색' :
                  searchMode === 'web' ? '🌐 웹페이지 분석 후 글 생성' :
                  '🎥 YouTube 영상으로 글 생성'
                )}
              </button>
            </form>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-2xl">❌</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">검색 실패</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* 검색 결과 */}
          {videos.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  검색 결과 <span className="text-blue-600">({videos.length}개)</span>
                </h2>
                <p className="text-sm text-gray-500">
                  조회수 순으로 정렬됨
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video, index) => (
                  <div key={video.video_id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow flex flex-col">
                    {/* 순위 배지 */}
                    {index < 3 && (
                      <div className="absolute mt-3 ml-3 z-10">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          index === 0 ? 'bg-yellow-400 text-yellow-900' :
                          index === 1 ? 'bg-gray-300 text-gray-900' :
                          'bg-orange-400 text-orange-900'
                        }`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} #{index + 1}
                        </span>
                      </div>
                    )}

                    {/* 썸네일 */}
                    <div className="relative">
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                        <p className="text-white text-xs font-medium">
                          {new Date(video.published_at).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      {/* 제목 */}
                      <h3 className="font-bold text-base mb-3 line-clamp-2 text-gray-900 h-12">
                        {video.title}
                      </h3>

                      {/* 메타 정보 */}
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="mr-2">📺</span>
                          {video.channel_name}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center">
                            <span className="mr-1">👁️</span>
                            {video.view_count.toLocaleString()}
                          </span>
                          <span className="text-gray-600 flex items-center">
                            <span className="mr-1">👍</span>
                            {video.like_count.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* 바이럴 분석 결과 */}
                      <div className="flex-grow">
                      {video.viral_analysis && (
                        <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-purple-700">🔥 바이럴 분석</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                              video.viral_analysis.viral_score >= 80 ? 'bg-red-500 text-white' :
                              video.viral_analysis.viral_score >= 60 ? 'bg-orange-500 text-white' :
                              video.viral_analysis.viral_score >= 40 ? 'bg-yellow-500 text-gray-900' :
                              'bg-gray-400 text-white'
                            }`}>
                              {video.viral_analysis.viral_score}점
                            </span>
                          </div>
                          <div className="text-xs text-purple-900 mb-2">
                            <strong>{video.viral_analysis.rating}</strong>
                          </div>
                          {video.viral_analysis.factors.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {video.viral_analysis.factors.slice(0, 3).map((factor, idx) => (
                                <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                  {factor}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      </div>

                      {/* 액션 버튼 */}
                      <div className="flex gap-2 mt-auto">
                        <a
                          href={`https://youtube.com/watch?v=${video.video_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-center text-sm"
                        >
                          영상 보기
                        </a>
                        <button
                          onClick={() => handleViewScript(video.video_id, video.title)}
                          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-sm"
                        >
                          스크립트 보기
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 검색 결과 없음 */}
          {!loading && videos.length === 0 && !error && keyword === '' && (
            <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">영상을 검색해보세요</h3>
              <p className="text-gray-600">
                키워드를 입력하고 검색 버튼을 클릭하세요
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 스크립트 모달 */}
      {showScriptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            {/* 모달 헤더 */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">📄 영상 스크립트</h2>
                <button
                  onClick={() => setShowScriptModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">{currentVideoTitle}</p>
            </div>

            {/* 모달 본문 */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* 스크립트 섹션 */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">📝 영상 스크립트</h3>
                  {!loadingScript && currentScript && (
                    <button
                      onClick={handleSummarizeScript}
                      disabled={summarizing}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:bg-gray-400"
                    >
                      {summarizing ? '요약 중...' : '📌 시간별 요약'}
                    </button>
                  )}
                </div>
                {loadingScript ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">스크립트를 불러오는 중...</p>
                  </div>
                ) : (
                  <>
                    {scriptSummary && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-yellow-900 mb-2">⏱️ 시간별 요약</h4>
                        <pre className="whitespace-pre-wrap text-sm text-yellow-900 leading-relaxed font-sans">
                          {scriptSummary}
                        </pre>
                      </div>
                    )}
                    <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed font-sans">
                        {currentScript}
                      </pre>
                    </div>
                  </>
                )}
              </div>

              {/* 이미지 설정 섹션 */}
              {!loadingScript && currentScript && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🖼️ 이미지 설정</h3>

                  {/* 썸네일 프롬프트 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      썸네일 이미지 프롬프트
                    </label>
                    <input
                      type="text"
                      value={thumbnailPromptInput}
                      onChange={(e) => setThumbnailPromptInput(e.target.value)}
                      placeholder="예: 보험 상담하는 전문가 이미지, 밝은 오피스 배경"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">비워두면 AI가 자동 생성합니다</p>
                  </div>

                  {/* 본문 이미지 개수 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      본문 이미지 개수: {imageCount}장
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={imageCount}
                      onChange={(e) => setImageCount(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0장</span>
                      <span>5장</span>
                    </div>
                  </div>

                  {/* 본문 이미지 프롬프트들 */}
                  {imageCount > 0 && (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        본문 이미지 프롬프트 (선택)
                      </label>
                      {[...Array(imageCount)].map((_, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 w-16">이미지 {idx + 1}</span>
                          <input
                            type="text"
                            value={imagePrompts[idx] || ''}
                            onChange={(e) => {
                              const newPrompts = [...imagePrompts];
                              newPrompts[idx] = e.target.value;
                              setImagePrompts(newPrompts);
                            }}
                            placeholder={`본문 ${idx + 1}번째 이미지 프롬프트`}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                      <p className="text-xs text-gray-500">비워두면 AI가 글 내용에 맞게 자동 생성합니다</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 모달 푸터 */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowScriptModal(false)}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  닫기
                </button>
                <button
                  onClick={handleGenerateFromModal}
                  disabled={loadingScript || !currentScript || generating}
                  className={`px-6 py-2 font-medium rounded-lg transition-colors ${
                    loadingScript || !currentScript || generating
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {generating ? '생성 중...' : `글 생성 (이미지 ${imageCount}장)`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 생성 진행 상태 모달 */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">블로그 글 생성 중</h3>
            <p className="text-lg text-blue-600 font-medium mb-4">{progressStatus}</p>
            <p className="text-sm text-gray-500">잠시만 기다려주세요...</p>
            <div className="mt-6 bg-gray-100 rounded-lg p-4">
              <p className="text-xs text-gray-600">
                📝 글 작성 → 🖼️ 이미지 생성 → 💾 저장
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
