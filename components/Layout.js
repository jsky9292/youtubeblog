// components/Layout.js
// 토스 스타일 레이아웃

import Head from 'next/head';
import Navbar from './Navbar';
import Link from 'next/link';

export default function Layout({
  children,
  title,
  description,
  keywords,
  ogImage,
  article = false,
  publishedTime,
  modifiedTime,
  author = '보담'
}) {
  const siteTitle = '보험을 담다';
  const siteName = '보험을 담다 - 손해사정사의 보험 이야기';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://youtubeblog-rho.vercel.app';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteName;

  const siteDescription = description || '손해사정사가 직접 알려주는 보험금 청구의 모든 것.';
  const siteKeywords = keywords || '보험금 청구, 손해사정사, 자동차보험, 실손보험';
  const ogImageUrl = ogImage || `${siteUrl}/og-image.png`;

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="keywords" content={siteKeywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="author" content={author} />

        <meta property="og:type" content={article ? 'article' : 'website'} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:locale" content="ko_KR" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={ogImageUrl} />

        {article && publishedTime && (
          <>
            <meta property="article:published_time" content={publishedTime} />
            {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
            <meta property="article:author" content={author} />
          </>
        )}

        <link rel="canonical" href={siteUrl} />
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">{children}</main>

        {/* 푸터 */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              {/* 브랜드 */}
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-3">
                  <img src="/logo.png" alt="보험을 담다" className="h-7 w-auto" />
                  <span className="font-bold text-gray-900">보험을 담다</span>
                </div>
                <p className="text-sm text-gray-500">
                  손해사정사가 직접 알려주는<br />
                  보험금 청구의 모든 것
                </p>
              </div>

              {/* 보험 정보 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 text-sm">보험 정보</h4>
                <ul className="space-y-2">
                  <li><Link href="/cases" className="text-sm text-gray-500 hover:text-blue-500">분쟁사례</Link></li>
                  <li><Link href="/category/auto" className="text-sm text-gray-500 hover:text-blue-500">자동차보험</Link></li>
                  <li><Link href="/category/health" className="text-sm text-gray-500 hover:text-blue-500">실손보험</Link></li>
                  <li><Link href="/category/life" className="text-sm text-gray-500 hover:text-blue-500">생명보험</Link></li>
                </ul>
              </div>

              {/* 서비스 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 text-sm">서비스</h4>
                <ul className="space-y-2">
                  <li><Link href="/guides" className="text-sm text-gray-500 hover:text-blue-500">보험 가이드</Link></li>
                  <li><Link href="/calculator" className="text-sm text-gray-500 hover:text-blue-500">합의금 계산기</Link></li>
                  <li><Link href="/quiz" className="text-sm text-gray-500 hover:text-blue-500">자가진단</Link></li>
                  <li><Link href="/contact" className="text-sm text-gray-500 hover:text-blue-500">무료 상담</Link></li>
                </ul>
              </div>

              {/* 정보 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 text-sm">정보</h4>
                <ul className="space-y-2">
                  <li><Link href="/about" className="text-sm text-gray-500 hover:text-blue-500">소개</Link></li>
                  <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-blue-500">개인정보처리방침</Link></li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t text-center">
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} 보험을 담다. 본 사이트의 정보는 참고용입니다.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
