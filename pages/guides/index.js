// pages/guides/index.js
// 보험 가이드 인덱스 페이지

import Layout from '../../components/Layout';
import Link from 'next/link';

const guides = [
  {
    slug: 'car-accident',
    title: '교통사고 합의금 완벽 가이드',
    description: '합의금 계산법부터 협상 전략까지. 보험사에게 제대로 된 보상을 받는 방법을 알려드립니다.',
    category: '자동차보험',
    categoryColor: 'bg-blue-100 text-blue-700',
    icon: '🚗',
    readTime: '15분',
    keywords: ['교통사고 합의금', '합의금 계산', '위자료'],
  },
  {
    slug: 'silson-insurance',
    title: '실손보험 청구 완벽 가이드',
    description: '실손보험 청구 방법부터 필요 서류, 실손24 앱 사용법까지. 병원비 환급받는 모든 방법을 알려드립니다.',
    category: '실손보험',
    categoryColor: 'bg-green-100 text-green-700',
    icon: '🏥',
    readTime: '15분',
    keywords: ['실손보험 청구', '실손24', '의료비 환급'],
  },
  {
    slug: 'cancer-insurance',
    title: '암 진단비 청구 완벽 가이드',
    description: '암 진단 후 받을 수 있는 모든 보험금과 청구 방법. 일반암, 유사암, 소액암 분류까지 총정리.',
    category: '생명보험',
    categoryColor: 'bg-purple-100 text-purple-700',
    icon: '💜',
    readTime: '12분',
    keywords: ['암 진단비', '암보험 청구', '유사암'],
  },
  {
    slug: 'claim-rejection',
    title: '보험금 거절 대응 가이드',
    description: '보험금이 거절되었나요? 거절 사유별 대응 방법과 이의제기 절차를 단계별로 안내합니다.',
    category: '보험금 청구',
    categoryColor: 'bg-red-100 text-red-700',
    icon: '⚠️',
    readTime: '12분',
    keywords: ['보험금 거절', '이의신청', '분쟁조정'],
  },
];

const upcomingGuides = [
  {
    title: '후유장해 보험금 가이드',
    description: '후유장해 등급 판정과 보험금 청구 방법',
    category: '상해보험',
    categoryColor: 'bg-orange-100 text-orange-700',
  },
  {
    title: '산재보험 청구 가이드',
    description: '업무 중 사고시 산재보험 청구 방법',
    category: '산재보험',
    categoryColor: 'bg-teal-100 text-teal-700',
  },
  {
    title: '사망보험금 청구 가이드',
    description: '유가족을 위한 사망보험금 청구 안내',
    category: '생명보험',
    categoryColor: 'bg-gray-100 text-gray-700',
  },
];

export default function GuidesIndex() {
  return (
    <Layout
      title="보험 가이드"
      description="보험금 청구부터 거절 대응까지. 손해사정사가 알려주는 보험 가이드 모음입니다."
      keywords="보험 가이드, 보험금 청구 방법, 실손보험, 보험금 거절"
    >
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            보험 가이드
          </h1>
          <p className="text-gray-500 text-lg">
            손해사정사가 직접 작성한 보험금 청구 가이드입니다
          </p>
        </div>

        {/* 가이드 목록 */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            전체 가이드
          </h2>
          <div className="grid gap-6">
            {guides.map((guide) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}`}>
                <div className="bg-white rounded-2xl border p-6 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer">
                  <div className="flex gap-4">
                    <div className="text-4xl">{guide.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${guide.categoryColor}`}>
                          {guide.category}
                        </span>
                        <span className="text-xs text-gray-400">
                          읽는 시간 {guide.readTime}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                        {guide.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-3">
                        {guide.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {guide.keywords.map((keyword, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 준비 중인 가이드 */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            준비 중인 가이드
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {upcomingGuides.map((guide, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-5 border border-dashed border-gray-200">
                <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium mb-3 ${guide.categoryColor}`}>
                  {guide.category}
                </span>
                <h3 className="font-medium text-gray-700 mb-1">
                  {guide.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {guide.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 빠른 도구 */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            바로 사용하기
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/calculator">
              <div className="bg-blue-50 rounded-2xl p-6 hover:bg-blue-100 transition-colors cursor-pointer">
                <div className="text-3xl mb-3">🧮</div>
                <h3 className="font-bold text-blue-900 mb-1">합의금 계산기</h3>
                <p className="text-sm text-blue-600">
                  교통사고 합의금을 미리 계산해보세요
                </p>
              </div>
            </Link>
            <Link href="/quiz">
              <div className="bg-purple-50 rounded-2xl p-6 hover:bg-purple-100 transition-colors cursor-pointer">
                <div className="text-3xl mb-3">📋</div>
                <h3 className="font-bold text-purple-900 mb-1">보험금 자가진단</h3>
                <p className="text-sm text-purple-600">
                  내 보험금, 제대로 받고 있는지 확인하세요
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-center text-white">
            <h2 className="text-xl font-bold mb-2">
              가이드를 읽어도 어려우신가요?
            </h2>
            <p className="text-blue-100 mb-6 text-sm">
              손해사정사가 직접 상담해드립니다
            </p>
            <Link href="/contact">
              <button className="px-6 py-3 bg-white text-blue-600 rounded-2xl font-medium hover:bg-blue-50 transition-colors">
                무료 상담 신청하기
              </button>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
