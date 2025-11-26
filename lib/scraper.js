// lib/scraper.js
// 웹 콘텐츠 스크래핑 라이브러리 (저작권 준수)

import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * 웹페이지에서 메타데이터 및 콘텐츠 추출
 * 주의: 추출된 콘텐츠는 원본 그대로 사용하지 말고 반드시 AI로 재작성해야 함
 */
export async function scrapeWebContent(url) {
  try {
    // User-Agent 설정으로 차단 방지
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
      },
      timeout: 15000,
      maxRedirects: 5
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // 1. 메타데이터 추출 (가장 안정적)
    const metadata = {
      title: $('meta[property="og:title"]').attr('content') ||
             $('meta[name="twitter:title"]').attr('content') ||
             $('title').text() ||
             $('h1').first().text(),

      description: $('meta[property="og:description"]').attr('content') ||
                   $('meta[name="description"]').attr('content') ||
                   $('meta[name="twitter:description"]').attr('content'),

      image: $('meta[property="og:image"]').attr('content') ||
             $('meta[name="twitter:image"]').attr('content'),

      keywords: $('meta[name="keywords"]').attr('content') || '',

      author: $('meta[name="author"]').attr('content') ||
              $('meta[property="article:author"]').attr('content'),

      publishedDate: $('meta[property="article:published_time"]').attr('content') ||
                     $('time').attr('datetime')
    };

    // 2. 본문 콘텐츠 추출 (여러 선택자 시도)
    let content = '';
    let extractedImages = [];

    console.log('[스크래핑] URL:', url);

    // 네이버 블로그 감지
    if (url.includes('blog.naver.com')) {
      console.log('[스크래핑] 네이버 블로그 감지');

      // iframe이 있는지 확인 (새 네이버 블로그는 iframe 구조 사용)
      const iframe = $('iframe#mainFrame, iframe').first();
      if (iframe.length > 0) {
        const iframeSrc = iframe.attr('src');
        console.log('[스크래핑] iframe 감지:', iframeSrc);

        if (iframeSrc) {
          // iframe URL 구성 (상대 경로면 절대 경로로 변환)
          let iframeUrl = iframeSrc;
          if (iframeSrc.startsWith('/')) {
            iframeUrl = 'https://blog.naver.com' + iframeSrc;
          }

          console.log('[스크래핑] iframe 콘텐츠 요청:', iframeUrl);

          try {
            // iframe 콘텐츠 가져오기
            const iframeResponse = await axios.get(iframeUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                'Referer': url
              },
              timeout: 15000
            });

            const $iframe = cheerio.load(iframeResponse.data);
            content = extractNaverBlogContent($iframe);
            extractedImages = extractNaverBlogImages($iframe);
            console.log('[스크래핑] iframe에서 추출된 콘텐츠 길이:', content.length);
          } catch (iframeError) {
            console.error('[스크래핑] iframe 요청 실패:', iframeError.message);
            // iframe 요청 실패 시 원본 HTML에서 시도
            content = extractNaverBlogContent($);
            extractedImages = extractNaverBlogImages($);
          }
        } else {
          content = extractNaverBlogContent($);
          extractedImages = extractNaverBlogImages($);
        }
      } else {
        // iframe 없으면 바로 추출
        content = extractNaverBlogContent($);
        extractedImages = extractNaverBlogImages($);
      }

      console.log('[스크래핑] 최종 추출된 콘텐츠 길이:', content.length);
    }
    // 네이버 뉴스
    else if (url.includes('news.naver.com')) {
      content = extractNaverNewsContent($);
      extractedImages = extractNaverNewsImages($);
    }
    // 티스토리
    else if (url.includes('tistory.com')) {
      content = extractTistoryContent($);
      extractedImages = extractTistoryImages($);
    }
    // 일반 웹사이트
    else {
      content = extractGeneralContent($);
      extractedImages = extractGeneralImages($);
    }

    // 3. 텍스트 정제
    content = cleanText(content);

    // 4. 콘텐츠 길이 확인
    if (content.length < 100) {
      return {
        success: false,
        error: '추출된 콘텐츠가 너무 짧습니다. 이 페이지는 스크래핑이 어렵습니다.'
      };
    }

    return {
      success: true,
      url: url,
      metadata: metadata,
      content: content.substring(0, 10000), // 최대 10,000자만 추출 (저작권 고려)
      images: extractedImages.slice(0, 5), // 최대 5개 이미지
      extractedAt: new Date().toISOString(),
      warning: '⚠️ 이 콘텐츠는 반드시 AI로 재작성하여 사용해야 합니다. 원본 그대로 사용시 저작권 침해입니다.'
    };

  } catch (error) {
    console.error('[스크래핑 오류]', error.message);

    if (error.code === 'ENOTFOUND') {
      return {
        success: false,
        error: '유효하지 않은 URL입니다.'
      };
    } else if (error.code === 'ETIMEDOUT') {
      return {
        success: false,
        error: '페이지 로딩 시간 초과. 다시 시도해주세요.'
      };
    } else if (error.response?.status === 403) {
      return {
        success: false,
        error: '접근이 거부되었습니다. 이 사이트는 스크래핑을 차단합니다.'
      };
    } else {
      return {
        success: false,
        error: `콘텐츠 추출 실패: ${error.message}`
      };
    }
  }
}

