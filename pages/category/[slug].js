// pages/category/[slug].js
// 카테고리별 포스트 목록 페이지

import Layout from '../../components/Layout';
import Link from 'next/link';

import { getCategoryBySlug, categories } from '../../lib/categories';

export default function CategoryPage({ posts, category, allCategories }) {
  return (
    <Layout
      title={`${category.name} - AI 잡학박사`}
      description={category.description}
    >
      <div className="container-custom py-8">
        {/* 카테고리 헤더 */}
        <div className="mb-8 text-center">
          <div className="text-5xl mb-4">{category.icon}</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
          <p className="text-gray-600">{category.description}</p>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {allCategories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.id === 'all' ? '/' : `/category/${cat.slug}`}
            >
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                  cat.id === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.icon} {cat.name}
              </span>
            </Link>
          ))}
        </div>

        {/* 포스트 목록 */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg">
              이 카테고리에 포스트가 없습니다.
            </p>
            <Link href="/">
              <button className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors">
                전체 글 보기
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.slug}`}>
                <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                  {/* 썸네일 */}
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 relative overflow-hidden">
                    {post.thumbnail_url ? (
                      <img
                        src={post.thumbnail_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl opacity-50">{category.icon}</span>
                      </div>
                    )}
                  </div>

                  {/* 콘텐츠 */}
                  <div className="p-5">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {post.meta_description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {new Date(post.published_at).toLocaleDateString('ko-KR')}
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">👁️</span>
                        {post.view_count || 0}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const { getPublishedPostsByCategory } = require("../../lib/db");
  const { slug } = params;
  const category = getCategoryBySlug(slug);

  if (!category || category.id === 'all') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  try {
    const posts = getPublishedPostsByCategory(category.id, 50, 0);

    return {
      props: {
        posts,
        category,
        allCategories: categories,
      },
    };
  } catch (error) {
    console.error('카테고리 페이지 데이터 조회 실패:', error);
    return {
      props: {
        posts: [],
        category,
        allCategories: categories,
      },
    };
  }
}
