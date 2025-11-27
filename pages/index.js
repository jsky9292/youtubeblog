// pages/index.js
// 토스 스타일 메인 홈페이지

import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import Link from 'next/link';
import { getPublishedPosts } from '../lib/db';

export default function Home({ posts }) {
  return (
    <Layout>
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              보험사가 알려주지 않는<br />
              <span className="text-blue-500">보험금 청구의 모든 것</span>
            </h1>
            <p className="text-gray-500 text-lg mb-8">
              손해사정사가 직접 알려드립니다
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact">
                <button className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">
                  무료 상담 신청
                </button>
              </Link>
              <Link href="/quiz">
                <button className="w-full sm:w-auto px-6 py-3 bg-white text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-colors border">
                  보험금 자가진단
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 신뢰 지표 */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-sm border p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-500">500+</div>
                <div className="text-sm text-gray-500 mt-1">상담 사례</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">92%</div>
                <div className="text-sm text-gray-500 mt-1">청구 성공률</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">15년</div>
                <div className="text-sm text-gray-500 mt-1">업계 경력</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">24h</div>
                <div className="text-sm text-gray-500 mt-1">빠른 응답</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 카테고리 */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">어떤 보험이 궁금하세요?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: '분쟁사례', desc: '이렇게 해결했어요', href: '/cases', color: 'bg-red-50 text-red-600' },
              { name: '자동차보험', desc: '사고 합의금', href: '/category/auto', color: 'bg-blue-50 text-blue-600' },
              { name: '실손보험', desc: '의료비 청구', href: '/category/health', color: 'bg-green-50 text-green-600' },
              { name: '생명보험', desc: '진단비, 수술비', href: '/category/life', color: 'bg-purple-50 text-purple-600' },
            ].map((cat) => (
              <Link key={cat.name} href={cat.href}>
                <div className="bg-white rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer border h-full">
                  <div className={`inline-block px-2 py-1 rounded-lg text-xs font-medium mb-2 ${cat.color}`}>
                    {cat.name}
                  </div>
                  <div className="text-sm text-gray-500">{cat.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 최신 포스트 */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">최신 보험 정보</h2>
            <Link href="/category/all" className="text-sm text-blue-500 hover:text-blue-600">
              전체 보기
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <p className="text-gray-500">아직 포스트가 없습니다</p>
              <p className="text-gray-400 text-sm mt-1">곧 유용한 정보로 찾아뵙겠습니다</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 광고 배너 */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="bg-gray-100 rounded-2xl p-4 text-center text-gray-400 text-sm">
          <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="XXXXXXXXXX"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
        </div>
      </div>

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-blue-500 rounded-3xl p-8 text-center text-white">
            <h2 className="text-xl font-bold mb-2">
              보험금 청구, 혼자 고민하지 마세요
            </h2>
            <p className="text-blue-100 mb-6 text-sm">
              손해사정사가 무료로 검토해드립니다
            </p>
            <Link href="/contact">
              <button className="px-6 py-3 bg-white text-blue-500 rounded-2xl font-medium hover:bg-blue-50 transition-colors">
                무료 상담 신청하기
              </button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const posts = await getPublishedPosts(6, 0);
    return {
      props: { posts },
      revalidate: 60,
    };
  } catch (error) {
    console.error('포스트 조회 실패:', error);
    return {
      props: { posts: [] },
      revalidate: 60,
    };
  }
}