// 네이버 블로그 콘텐츠 추출
function extractNaverBlogContent($) {
  // 1. 새로운 네이버 블로그 에디터 (Smart Editor) - se-component 수집
  let content = '';

  $('div.se-component, div.se-text, div.__se_component_area').each((i, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 20) {
      content += text + '\n\n';
    }
  });

  if (content.length > 100) {
    console.log('[네이버 블로그] se-component에서 추출:', content.length, '자');
    return content;
  }

  // 2. 기존 선택자들
  const selectors = [
    'div.se-main-container',
    'div#postViewArea',
    'div.post-view',
    'div#post-area',
    'article',
    'div.post_ct'
  ];

  for (const selector of selectors) {
    const text = $(selector).text().trim();
    if (text.length > 100) {
      console.log('[네이버 블로그]', selector, '에서 추출:', text.length, '자');
      return text;
    }
  }

  // 3. 모든 p 태그 수집
  let pContent = '';
  $('p, div.se-text-paragraph').each((i, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 10) {
      pContent += text + '\n\n';
    }
  });

  if (pContent.length > 100) {
    console.log('[네이버 블로그] p 태그에서 추출:', pContent.length, '자');
    return pContent;
  }

  // 4. body에서 스크립트/스타일 제거 후 추출
  $('script, style, nav, header, footer, aside, iframe, .aside, .header, .footer').remove();
  const bodyText = $('body').text().trim();
  console.log('[네이버 블로그] body에서 추출:', bodyText.length, '자');
  return bodyText;
}

// 네이버 블로그 이미지 추출
function extractNaverBlogImages($) {
  const images = [];

  $('img.se-image-resource, img.__se_img_el, div#postViewArea img').each((i, el) => {
    const src = $(el).attr('data-lazy-src') ||
                $(el).attr('data-src') ||
                $(el).attr('src');
    if (src && !src.includes('icon') && !src.includes('logo')) {
      images.push(src.startsWith('//') ? 'https:' + src : src);
    }
  });

  return images;
}

// 네이버 뉴스 콘텐츠 추출
function extractNaverNewsContent($) {
  const selectors = [
    'article#dic_area',
    'div#articleBodyContents',
    'div#articeBody',
    'div.news_end'
  ];

  for (const selector of selectors) {
    const text = $(selector).text().trim();
    if (text.length > 100) return text;
  }

  return $('body').text();
}

// 네이버 뉴스 이미지 추출
function extractNaverNewsImages($) {
  const images = [];

  $('img#img1, article img, div#articleBodyContents img').each((i, el) => {
    const src = $(el).attr('data-src') || $(el).attr('src');
    if (src && !src.includes('icon') && !src.includes('logo')) {
      images.push(src.startsWith('//') ? 'https:' + src : src);
    }
  });

  return images;
}

// 티스토리 콘텐츠 추출
function extractTistoryContent($) {
  const selectors = [
    'div.entry-content',
    'div.article-view',
    'div.contents_style',
    'article'
  ];

  for (const selector of selectors) {
    const text = $(selector).text().trim();
    if (text.length > 100) return text;
  }

  return $('body').text();
}

// 티스토리 이미지 추출
function extractTistoryImages($) {
  const images = [];

  $('div.entry-content img, article img').each((i, el) => {
    const src = $(el).attr('data-lazy-src') || $(el).attr('src');
    if (src && !src.includes('icon') && !src.includes('logo')) {
      images.push(src);
    }
  });

  return images;
}

// 일반 웹사이트 콘텐츠 추출
function extractGeneralContent($) {
  const selectors = [
    'article',
    '[role="main"]',
    'main',
    'div.post-content',
    'div.entry-content',
    'div.content',
    'div#content',
    'div.article-body',
    'div.post'
  ];

  for (const selector of selectors) {
    const text = $(selector).text().trim();
    if (text.length > 100) return text;
  }

  // 최후의 수단: body에서 추출 (스크립트/스타일 제거)
  $('script, style, nav, header, footer, aside, .ad, .advertisement').remove();
  return $('body').text();
}

// 일반 웹사이트 이미지 추출
function extractGeneralImages($) {
  const images = [];

  $('article img, main img, div.content img').each((i, el) => {
    const src = $(el).attr('src');
    if (src &&
        !src.includes('icon') &&
        !src.includes('logo') &&
        !src.includes('ad') &&
        !src.includes('banner')) {
      images.push(src);
    }
  });

  return images;
}

// 텍스트 정제
function cleanText(text) {
  return text
    .replace(/\s+/g, ' ')           // 연속 공백을 하나로
    .replace(/\n\s*\n/g, '\n')      // 연속 줄바꿈을 하나로
    .replace(/[\r\t]/g, '')         // 캐리지 리턴, 탭 제거
    .trim();
}

/**
 * URL 유효성 검사
 */
export function validateUrl(url) {
  try {
    const urlObj = new URL(url);
    const allowedProtocols = ['http:', 'https:'];

    if (!allowedProtocols.includes(urlObj.protocol)) {
      return {
        valid: false,
        error: 'HTTP 또는 HTTPS URL만 지원합니다.'
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: '유효하지 않은 URL 형식입니다.'
    };
  }
}
