// components/Layout.js
// 보상닥터 스타일 레이아웃 (보험을 담다 브랜딩)

import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function Layout({
  children,
  title,
  description,
  keywords,
  ogImage,
  article = false,
  publishedTime,
  modifiedTime,
  author = '보험을 담다'
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const siteTitle = '보험을 담다';
  const siteName = '보험을 담다 - 손해사정 전문 블로그';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ins-prosoultion.com';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteName;

  const siteDescription = description || '손해사정사가 직접 알려주는 보험금 청구의 모든 것. 교통사고, 산재, 보험분쟁 전문.';
  const siteKeywords = keywords || '손해사정사, 보험금 청구, 교통사고 합의금, 산재보험, 보험분쟁';
  const ogImageUrl = ogImage || `${siteUrl}/og-image.png`;

  const navLinks = [
    { href: '/about', label: '소개' },
    { href: '/services', label: '서비스 안내' },
    { href: '/cases', label: '성공 사례' },
    { href: '/contact', label: '무료 상담' },
    { href: '/', label: '블로그' },
  ];

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

      <div className="relative flex min-h-screen w-full flex-col bg-background-light">
        {/* 헤더 */}
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md">
          <div className="flex justify-center w-full">
            <div className="w-full max-w-[1280px] px-4 md:px-10 py-3">
              <div className="flex items-center justify-between whitespace-nowrap">
                {/* 로고 */}
                <Link href="/" className="flex items-center gap-3 text-primary">
                  <div className="size-8 flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl">balance</span>
                  </div>
                  <h2 className="text-gray-900 text-xl font-bold leading-tight tracking-tight">보험을 담다</h2>
                </Link>

                {/* 데스크톱 네비게이션 */}
                <div className="hidden lg:flex flex-1 justify-end gap-8">
                  <nav className="flex items-center gap-9">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-gray-700 text-sm font-medium hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <Link
                    href="/contact"
                    className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary hover:bg-blue-700 transition-colors text-white text-sm font-bold shadow-sm"
                  >
                    <span className="truncate">무료 상담 신청</span>
                  </Link>
                </div>

                {/* 모바일 메뉴 버튼 */}
                <div className="lg:hidden">
                  <button
                    className="p-2 text-gray-600"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    <span className="material-symbols-outlined">menu</span>
                  </button>
                </div>
              </div>

              {/* 모바일 메뉴 */}
              {mobileMenuOpen && (
                <div className="lg:hidden py-4 border-t border-gray-200 mt-3">
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-gray-700 text-sm font-medium hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Link
                      href="/contact"
                      className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary hover:bg-blue-700 transition-colors text-white text-sm font-bold shadow-sm mt-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="truncate">무료 상담 신청</span>
                    </Link>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* 푸터 */}
        <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
          <div className="flex justify-center">
            <div className="w-full max-w-[1280px] px-4 md:px-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                {/* 브랜드 */}
                <div className="col-span-1 md:col-span-1">
                  <Link href="/" className="flex items-center gap-2 text-gray-900 mb-4">
                    <span className="material-symbols-outlined text-2xl text-primary">balance</span>
                    <span className="text-lg font-bold">보험을 담다</span>
                  </Link>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    고객의 권리를 최우선으로 생각하는<br/>손해사정 전문 블로그입니다.
                  </p>
                  <div className="flex gap-4">
                    <a className="text-gray-400 hover:text-primary" href="#">
                      <span className="material-symbols-outlined">post_add</span>
                    </a>
                    <a className="text-gray-400 hover:text-primary" href="#">
                      <span className="material-symbols-outlined">alternate_email</span>
                    </a>
                  </div>
                </div>

                {/* 전문 분야 */}
                <div>
                  <h4 className="text-gray-900 font-bold mb-4">전문 분야</h4>
                  <ul className="flex flex-col gap-2 text-sm text-gray-500">
                    <li><Link className="hover:text-primary" href="/category/traffic">교통사고 보상</Link></li>
                    <li><Link className="hover:text-primary" href="/category/industrial">산재/근재 보험</Link></li>
                    <li><Link className="hover:text-primary" href="/category/dispute">보험 분쟁</Link></li>
                    <li><Link className="hover:text-primary" href="/category/liability">배상책임 보험</Link></li>
                  </ul>
                </div>

                {/* 콘텐츠 */}
                <div>
                  <h4 className="text-gray-900 font-bold mb-4">콘텐츠</h4>
                  <ul className="flex flex-col gap-2 text-sm text-gray-500">
                    <li><Link className="hover:text-primary" href="/">블로그</Link></li>
                    <li><Link className="hover:text-primary" href="/cases">성공 사례</Link></li>
                    <li><Link className="hover:text-primary" href="/guides">보험 가이드</Link></li>
                    <li><Link className="hover:text-primary" href="/calculator">합의금 계산기</Link></li>
                  </ul>
                </div>

                {/* 고객 센터 */}
                <div>
                  <h4 className="text-gray-900 font-bold mb-4">고객 센터</h4>
                  <ul className="flex flex-col gap-2 text-sm text-gray-500">
                    <li><Link className="hover:text-primary" href="/contact">무료 상담</Link></li>
                    <li><Link className="hover:text-primary" href="/about">소개</Link></li>
                    <li><Link className="hover:text-primary" href="/privacy">개인정보처리방침</Link></li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-xs text-gray-400 text-center md:text-left">
                  <p>© {new Date().getFullYear()} 보험을 담다. All rights reserved.</p>
                  <p className="mt-1">본 사이트의 콘텐츠는 일반적인 정보 제공 목적이며, 법적 자문을 대체하지 않습니다.</p>
                </div>
                <div className="flex gap-4 text-xs text-gray-500">
                  <Link className="hover:text-primary font-bold" href="/privacy">개인정보처리방침</Link>
                  <Link className="hover:text-primary" href="/terms">이용약관</Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
