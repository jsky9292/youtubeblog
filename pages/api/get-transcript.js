// pages/api/get-transcript.js
// YouTube 자막 추출 API (YouTube Data API v3 사용)

const axios = require('axios');
const { getConfigValue } = require('../../lib/config');
const { YoutubeTranscript } = require('youtube-transcript');

/**
 * youtubei.js로 자막 추출 (가장 최신 방법 - ESM 동적 import)
 */
async function getTranscriptWithYoutubeI(videoId) {
  try {
    console.log('[INFO] youtubei.js로 자막 추출 시도');

    // ESM 패키지이므로 동적 import 사용
    const { Innertube } = await import('youtubei.js');

    const youtube = await Innertube.create();
    const info = await youtube.getInfo(videoId);

    const transcriptData = await info.getTranscript();

    if (!transcriptData || !transcriptData.transcript) {
      console.log('[WARN] youtubei.js: 자막 데이터 없음');
      return null;
    }

    const transcript = transcriptData.transcript;
    const segments = transcript.content?.body?.initial_segments || [];

    if (segments.length === 0) {
      console.log('[WARN] youtubei.js: 자막 세그먼트 없음');
      return null;
    }

    const fullText = segments
      .map(seg => seg.snippet?.text?.toString() || '')
      .filter(text => text.length > 0)
      .join(' ');

    console.log(`[INFO] youtubei.js 자막 추출 성공 (${fullText.length}자)`);
    return fullText;
  } catch (error) {
    console.log('[WARN] youtubei.js 실패:', error.message);
    return null;
  }
}

/**
 * YouTube Data API로 자막 목록 가져오기
 */
async function getCaptionsList(videoId, apiKey) {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/captions', {
      params: {
        part: 'snippet',
        videoId: videoId,
        key: apiKey
      }
    });

    return response.data.items || [];
  } catch (error) {
    console.log('[WARN] Captions API 호출 실패:', error.message);
    return [];
  }
}

/**
 * YouTube Data API로 자막 다운로드 (OAuth 필요 - 대부분 실패함)
 */
async function downloadCaption(captionId, apiKey) {
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/captions/${captionId}`, {
      params: {
        key: apiKey,
        tfmt: 'srt'
      }
    });
    return response.data;
  } catch (error) {
    console.log('[WARN] Caption 다운로드 실패 (OAuth 필요):', error.message);
    return null;
  }
}

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

  console.log(`[INFO] 자막 추출 요청: ${videoId}`);

  const YOUTUBE_API_KEY = getConfigValue('youtube_api_key');

  try {
    let fullText = null;

    // 방법 1: youtubei.js (가장 최신이고 안정적)
    fullText = await getTranscriptWithYoutubeI(videoId);
    if (fullText && fullText.length > 0) {
      console.log(`[INFO] 자막 추출 완료 (youtubei.js) (${fullText.length}자)`);
      return res.status(200).json({
        success: true,
        transcript: fullText,
        length: fullText.length,
      });
    }

    // 방법 2: youtube-transcript 라이브러리 (fallback)
    let transcript = null;
    try {
      transcript = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'ko' });
      console.log(`[INFO] 한국어 자막 추출 성공, 길이: ${transcript ? transcript.length : 0}`);

      if (transcript && transcript.length > 0) {
        fullText = transcript.map(item => item.text).join(' ');
        console.log(`[INFO] 자막 추출 완료 (youtube-transcript) (${fullText.length}자)`);
        return res.status(200).json({
          success: true,
          transcript: fullText,
          length: fullText.length,
        });
      }
    } catch (koError) {
      console.log('[INFO] 한국어 자막 없음, 영어 시도');

      try {
        transcript = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' });
        console.log(`[INFO] 영어 자막 추출 성공`);

        if (transcript && transcript.length > 0) {
          const fullText = transcript.map(item => item.text).join(' ');
          console.log(`[INFO] 자막 추출 완료 (${fullText.length}자)`);
          return res.status(200).json({
            success: true,
            transcript: fullText,
            length: fullText.length,
          });
        }
      } catch (enError) {
        console.log('[INFO] 영어 자막도 없음, 자동 언어 감지 시도');

        try {
          transcript = await YoutubeTranscript.fetchTranscript(videoId);
          console.log(`[INFO] 자동 언어 감지로 자막 추출 성공`);

          if (transcript && transcript.length > 0) {
            const fullText = transcript.map(item => item.text).join(' ');
            console.log(`[INFO] 자막 추출 완료 (${fullText.length}자)`);
            return res.status(200).json({
              success: true,
              transcript: fullText,
              length: fullText.length,
            });
          }
        } catch (autoError) {
          console.log('[WARN] youtube-transcript 실패, YouTube Data API 시도');
        }
      }
    }

    // 방법 2: YouTube Data API (fallback)
    if (!transcript && YOUTUBE_API_KEY) {
      console.log('[INFO] YouTube Data API로 자막 목록 조회 중...');
      const captions = await getCaptionsList(videoId, YOUTUBE_API_KEY);

      if (captions.length > 0) {
        console.log(`[INFO] 자막 ${captions.length}개 발견`);

        // 한국어 또는 영어 자막 찾기
        const koCaptions = captions.find(c => c.snippet.language === 'ko');
        const enCaptions = captions.find(c => c.snippet.language === 'en');
        const targetCaption = koCaptions || enCaptions || captions[0];

        if (targetCaption) {
          console.log(`[INFO] ${targetCaption.snippet.language} 자막 다운로드 시도`);
          const captionText = await downloadCaption(targetCaption.id, YOUTUBE_API_KEY);

          if (captionText) {
            // SRT 형식을 텍스트로 변환
            const lines = captionText.split('\n').filter(line =>
              line.trim() &&
              !line.match(/^\d+$/) &&
              !line.match(/\d{2}:\d{2}:\d{2}/)
            );
            transcript = lines.map(line => ({ text: line }));
            console.log('[INFO] YouTube Data API로 자막 추출 성공');

            if (transcript && transcript.length > 0) {
              const fullText = transcript.map(item => item.text).join(' ');
              console.log(`[INFO] 자막 추출 완료 (${fullText.length}자)`);
              return res.status(200).json({
                success: true,
                transcript: fullText,
                length: fullText.length,
              });
            }
          }
        }
      }
    }

    // 모든 방법 실패
    console.log('[ERROR] 모든 방법으로 자막 추출 실패');
    return res.status(404).json({
      success: false,
      error: '이 영상은 자막이 없거나 자막 추출이 불가능합니다.',
    });
  } catch (error) {
    console.error('[ERROR] 자막 추출 실패:', error.message);
    return res.status(500).json({
      success: false,
      error: '자막 추출 중 오류가 발생했습니다: ' + error.message,
    });
  }
}
