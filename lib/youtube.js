// lib/youtube.js
// YouTube API 헬퍼 함수

const axios = require('axios');
const { getConfigValue } = require('./config');

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

/**
 * YouTube 영상 검색
 * @param {string} keyword - 검색 키워드
 * @param {number} minViews - 최소 조회수
 * @param {number} maxResults - 최대 결과 수
 * @param {number} periodDays - 검색 기간 (일)
 * @param {string} videoDuration - 영상 길이 (short: 숏츠, long: 롱폼, any: 전체)
 * @returns {Promise<Array>} 영상 목록
 */
async function searchVideos(keyword, minViews = 10000, maxResults = 20, periodDays = 30, videoDuration = 'any') {
  const YOUTUBE_API_KEY = getConfigValue('youtube_api_key');

  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API 키가 설정되지 않았습니다. 관리자 설정 페이지에서 API 키를 입력해주세요.');
  }

  try {
    // 지정된 기간 이내 영상
    const publishedAfter = new Date();
    publishedAfter.setDate(publishedAfter.getDate() - periodDays);

    // 검색 API 호출 (관련성 우선, 조회수는 나중에 정렬)
    const searchResponse = await axios.get(`${YOUTUBE_API_BASE}/search`, {
      params: {
        part: 'snippet',
        q: keyword,
        type: 'video',
        order: 'relevance', // 키워드 관련성 우선
        publishedAfter: publishedAfter.toISOString(),
        maxResults: 50, // 더 많이 가져온 후 필터링
        key: YOUTUBE_API_KEY,
        regionCode: 'KR',
        relevanceLanguage: 'ko',
        videoDuration, // 'short' (< 4분), 'long' (> 20분), 'any' (전체)
      },
    });

    const videos = searchResponse.data.items || [];

    if (videos.length === 0) {
      return [];
    }

    // 영상 ID 목록 추출
    const videoIds = videos.map((v) => v.id.videoId).join(',');

    // 영상 상세 정보 조회 (contentDetails 추가로 duration 가져오기)
    const videosResponse = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: videoIds,
        key: YOUTUBE_API_KEY,
      },
    });

    const videosWithStats = videosResponse.data.items || [];

    // 조회수 필터링 및 데이터 정제
    const filteredVideos = videosWithStats
      .filter((video) => {
        const viewCount = parseInt(video.statistics.viewCount) || 0;
        return viewCount >= minViews;
      })
      .map((video) => {
        const duration = video.contentDetails.duration; // ISO 8601 형식 (PT1M30S)
        const isShorts = parseDuration(duration) <= 60; // 60초 이하면 숏츠

        return {
          video_id: video.id,
          title: video.snippet.title,
          channel_name: video.snippet.channelTitle,
          view_count: parseInt(video.statistics.viewCount) || 0,
          like_count: parseInt(video.statistics.likeCount) || 0,
          published_at: video.snippet.publishedAt,
          duration: duration,
          is_shorts: isShorts,
          thumbnail_url:
            video.snippet.thumbnails.high?.url ||
            video.snippet.thumbnails.medium?.url ||
            video.snippet.thumbnails.default?.url,
          keyword,
        };
      });

    // 조회수 순 정렬
    filteredVideos.sort((a, b) => b.view_count - a.view_count);

    // 사용자가 요청한 maxResults 수만큼만 반환
    return filteredVideos.slice(0, maxResults);
  } catch (error) {
    console.error('[ERROR] YouTube API 호출 실패:', error.message);
    if (error.response) {
      console.error('응답 데이터:', error.response.data);
    }
    throw new Error('YouTube 영상 검색 중 오류가 발생했습니다');
  }
}

/**
 * ISO 8601 duration을 초 단위로 변환
 * @param {string} duration - PT1M30S 형식
 * @returns {number} 초 단위 시간
 */
function parseDuration(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * 영상 정보 조회
 * @param {string} videoId - YouTube 영상 ID
 * @returns {Promise<Object>} 영상 정보
 */
async function getVideoInfo(videoId) {
  const YOUTUBE_API_KEY = getConfigValue('youtube_api_key');

  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API 키가 설정되지 않았습니다. 관리자 설정 페이지에서 API 키를 입력해주세요.');
  }

  try {
    const response = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: videoId,
        key: YOUTUBE_API_KEY,
      },
    });

    const video = response.data.items?.[0];

    if (!video) {
      throw new Error('영상을 찾을 수 없습니다');
    }

    const duration = video.contentDetails.duration;
    const isShorts = parseDuration(duration) <= 60;

    return {
      video_id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      channel_name: video.snippet.channelTitle,
      view_count: parseInt(video.statistics.viewCount) || 0,
      like_count: parseInt(video.statistics.likeCount) || 0,
      comment_count: parseInt(video.statistics.commentCount) || 0,
      published_at: video.snippet.publishedAt,
      duration: duration,
      is_shorts: isShorts,
      thumbnail_url:
        video.snippet.thumbnails.high?.url ||
        video.snippet.thumbnails.medium?.url ||
        video.snippet.thumbnails.default?.url,
      tags: video.snippet.tags || [],
    };
  } catch (error) {
    console.error('[ERROR] 영상 정보 조회 실패:', error.message);
    throw new Error('영상 정보를 가져오는 중 오류가 발생했습니다');
  }
}

