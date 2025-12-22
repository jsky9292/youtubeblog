// components/PostCard.js
// 토스 스타일 포스트 카드

import Link from 'next/link';

export default function PostCard({ post }) {
  const dateToShow = post.published_at || post.created_at || new Date().toISOString();
  const formattedDate = new Date(dateToShow).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link href={`/posts/${post.slug}`} className="block group">
      <article className="bg-white rounded-2xl overflow-hidden border hover:shadow-lg transition-all h-full">
        {/* 썸네일 */}
        <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 relative">
          {post.thumbnail_url ? (
            <img
              src={post.thumbnail_url}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">보</span>
              </div>
            </div>
          )}
        </div>

        {/* 컨텐츠 */}
        <div className="p-4">
          <h2 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors">
            {post.title}
          </h2>

          {post.meta_description && (
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
              {post.meta_description}
            </p>
          )}

          {/* 메타 */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{formattedDate}</span>
            <span>조회 {(post.view_count || 0).toLocaleString()}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
