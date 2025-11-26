// components/Navbar.js
// 메인 페이지 네비게이션 바

import Link from 'next/link';
import { useState } from 'react';
import { categories } from '../lib/categories';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                🤖 AI 잡학박사
              </span>
            </div>
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center space-x-1">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.id === 'all' ? '/' : `/category/${category.slug}`}
              >
                <span className="px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer font-medium">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>

          {/* 빈 공간 (관리자 버튼 제거됨 - /admin/login 통해 접근) */}
          <div className="hidden md:block w-8"></div>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container-custom py-4 space-y-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.id === 'all' ? '/' : `/category/${category.slug}`}
              >
                <div
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
