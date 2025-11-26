// pages/api/get-video-description.js
// YouTube 영상 설명 가져오기 API (자막 없을 때 대체용)

const { getVideoInfo } = require('../../lib/youtube');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
    });
  }

  const { videoId } = req.body;

  if (!videoId) {
    return res.status(400).json({
      success: false,
      error: '영상 ID가 필요합니다',
    });
  }

  console.log(`[INFO] 영상 설명 조회: ${videoId}`);

  try {
    // lib/youtube.js의 getVideoInfo 함수 사용
    const videoInfo = await getVideoInfo(videoId);

    if (!videoInfo || !videoInfo.description) {
      console.log('[WARN] 영상 설명 없음');
      return res.status(404).json({
        success: false,
        error: '영상 설명을 찾을 수 없습니다',
      });
    }

    console.log(`[INFO] 영상 설명 조회 성공 (${videoInfo.description.length}자)`);

    return res.status(200).json({
      success: true,
      description: videoInfo.description,
      title: videoInfo.title,
      channelName: videoInfo.channel_name,
      viewCount: videoInfo.view_count,
      publishedAt: videoInfo.published_at,
    });
  } catch (error) {
    console.error('[ERROR] 영상 설명 조회 실패:', error.message);
    return res.status(500).json({
      success: false,
      error: '영상 설명 조회 중 오류가 발생했습니다: ' + error.message,
    });
  }
}
