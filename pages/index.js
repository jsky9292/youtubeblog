// pages/index.js
// 홈 페이지 - 포스트 목록

import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import { getPublishedPosts } from '../lib/db';

export default function Home({ posts }) {
  return (
    <Layout>
      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold text-center mb-4">
          🤖 AI 잡학박사
        </h1>
        <p className="text-center text-gray-600 mb-12">
          AI가 정리하는 다양한 분야의 잡학 지식을 만나보세요
        </p>

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              아직 포스트가 없습니다. 첫 포스트를 작성해보세요!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const posts = await getPublishedPosts(20, 0);

    return {
      props: {
        posts,
      },
      revalidate: 10, // 10초마다 재생성 (발행 후 빠른 반영)
    };
  } catch (error) {
    console.error('포스트 조회 실패:', error);
    return {
      props: {
        posts: [],
      },
      revalidate: 60,
    };
  }
}
