// pages/api/summarize-transcript.js
// 스크립트를 타임스탬프별로 요약하는 API

const axios = require('axios');
const { getConfigValue } = require('../../lib/config');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { transcript, videoTitle } = req.body;

    if (!transcript) {
      return res.status(400).json({ success: false, message: '스크립트가 필요합니다.' });
    }

    const GEMINI_API_KEY = getConfigValue('gemini_api_key');

    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API 키가 설정되지 않았습니다.');
    }

    const prompt = `아래 YouTube 영상 스크립트를 타임스탬프별로 요약 정리해주세요.

**영상 제목**: ${videoTitle || '제목 없음'}

**스크립트**:
${transcript}

**요구사항**:
1. 타임스탬프 (MM:SS) 형식으로 시간별 구분
2. 각 타임스탬프마다 핵심 내용을 1-2줄로 요약
3. 전체 요지를 마지막에 2-3줄로 정리
4. 한국어로 작성, ~해요 체 사용

**출력 형식**:
(00:00) 첫 번째 내용 요약
(01:23) 두 번째 내용 요약
...

**전체 요지**: 영상의 핵심 메시지를 2-3줄로 정리`;

    console.log('[INFO] 스크립트 요약 생성 시작');

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 8192,
        }
      },
      { timeout: 60000 }
    );

    const summary = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!summary) {
      throw new Error('요약 생성 실패');
    }

    console.log('[INFO] 스크립트 요약 완료');

    return res.status(200).json({
      success: true,
      summary: summary.trim()
    });

  } catch (error) {
    console.error('[ERROR] 스크립트 요약 실패:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
