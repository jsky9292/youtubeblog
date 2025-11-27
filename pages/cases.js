// pages/cases.js
// 보험금 분쟁사례 페이지 - SEO 최적화

import Layout from '../components/Layout';
import Link from 'next/link';

const cases = [
  {
    id: 1,
    category: '자동차보험',
    categoryColor: 'bg-blue-100 text-blue-700',
    title: '교통사고 합의금 320만원 → 890만원',
    summary: '보험사 제시 합의금이 너무 낮아 손해사정사에 의뢰',
    situation: '추돌사고로 목, 허리 통증. 보험사에서 320만원 제시',
    problem: '치료비만 계산하고 향후 치료비, 위자료 미반영',
    solution: '후유장해 가능성 검토, 추가 치료 필요성 입증',
    result: '890만원 합의 (2.8배 증액)',
    period: '약 3주',
    icon: '🚗'
  },
  {
    id: 2,
    category: '실손보험',
    categoryColor: 'bg-green-100 text-green-700',
    title: '도수치료비 청구 거절 → 전액 지급',
    summary: '필요한 치료인데 보험사에서 과잉진료라며 거절',
    situation: '허리디스크로 도수치료 20회. 보험사 "과잉진료" 주장',
    problem: '의료자문 결과 "필요 이상 치료"라는 의견서 제출',
    solution: '주치의 소견서, 영상자료로 치료 필요성 재입증',
    result: '거절 철회, 180만원 전액 지급',
    period: '약 2주',
    icon: '🏥'
  },
  {
    id: 3,
    category: '암보험',
    categoryColor: 'bg-purple-100 text-purple-700',
    title: '갑상선암 진단비 50% → 100% 지급',
    summary: '소액암으로 분류되어 진단비 50%만 지급받음',
    situation: '갑상선암 진단, 보험사에서 소액암으로 50%만 지급',
    problem: '약관상 "소액암" 정의와 실제 진단 불일치',
    solution: '병리검사 결과 재검토, 약관 해석 이의제기',
    result: '일반암 인정, 나머지 50% 추가 지급',
    period: '약 4주',
    icon: '🎗️'
  },
  {
    id: 4,
    category: '상해보험',
    categoryColor: 'bg-orange-100 text-orange-700',
    title: '골절 후유장해 미인정 → 14급 인정',
    summary: '완치 판정 받았지만 통증 지속, 후유장해 인정받음',
    situation: '발목 골절 후 치료 종결. 하지만 계속 통증과 불편함',
    problem: '보험사 "완치되었으므로 후유장해 없음" 주장',
    solution: '추가 검사로 관절 기능 제한 객관적 입증',
    result: '14급 후유장해 인정, 500만원 추가 수령',
    period: '약 6주',
    icon: '🦴'
  },
  {
    id: 5,
    category: '생명보험',
    categoryColor: 'bg-red-100 text-red-700',
    title: '수술비 지급 거절 → 지급 결정',
    summary: '시술인지 수술인지 애매해서 거절당함',
    situation: '내시경 용종 제거. "시술이라 수술비 해당 안됨" 거절',
    problem: '약관상 수술 정의 해석 문제',
    solution: '의료법상 수술 분류 기준 제시, 판례 인용',
    result: '수술로 인정, 100만원 지급',
    period: '약 2주',
    icon: '💉'
  },
];

const stats = [
  { label: '평균 증액률', value: '2.3배', desc: '원래 제시금액 대비' },
  { label: '성공률', value: '92%', desc: '2024년 기준' },
  { label: '평균 소요기간', value: '3주', desc: '접수~지급 완료' },
];

export default function CasesPage() {
  return (
    <Layout
      title="보험금 분쟁사례"
      description="실제 보험금 청구 분쟁 해결 사례. 거절당한 보험금, 과소 지급된 보험금을 어떻게 해결했는지 확인하세요."
      keywords="보험금 분쟁, 보험금 거절, 보험금 청구 사례, 손해사정, 실손보험 거절"
    >
      {/* 히어로 */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-16 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            보험금, 이렇게 받았습니다
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            거절당하거나 적게 받은 보험금,<br />
            손해사정사와 함께 해결한 실제 사례
          </p>

          {/* 통계 */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-400">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 사례 목록 */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6">
            {cases.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all">
                {/* 헤더 */}
                <div className="p-6 pb-4">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{item.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.categoryColor}`}>
                          {item.category}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h2>
                      <p className="text-sm text-gray-500">{item.summary}</p>
                    </div>
                  </div>
                </div>

                {/* 상세 내용 */}
                <div className="px-6 pb-6">
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-16 text-xs font-medium text-gray-500">상황</div>
                      <div className="text-sm text-gray-700">{item.situation}</div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-16 text-xs font-medium text-gray-500">문제점</div>
                      <div className="text-sm text-gray-700">{item.problem}</div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-16 text-xs font-medium text-gray-500">해결방법</div>
                      <div className="text-sm text-gray-700">{item.solution}</div>
                    </div>
                    <div className="flex gap-3 pt-2 border-t">
                      <div className="flex-shrink-0 w-16 text-xs font-medium text-blue-600">결과</div>
                      <div className="text-sm font-medium text-blue-600">{item.result}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-right">
                    <span className="text-xs text-gray-400">소요기간: {item.period}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 자주 있는 분쟁 유형 */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">자주 있는 분쟁 유형</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { type: '보험금 과소지급', desc: '보험사가 일부만 인정하고 나머지는 미지급', percent: '38%' },
              { type: '청구 거절', desc: '약관 해석, 고지의무 위반 등을 이유로 거절', percent: '27%' },
              { type: '후유장해 미인정', desc: '장해등급 낮게 책정 또는 미인정', percent: '21%' },
              { type: '의료자문 악용', desc: '보험사측 의료자문으로 치료 필요성 부정', percent: '14%' },
            ].map((item) => (
              <div key={item.type} className="bg-white rounded-xl p-5 border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{item.type}</span>
                  <span className="text-sm font-bold text-blue-500">{item.percent}</span>
                </div>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-blue-500 rounded-3xl p-8 text-center text-white">
            <h2 className="text-xl font-bold mb-2">
              비슷한 상황이신가요?
            </h2>
            <p className="text-blue-100 mb-6">
              거절당했거나, 금액이 적다면 무료로 검토해드립니다
            </p>
            <Link href="/contact">
              <button className="px-8 py-4 bg-white text-blue-500 rounded-2xl font-medium hover:bg-blue-50 transition-colors text-lg">
                무료 상담 신청
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 손해사정사 소개 링크 */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/adjuster">
            <div className="bg-gray-100 rounded-2xl p-5 hover:bg-gray-200 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">손해사정사가 뭔가요?</div>
                  <div className="text-sm text-gray-500">손해사정사의 역할과 도움받는 방법 알아보기</div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
