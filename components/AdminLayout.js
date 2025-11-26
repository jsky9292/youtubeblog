import Link from 'next/link';

export default function AdminLayout({ children, title }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 네비게이션 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin/dashboard">
                <span className="text-xl font-bold text-blue-600 cursor-pointer">📝 Blog Admin</span>
              </Link>
              <div className="ml-10 flex items-center space-x-4">
                <Link href="/admin/dashboard">
                  <span className="text-gray-700 hover:text-blue-600 cursor-pointer">대시보드</span>
                </Link>
                <Link href="/admin/discover">
                  <span className="text-gray-700 hover:text-blue-600 cursor-pointer">영상 검색</span>
                </Link>
                <Link href="/admin/settings">
                  <span className="text-gray-700 hover:text-blue-600 cursor-pointer">설정</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Link href="/">
                <button className="px-4 py-2 text-sm text-gray-700 hover:text-blue-600">
                  🏠 사이트 보기
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <main className="py-6">
        {children}
      </main>
    </div>
  );
}
