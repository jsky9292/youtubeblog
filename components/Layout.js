// components/Layout.js
// 공통 레이아웃 컴포넌트 (SEO 최적화)

import Head from 'next/head';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';

export default function Layout({
  children,
  title,
  description,
  keywords,
  ogImage,
  article = false,
  publishedTime,
  modifiedTime,
  author = 'AI 잡학박사'
}) {
  const siteTitle = 'AI 잡학박사';
  const siteName = 'AI 잡학박사';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourblog.com';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;

  // SNS 링크 상태
  const [snsLinks, setSnsLinks] = useState({
    youtube: '',
    instagram: '',
    facebook: '',
    twitter: '',
    blog: '',
    kakao: '',
  });

  // SNS 설정 불러오기
  useEffect(() => {
    fetch('/api/config/sns')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSnsLinks(data.sns);
        }
      })
      .catch(err => console.error('SNS 설정 로드 실패:', err));
  }, []);
  const siteDescription =
    description ||
    'AI 잡학박사 - 다양한 주제의 유익한 정보를 AI가 정리해드립니다. 생활정보, 건강, 재테크, 기술, 취미 등 검증된 정보를 쉽고 빠르게 얻어보세요.';
  const siteKeywords = keywords || 'AI 잡학박사, 블로그, 생활정보, 건강, 재테크, 기술, 취미, AI';
  const ogImageUrl = ogImage || `${siteUrl}/og-image.png`;

  return (
    <>
      <Head>
        {/* 기본 메타 태그 */}
        <title>{fullTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="keywords" content={siteKeywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="author" content={author} />

        {/* Open Graph (Facebook, LinkedIn) */}
        <meta property="og:type" content={article ? 'article' : 'website'} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:locale" content="ko_KR" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={ogImageUrl} />

        {/* Article 메타 (블로그 포스트용) */}
        {article && publishedTime && (
          <>
            <meta property="article:published_time" content={publishedTime} />
            {modifiedTime && (
              <meta property="article:modified_time" content={modifiedTime} />
            )}
            <meta property="article:author" content={author} />
          </>
        )}

        {/* Canonical URL */}
        <link rel="canonical" href={siteUrl} />

        {/* Google AdSense (나중에 활성화) */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous"></script> */}
      </Head>

      {/* 구조화된 데이터 (Schema.org) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': article ? 'BlogPosting' : 'WebSite',
            name: fullTitle,
            description: siteDescription,
            url: siteUrl,
            ...(article && {
              headline: title,
              datePublished: publishedTime,
              dateModified: modifiedTime || publishedTime,
              author: {
                '@type': 'Organization',
                name: author
              },
              publisher: {
                '@type': 'Organization',
                name: siteName,
                logo: {
                  '@type': 'ImageObject',
                  url: `${siteUrl}/logo.png`
                }
              },
              image: ogImageUrl
            })
          })
        }}
      />

      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* 네비게이션 바 */}
        <Navbar />

        {/* 메인 컨텐츠 */}
        <main className="flex-grow">{children}</main>

        {/* 푸터 */}
        <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-16">
          <div className="container-custom py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* 사이트 정보 */}
              <div>
                <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  🤖 {siteName}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  AI가 정리하는 다양한 분야의 잡학 지식!
                  유용한 정보를 쉽고 빠르게 만나보세요.
                </p>
              </div>

              {/* 카테고리 링크 */}
              <div>
                <h4 className="font-semibold mb-4">카테고리</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/category/life" className="text-gray-400 hover:text-purple-400 transition-colors">생활정보</a></li>
                  <li><a href="/category/health" className="text-gray-400 hover:text-purple-400 transition-colors">건강</a></li>
                  <li><a href="/category/finance" className="text-gray-400 hover:text-purple-400 transition-colors">재테크</a></li>
                  <li><a href="/category/tech" className="text-gray-400 hover:text-purple-400 transition-colors">기술</a></li>
                </ul>
              </div>

              {/* SNS 채널 & 관리자 링크 */}
              <div>
                <h4 className="font-semibold mb-4">링크</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/" className="text-gray-400 hover:text-purple-400 transition-colors">홈</a></li>
                </ul>

                {/* SNS 아이콘 */}
                {(snsLinks.youtube || snsLinks.instagram || snsLinks.facebook || snsLinks.twitter || snsLinks.blog || snsLinks.kakao) && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-3 text-sm">SNS 채널</h4>
                    <div className="flex flex-wrap gap-3">
                      {snsLinks.youtube && (
                        <a href={snsLinks.youtube} target="_blank" rel="noopener noreferrer"
                          className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                          title="YouTube">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                        </a>
                      )}
                      {snsLinks.instagram && (
                        <a href={snsLinks.instagram} target="_blank" rel="noopener noreferrer"
                          className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                          title="Instagram">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                          </svg>
                        </a>
                      )}
                      {snsLinks.facebook && (
                        <a href={snsLinks.facebook} target="_blank" rel="noopener noreferrer"
                          className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                          title="Facebook">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </a>
                      )}
                      {snsLinks.twitter && (
                        <a href={snsLinks.twitter} target="_blank" rel="noopener noreferrer"
                          className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                          title="X (Twitter)">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        </a>
                      )}
                      {snsLinks.blog && (
                        <a href={snsLinks.blog} target="_blank" rel="noopener noreferrer"
                          className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors"
                          title="네이버 블로그">
                          <span className="text-white font-bold text-sm">N</span>
                        </a>
                      )}
                      {snsLinks.kakao && (
                        <a href={snsLinks.kakao} target="_blank" rel="noopener noreferrer"
                          className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-300 transition-colors"
                          title="카카오톡 채널">
                          <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.847 1.893 5.34 4.728 6.74-.184.678-.72 2.463-.826 2.85-.13.476.175.47.368.342.152-.1 2.42-1.645 3.408-2.315.74.11 1.506.168 2.292.168 5.523 0 10-3.582 10-8s-4.477-8-10-8z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-700 pt-8 text-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} {siteName}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