/**
 * 영상 조회수 급증 원인 분석
 * @param {Object} videoInfo - 영상 정보
 * @returns {Object} 분석 결과
 */
function analyzeViralFactors(videoInfo) {
  const analysis = {
    viral_score: 0,
    factors: [],
    insights: []
  };

  // 1. 조회수 대비 좋아요 비율 (참여도)
  const engagementRate = (videoInfo.like_count / videoInfo.view_count) * 100;
  if (engagementRate > 5) {
    analysis.viral_score += 30;
    analysis.factors.push('높은 참여도');
    analysis.insights.push(`좋아요 비율 ${engagementRate.toFixed(2)}%로 매우 높은 시청자 만족도`);
  } else if (engagementRate > 3) {
    analysis.viral_score += 20;
    analysis.factors.push('양호한 참여도');
  }

  // 2. 업로드 후 경과 시간 대비 조회수 (바이럴 속도)
  const publishedDate = new Date(videoInfo.published_at);
  const daysSincePublished = (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60 * 24);
  const viewsPerDay = videoInfo.view_count / daysSincePublished;

  if (viewsPerDay > 10000) {
    analysis.viral_score += 30;
    analysis.factors.push('매우 빠른 확산 속도');
    analysis.insights.push(`하루 평균 ${Math.round(viewsPerDay).toLocaleString()}회 조회, 급속 바이럴`);
  } else if (viewsPerDay > 5000) {
    analysis.viral_score += 20;
    analysis.factors.push('빠른 확산 속도');
  }

  // 3. 댓글 수 (커뮤니티 반응)
  const commentRate = (videoInfo.comment_count / videoInfo.view_count) * 100;
  if (commentRate > 1) {
    analysis.viral_score += 20;
    analysis.factors.push('활발한 커뮤니티 반응');
    analysis.insights.push(`댓글 ${videoInfo.comment_count.toLocaleString()}개로 높은 소통률`);
  }

  // 4. 숏츠 여부 (플랫폼 알고리즘 우대)
  if (videoInfo.is_shorts) {
    analysis.viral_score += 20;
    analysis.factors.push('숏츠 형식 (알고리즘 우대)');
    analysis.insights.push('YouTube 숏츠의 노출 알고리즘 혜택');
  }

  // 5. 제목 분석 (클릭 유도 요소)
  const titleHooks = ['꿀팁', '완벽', '필수', '추천', '비법', '실패', '성공', '놀라운', '충격', '진짜'];
  const foundHooks = titleHooks.filter(hook => videoInfo.title.includes(hook));
  if (foundHooks.length > 0) {
    analysis.viral_score += 10 * foundHooks.length;
    analysis.factors.push('강력한 제목 훅');
    analysis.insights.push(`제목에 "${foundHooks.join(', ')}" 등 클릭 유도 키워드 사용`);
  }

  // 6. 태그 분석
  if (videoInfo.tags && videoInfo.tags.length > 10) {
    analysis.viral_score += 10;
    analysis.factors.push('풍부한 태그 (검색 최적화)');
  }

  // 종합 평가
  if (analysis.viral_score >= 80) {
    analysis.rating = '매우 높음';
    analysis.summary = '매우 강력한 바이럴 요소들이 조합되어 있습니다.';
  } else if (analysis.viral_score >= 60) {
    analysis.rating = '높음';
    analysis.summary = '효과적인 바이럴 요소들이 작용하고 있습니다.';
  } else if (analysis.viral_score >= 40) {
    analysis.rating = '보통';
    analysis.summary = '일부 바이럴 요소들이 확인됩니다.';
  } else {
    analysis.rating = '낮음';
    analysis.summary = '주목할 만한 바이럴 요소가 제한적입니다.';
  }

  return analysis;
}

module.exports = {
  searchVideos,
  getVideoInfo,
  analyzeViralFactors,
};
