// components/PostCard.js
// 보상닥터 스타일 포스트 카드

import Link from 'next/link';

export default function PostCard({ post }) {
  const dateToShow = post.published_at || post.created_at || new Date().toISOString();
  const formattedDate = new Date(dateToShow).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // 카테고리 라벨 매핑
  const categoryLabels = {
    traffic: { label: '교통사고', color: 'bg-blue-100 text-blue-800' },
    industrial: { label: '산재/근재', color: 'bg-green-100 text-green-800' },
    dispute: { label: '보험분쟁', color: 'bg-red-100 text-red-800' },
    liability: { label: '배상책임', color: 'bg-purple-100 text-purple-800' },
    medical: { label: '질병/상해', color: 'bg-orange-100 text-orange-800' },
    guide: { label: '가이드', color: 'bg-gray-100 text-gray-800' },
  };

  const category = categoryLabels[post.category] || categoryLabels.guide;

  return (
    <Link href={`/posts/${post.slug}`} className="block group">
      <article className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
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
              <div className="size-16 bg-primary rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-3xl">article</span>
              </div>
            </div>
          )}
          {/* 카테고리 배지 */}
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-bold px-2 py-1 rounded ${category.color}`}>
              {category.label}
            </span>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="p-5 flex flex-col flex-grow">
          <h2 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h2>

          {post.meta_description && (
            <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
              {post.meta_description}
            </p>
          )}

          {/* 메타 */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100 mt-auto">
            <span>{formattedDate}</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">visibility</span>
              {(post.view_count || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
