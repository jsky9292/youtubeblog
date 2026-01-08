// pages/index.js
// 보상닥터 스타일 메인 홈페이지 (보험을 담다)

import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import Link from 'next/link';
import { getPublishedPosts } from '../lib/db';

export default function Home({ posts }) {
  // 서비스 카드 데이터
  const services = [
    {
      icon: 'directions_car',
      title: '교통사고',
      desc: '복잡한 과실 비율 산정과 보험사 대응, 합의 대행까지 전문적으로 처리합니다.',
      color: 'blue',
    },
    {
      icon: 'engineering',
      title: '산재 / 근재',
      desc: '산업 재해 승인 신청 및 근로자 재해 보상 청구를 도와드립니다.',
      color: 'green',
    },
    {
      icon: 'gavel',
      title: '보험 분쟁',
      desc: '암 진단비, 후유장해, 실손의료비 등 억울한 보험금 부지급 분쟁 해결.',
      color: 'red',
    },
    {
      icon: 'handshake',
      title: '배상 책임',
      desc: '일상생활 배상책임, 영업배상, 시설물 사고 등 다양한 책임 사고 처리.',
      color: 'purple',
    },
  ];

  return (
    <Layout>
      {/* 히어로 섹션 */}
      <section className="w-full bg-white pb-8">
        <div className="flex justify-center">
          <div className="w-full max-w-[1280px] px-4 md:px-10 py-5">
            <div className="rounded-2xl overflow-hidden relative">
              <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.7) 100%), url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600')`,
                }}
              />
              <div className="relative z-10 flex min-h-[480px] md:min-h-[560px] flex-col gap-8 items-center justify-center px-4 py-20 text-center">
                <div className="flex flex-col gap-4 max-w-3xl">
                  <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 w-fit mx-auto">
                    <span className="size-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-white text-xs font-medium">손해사정 전문 상담 운영 중</span>
                  </div>
                  <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-black leading-[1.15] tracking-tight">
                    보험사가 알려주지 않는<br />
                    <span className="text-blue-400">보험금 청구의 모든 것</span>
                  </h1>
                  <p className="text-gray-200 text-base md:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
                    손해사정사가 직접 알려드립니다.<br className="hidden sm:block" />
                    복잡한 보험 문제, 혼자 고민하지 말고 전문가와 상의하세요.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Link
                    href="/contact"
                    className="flex items-center justify-center h-12 px-8 bg-primary hover:bg-blue-600 text-white rounded-lg text-base font-bold transition-all shadow-lg hover:shadow-blue-500/30 w-full sm:w-auto"
                  >
                    무료 상담 신청하기
                  </Link>
                  <Link
                    href="/services"
                    className="flex items-center justify-center h-12 px-8 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg text-base font-medium transition-all w-full sm:w-auto"
                  >
                    서비스 안내 보기
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="w-full bg-white border-b border-gray-100">
        <div className="flex justify-center">
          <div className="w-full max-w-[1280px] px-4 md:px-10 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col gap-2 p-4 text-center md:text-left">
                <p className="text-gray-500 text-sm font-medium">누적 상담 건수</p>
                <p className="text-gray-900 text-3xl font-bold tracking-tight">5,000+</p>
              </div>
              <div className="flex flex-col gap-2 p-4 text-center md:text-left border-l border-gray-100">
                <p className="text-gray-500 text-sm font-medium">성공 사례</p>
                <p className="text-gray-900 text-3xl font-bold tracking-tight">1,200+</p>
              </div>
              <div className="flex flex-col gap-2 p-4 text-center md:text-left border-l border-gray-100">
                <p className="text-gray-500 text-sm font-medium">업계 경력</p>
                <p className="text-gray-900 text-3xl font-bold tracking-tight">15년+</p>
              </div>
              <div className="flex flex-col gap-2 p-4 text-center md:text-left border-l border-gray-100">
                <p className="text-gray-500 text-sm font-medium">고객 만족도</p>
                <p className="text-primary text-3xl font-bold tracking-tight">98%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 전문 서비스 섹션 */}
      <section className="w-full bg-background-light py-16">
        <div className="flex justify-center">
          <div className="w-full max-w-[1280px] px-4 md:px-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="flex flex-col gap-3 max-w-2xl">
                <h2 className="text-primary font-bold text-sm tracking-wide uppercase">전문 분야</h2>
                <h1 className="text-gray-900 text-3xl md:text-4xl font-bold leading-tight">
                  전문 서비스 분야
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  보험을 담다는 다양한 분야의 전문 지식으로<br className="hidden sm:block" />
                  고객님의 잃어버린 권리를 찾아드립니다.
                </p>
              </div>
              <Link
                className="hidden md:flex items-center gap-1 text-primary font-bold hover:gap-2 transition-all"
                href="/services"
              >
                전체 서비스 보기 <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="group flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="size-12 rounded-lg bg-blue-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-gray-900 text-xl font-bold">{service.title}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <Link
                      href="/services"
                      className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all"
                    >
                      자세히 보기 <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="md:hidden mt-8 text-center">
              <Link
                className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-white border border-gray-300 text-gray-700 text-sm font-medium shadow-sm w-full"
                href="/services"
              >
                전체 서비스 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 최신 블로그 포스트 */}
      <section className="w-full bg-white py-16 border-t border-gray-100">
        <div className="flex justify-center">
          <div className="w-full max-w-[1280px] px-4 md:px-10">
            <div className="flex flex-col gap-2 mb-10 text-center">
              <h2 className="text-gray-900 text-3xl font-bold leading-tight">최신 보험 정보</h2>
              <p className="text-gray-500">손해사정 전문가가 알려주는 실전 보험 지식</p>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-16 bg-background-light rounded-xl">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">article</span>
                <p className="text-gray-500">아직 포스트가 없습니다</p>
                <p className="text-gray-400 text-sm mt-1">곧 유용한 정보로 찾아뵙겠습니다</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}

            <div className="mt-8 text-center">
              <Link
                href="/category/all"
                className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                전체 글 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="w-full bg-background-light py-12">
        <div className="flex justify-center">
          <div className="w-full max-w-[1280px] px-4 md:px-10">
            <div className="w-full bg-primary rounded-xl p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-white/10">
                <span className="material-symbols-outlined text-[150px]">support_agent</span>
              </div>
              <div className="relative z-10 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">무료 상담 안내</h3>
                <p className="text-blue-100 text-sm mb-4">
                  혼자 고민하지 마세요. 전문가가 직접 상담해 드립니다.
                </p>
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <span className="material-symbols-outlined text-3xl">phone_in_talk</span>
                  <div>
                    <p className="text-xs text-blue-200">대표 전화</p>
                    <p className="text-2xl font-bold tracking-wider">1588-0000</p>
                  </div>
                </div>
                <p className="text-xs text-blue-200">평일 09:00 - 18:00 (주말/공휴일 휴무)</p>
              </div>
              <Link
                href="/contact"
                className="relative z-10 bg-white text-primary font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors shadow-lg text-center"
              >
                온라인 상담 신청하기
              </Link>
            </div>
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
