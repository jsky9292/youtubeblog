// components/PostCard.js
// 포스트 카드 컴포넌트 - MZ 감각 디자인

import Link from 'next/link';

export default function PostCard({ post }) {
  // published_at이 null이면 created_at 사용, 둘 다 없으면 현재 날짜
  const dateToShow = post.published_at || post.created_at || new Date().toISOString();
  const formattedDate = new Date(dateToShow).toLocaleDateString(
    'ko-KR',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <Link href={`/posts/${post.slug}`} className="block">
      <article className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
        {/* 썸네일 이미지 */}
        {post.thumbnail_url && (
          <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 cursor-pointer">
            <img
              src={post.thumbnail_url}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 pointer-events-none"
            />
            {/* 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        )}

        {/* 컨텐츠 영역 */}
        <div className="p-6">
          {/* 제목 */}
          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors leading-tight">
            {post.title}
          </h2>

          {/* 설명 */}
          <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
            {post.meta_description}
          </p>

          {/* 하단 메타 정보 */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="font-medium">{post.view_count.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 읽기 버튼 (호버 시 표시) */}
        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
            읽기
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}
