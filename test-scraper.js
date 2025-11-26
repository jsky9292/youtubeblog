// test-scraper.js - 네이버 블로그 스크래핑 테스트

const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://blog.naver.com/marlasingerstreet/224086705659';

async function test() {
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(res.data);

    console.log('=== HTML 구조 분석 ===');
    console.log('Title:', $('title').text());
    console.log('OG Title:', $('meta[property="og:title"]').attr('content'));
    console.log('');

    console.log('=== 선택자 테스트 ===');
    const selectors = [
      'div.se-main-container',
      'div.se-component',
      'div#postViewArea',
      'div.post_ct',
      'div.post-view',
      'article'
    ];

    for (const selector of selectors) {
      const elements = $(selector);
      const text = elements.text().trim();
      console.log(`${selector}:`, elements.length, '개, 텍스트:', text.substring(0, 100));
    }

    // iframe 확인
    console.log('');
    console.log('=== iframe 확인 ===');
    console.log('iframe 개수:', $('iframe').length);
    $('iframe').each((i, el) => {
      console.log('iframe', i, 'src:', $(el).attr('src'));
    });

    // body 전체 텍스트 길이
    console.log('');
    console.log('=== 전체 텍스트 ===');
    console.log('Body 텍스트 길이:', $('body').text().length);

  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
