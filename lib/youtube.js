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
    // 검색 파라미터 구성
    const searchParams = {
      part: 'snippet',
      q: keyword,
      type: 'video',
      order: 'relevance', // 키워드 관련성 우선
      maxResults: 50, // 더 많이 가져온 후 필터링
      key: YOUTUBE_API_KEY,
      regionCode: 'KR',
      relevanceLanguage: 'ko',
    };

    // 기간 필터 (0이면 전체 기간, 그 외에는 해당 일수 이내)
    if (periodDays > 0) {
      const publishedAfter = new Date();
      publishedAfter.setDate(publishedAfter.getDate() - periodDays);
      searchParams.publishedAfter = publishedAfter.toISOString();
    }

    // 영상 길이 필터 ('any'가 아닐 때만 추가)
    if (videoDuration && videoDuration !== 'any') {
      searchParams.videoDuration = videoDuration;
    }

    console.log(`[DEBUG] YouTube 검색 파라미터:`, JSON.stringify(searchParams, null, 2));

    // 검색 API 호출 (관련성 우선, 조회수는 나중에 정렬)
    const searchResponse = await axios.get(`${YOUTUBE_API_BASE}/search`, {
      params: searchParams,
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

    /**
     * 한국어 콘텐츠 여부 확인
     * - 제목이나 채널명에 한글이 포함되어 있으면 통과
     * - 중국어만 있는 콘텐츠는 제외
     */
    const isKoreanContent = (video) => {
      const title = video.snippet.title || '';
      const channelTitle = video.snippet.channelTitle || '';

      // 한글 패턴 (가-힣: 완성형 한글)
      const koreanPattern = /[가-힣]/;
      // 중국어 문자 패턴 (한자)
      const chinesePattern = /[\u4e00-\u9fff]/;

      // 1. 제목이나 채널명에 한글이 있으면 한국어 콘텐츠
      const hasKoreanInTitle = koreanPattern.test(title);
      const hasKoreanInChannel = koreanPattern.test(channelTitle);

      if (hasKoreanInTitle || hasKoreanInChannel) {
        console.log(`[FILTER] ✅ 통과: "${title}" (채널: ${channelTitle})`);
        return true;
      }

      // 2. 한글이 없고 제목에 중국어가 있으면 제외
      const hasChineseInTitle = chinesePattern.test(title);
      if (hasChineseInTitle) {
        console.log(`[FILTER] ❌ 제외 (중국어): "${title}" (채널: ${channelTitle})`);
        return false;
      }

      // 3. 영어 등 기타 언어는 통과 (한국 관련 영어 콘텐츠일 수 있음)
      console.log(`[FILTER] ⚠️ 통과 (기타): "${title}" (채널: ${channelTitle})`);
      return true;
    };

    // 조회수 필터링 및 데이터 정제
    const filteredVideos = videosWithStats
      .filter((video) => {
        const viewCount = parseInt(video.statistics.viewCount) || 0;
        // 조회수 조건 + 한국어 콘텐츠 필터
        return viewCount >= minViews && isKoreanContent(video);
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
      throw new Error('영상을 찾을 수 없습니다. 영상 ID를 확인해주세요: ' + videoId);
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
    // YouTube API 에러 상세 정보 추출
    if (error.response) {
      const apiError = error.response.data?.error;
      if (apiError) {
        if (apiError.code === 403) {
          throw new Error('YouTube API 키가 유효하지 않거나 할당량이 초과되었습니다. 설정을 확인해주세요.');
        }
        if (apiError.code === 404) {
          throw new Error('영상을 찾을 수 없습니다. URL을 확인해주세요.');
        }
        throw new Error(`YouTube API 오류: ${apiError.message || '알 수 없는 오류'}`);
      }
    }
    throw new Error('영상 정보를 가져오는 중 오류가 발생했습니다: ' + error.message);
  }
}

/**
 * 영상 조회수 급증 원인 분석 (보험 콘텐츠 최적화)
 * @param {Object} videoInfo - 영상 정보
 * @returns {Object} 분석 결과
 */
function analyzeViralFactors(videoInfo) {
  const analysis = {
    viral_score: 0,
    factors: [],
    insights: []
  };

  // 1. 조회수 대비 좋아요 비율 (참여도) - 기준 완화
  const engagementRate = (videoInfo.like_count / videoInfo.view_count) * 100;
  if (engagementRate > 3) {
    analysis.viral_score += 25;
    analysis.factors.push('높은 참여도');
    analysis.insights.push(`좋아요 비율 ${engagementRate.toFixed(2)}%로 매우 높은 시청자 만족도`);
  } else if (engagementRate > 2) {
    analysis.viral_score += 20;
    analysis.factors.push('양호한 참여도');
    analysis.insights.push(`좋아요 비율 ${engagementRate.toFixed(2)}%`);
  } else if (engagementRate > 1) {
    analysis.viral_score += 10;
    analysis.factors.push('적정 참여도');
  }

  // 2. 총 조회수 기반 인기도 (오래된 영상도 평가 가능)
  const viewCount = videoInfo.view_count || 0;
  if (viewCount > 500000) {
    analysis.viral_score += 25;
    analysis.factors.push('대형 인기 영상');
    analysis.insights.push(`${(viewCount / 10000).toFixed(1)}만 조회로 검증된 콘텐츠`);
  } else if (viewCount > 100000) {
    analysis.viral_score += 20;
    analysis.factors.push('인기 영상');
    analysis.insights.push(`${(viewCount / 10000).toFixed(1)}만 조회 달성`);
  } else if (viewCount > 50000) {
    analysis.viral_score += 15;
    analysis.factors.push('준수한 조회수');
  } else if (viewCount > 10000) {
    analysis.viral_score += 10;
    analysis.factors.push('기본 조회수 확보');
  }

  // 3. 업로드 후 경과 시간 대비 조회수 (최근 영상 보너스)
  const publishedDate = new Date(videoInfo.published_at);
  const daysSincePublished = (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60 * 24);
  const viewsPerDay = videoInfo.view_count / Math.max(daysSincePublished, 1);

  if (daysSincePublished < 90 && viewsPerDay > 1000) {
    analysis.viral_score += 20;
    analysis.factors.push('최근 급상승 영상');
    analysis.insights.push(`최근 ${Math.round(daysSincePublished)}일간 일평균 ${Math.round(viewsPerDay).toLocaleString()}회`);
  } else if (daysSincePublished < 365 && viewsPerDay > 500) {
    analysis.viral_score += 15;
    analysis.factors.push('꾸준한 관심');
  } else if (viewsPerDay > 100) {
    analysis.viral_score += 10;
    analysis.factors.push('지속적 유입');
  }

  // 4. 댓글 수 (커뮤니티 반응) - 기준 완화
  const commentCount = videoInfo.comment_count || 0;
  const commentRate = viewCount > 0 ? (commentCount / viewCount) * 100 : 0;
  if (commentCount > 500 || commentRate > 0.5) {
    analysis.viral_score += 15;
    analysis.factors.push('활발한 커뮤니티 반응');
    analysis.insights.push(`댓글 ${commentCount.toLocaleString()}개로 높은 소통률`);
  } else if (commentCount > 100 || commentRate > 0.2) {
    analysis.viral_score += 10;
    analysis.factors.push('적정 커뮤니티 반응');
  }

  // 5. 숏츠 여부 (플랫폼 알고리즘 우대)
  if (videoInfo.is_shorts) {
    analysis.viral_score += 15;
    analysis.factors.push('숏츠 형식');
    analysis.insights.push('YouTube 숏츠의 노출 알고리즘 혜택');
  }

  // 6. 제목 분석 - 보험 관련 키워드 추가
  const titleHooks = [
    // 일반 클릭 유도
    '꿀팁', '완벽', '필수', '추천', '비법', '실패', '성공', '놀라운', '충격', '진짜',
    '주의', '필독', '중요', '꼭', '반드시', '절대', '방법', '총정리', '정리',
    // 보험 관련
    '보험', '청구', '합의금', '배상', '손해', '사고', '보상', '실손', '자동차보험',
    '교통사고', '치료비', '입원', '통원', '진단금', '위로금', '과실', '책임',
    // 금액/수치 관련
    '만원', '억', '몇배', '얼마', '비용', '가격', '무료', '환급',
    // 감정 유발
    '당했', '억울', '분쟁', '거절', '거부', '승소', '패소'
  ];
  const foundHooks = titleHooks.filter(hook => videoInfo.title.includes(hook));
  if (foundHooks.length >= 3) {
    analysis.viral_score += 15;
    analysis.factors.push('강력한 제목 훅');
    analysis.insights.push(`제목에 "${foundHooks.slice(0, 3).join(', ')}" 등 키워드 사용`);
  } else if (foundHooks.length >= 1) {
    analysis.viral_score += 10;
    analysis.factors.push('효과적 제목');
    analysis.insights.push(`"${foundHooks.join(', ')}" 키워드 포함`);
  }

  // 7. 채널 전문성 (보험 관련 채널명)
  const channelName = videoInfo.channel_name || '';
  const insuranceChannels = ['보험', '손해', '배상', '보상', 'TV', '변호사', '손해사정'];
  const isSpecializedChannel = insuranceChannels.some(keyword => channelName.includes(keyword));
  if (isSpecializedChannel) {
    analysis.viral_score += 10;
    analysis.factors.push('전문 채널');
    analysis.insights.push(`${channelName} - 전문 콘텐츠 채널`);
  }

  // 8. 태그 분석
  if (videoInfo.tags && videoInfo.tags.length > 10) {
    analysis.viral_score += 5;
    analysis.factors.push('SEO 최적화');
  }

  // 종합 평가 - 기준 완화
  if (analysis.viral_score >= 70) {
    analysis.rating = '매우 높음';
    analysis.summary = '매우 강력한 바이럴 요소들이 조합되어 있습니다.';
  } else if (analysis.viral_score >= 50) {
    analysis.rating = '높음';
    analysis.summary = '효과적인 바이럴 요소들이 작용하고 있습니다.';
  } else if (analysis.viral_score >= 30) {
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
