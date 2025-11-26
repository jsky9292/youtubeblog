// pages/api/search-videos.js
// YouTube 영상 검색 API

import { searchVideos, getVideoInfo, analyzeViralFactors } from '../../lib/youtube';
import { saveDiscoveredVideo } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '허용되지 않은 메소드입니다' });
  }

  try {
    const {
      keyword,
      minViews = 10000,
      maxResults = 20,
      periodDays = 30,
      videoDuration = 'any' // 'short': 숏츠, 'long': 롱폼, 'any': 전체
    } = req.body;

    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({ error: '키워드를 입력해주세요' });
    }

    const durationLabel = videoDuration === 'short' ? '숏츠만' : videoDuration === 'long' ? '롱폼만' : '전체';
    console.log(`[INFO] YouTube 검색 시작: ${keyword} (기간: ${periodDays}일, 최소조회수: ${minViews}, 형식: ${durationLabel}, 최대결과: ${maxResults})`);

    // YouTube API로 영상 검색 (숏츠/롱폼 구분 포함)
    const videos = await searchVideos(keyword, minViews, maxResults, periodDays, videoDuration);

    console.log(`[INFO] 검색 결과: ${videos.length}개 영상`);

    // 각 영상에 대해 상세 정보 가져오기 및 바이럴 분석
    console.log(`[INFO] 영상 바이럴 분석 시작...`);
    const videosWithAnalysis = await Promise.all(
      videos.map(async (video) => {
        try {
          // 상세 정보 조회 (comment_count, description 등 포함)
          const videoInfo = await getVideoInfo(video.video_id);
          // 바이럴 요인 분석
          const viralAnalysis = analyzeViralFactors(videoInfo);

          console.log(`[INFO] ${video.video_id}: 바이럴 점수 ${viralAnalysis.viral_score}점 (${viralAnalysis.rating})`);

          return {
            ...video,
            viral_analysis: viralAnalysis
          };
        } catch (error) {
          console.error(`[WARN] 영상 분석 실패 (${video.video_id}):`, error.message);
          return {
            ...video,
            viral_analysis: null
          };
        }
      })
    );

    // 데이터베이스에 저장
    let savedCount = 0;
    for (const video of videosWithAnalysis) {
      try {
        saveDiscoveredVideo(video);
        savedCount++;
      } catch (error) {
        console.error(`[WARN] 영상 저장 실패: ${video.video_id}`, error.message);
      }
    }

    console.log(`[INFO] DB 저장 완료: ${savedCount}개 영상`);

    res.status(200).json({
      success: true,
      keyword,
      videos: videosWithAnalysis,
      savedCount,
    });
  } catch (error) {
    console.error('[ERROR] 영상 검색 실패:', error.message);
    res.status(500).json({
      error: '영상 검색 중 오류가 발생했습니다',
      details: error.message,
    });
  }
}
