// components/Navbar.js
// 토스 스타일 네비게이션

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: '분쟁사례', href: '/cases' },
    { name: '자동차보험', href: '/category/auto' },
    { name: '실손보험', href: '/category/health' },
    { name: '생명보험', href: '/category/life' },
  ];

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">보</span>
            </div>
            <span className="text-lg font-bold text-gray-900">보담</span>
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 text-sm text-gray-600 hover:text-blue-500 rounded-lg transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* 상담 버튼 */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/quiz"
              className="text-sm text-gray-600 hover:text-blue-500 transition-colors"
            >
              자가진단
            </Link>
            <Link href="/contact">
              <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-xl hover:bg-blue-600 transition-colors">
                무료상담
              </button>
            </Link>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="메뉴"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2 border-t mt-2">
              <Link
                href="/quiz"
                className="block px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                보험금 자가진단
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                <div className="mt-2 px-3 py-2.5 bg-blue-500 text-white text-center rounded-xl font-medium">
                  무료 상담 신청
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
