const axios = require('axios');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./data/config.json', 'utf8'));
const API_KEY = config.gemini_api_key;

const testPrompt = 'Professional insurance consultation scene, modern office, warm lighting, photorealistic';

async function test() {
  const models = ['gemini-2.5-flash-image', 'gemini-2.0-flash-exp-image-generation'];

  for (const model of models) {
    console.log('\n=== 테스트:', model, '===');
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
      const res = await axios.post(url, {
        contents: [{ parts: [{ text: 'Generate an image: ' + testPrompt }] }],
        generationConfig: { responseModalities: ['TEXT', 'IMAGE'] }
      }, { timeout: 60000 });

      const parts = res.data?.candidates?.[0]?.content?.parts || [];
      console.log('응답 parts 수:', parts.length);

      for (const part of parts) {
        if (part.text) console.log('텍스트:', part.text.substring(0, 100));
        if (part.inlineData) {
          console.log('✅ 이미지 생성 성공!');
          console.log('이미지 타입:', part.inlineData.mimeType);
          console.log('이미지 데이터 길이:', part.inlineData.data?.length || 0, 'bytes');
        }
      }
    } catch (err) {
      console.log('❌ 에러:', err.response?.data?.error?.message || err.message);
    }
  }
}

test();
