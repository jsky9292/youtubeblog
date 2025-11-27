// pages/adjuster.js
// 손해사정사 소개 페이지

import Layout from '../components/Layout';
import Link from 'next/link';

export default function AdjusterPage() {
  return (
    <Layout
      title="손해사정사란?"
      description="손해사정사가 하는 일과 보험금 청구에서의 역할을 알려드립니다."
      keywords="손해사정사, 손해사정, 보험금 청구, 보험 분쟁"
    >
      {/* 히어로 */}
      <section className="bg-gradient-to-b from-indigo-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium mb-4">
              손해사정
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              손해사정사란?
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              보험금 청구의 공정한 중재자,<br />
              피보험자의 권익을 보호하는 전문가입니다.
            </p>
          </div>
        </div>
      </section>

      {/* 손해사정사 정의 */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-sm border p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">손해사정사의 정의</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              손해사정사는 <strong className="text-gray-900">보험업법에 따라 등록된 공인 전문가</strong>로,
              보험사고 발생 시 손해액 및 보험금을 객관적으로 산정하는 역할을 합니다.
              보험회사 소속이 아닌 <strong className="text-gray-900">독립적인 손해사정사</strong>는
              피보험자(보험 가입자)의 편에서 정당한 보험금을 받을 수 있도록 도와드립니다.
            </p>
            <div className="bg-indigo-50 rounded-2xl p-4">
              <p className="text-indigo-700 text-sm">
                <strong>법적 근거:</strong> 보험업법 제185조에 따라 손해사정사는 공정하고 객관적인 손해사정을 수행합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 손해사정사가 하는 일 */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6">손해사정사가 하는 일</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: '손해액 산정',
                desc: '사고로 인한 실제 손해액을 객관적으로 평가합니다.',
                icon: '📊',
              },
              {
                title: '보험금 청구 대행',
                desc: '복잡한 서류 작성과 청구 절차를 대신 진행합니다.',
                icon: '📋',
              },
              {
                title: '보험 분쟁 조정',
                desc: '보험사와의 분쟁 발생 시 협상을 지원합니다.',
                icon: '⚖️',
              },
              {
                title: '의료 자문',
                desc: '상해 사고 시 적정 치료비와 후유장해를 평가합니다.',
                icon: '🏥',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border hover:shadow-md transition-all">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 왜 손해사정사가 필요한가? */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-8 text-white">
            <h2 className="text-xl font-bold mb-6">왜 손해사정사가 필요한가요?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold mb-1">70%</div>
                <p className="text-blue-100 text-sm">
                  보험금 청구 시 과소 지급되는 비율
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">2~3배</div>
                <p className="text-blue-100 text-sm">
                  전문가 도움 시 평균 증액 비율
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">무료</div>
                <p className="text-blue-100 text-sm">
                  상담 비용 (성공 보수제)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 손해사정 유형 */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6">손해사정 유형</h2>
          <div className="space-y-4">
            {[
              {
                type: '제1종 (재물손해)',
                desc: '화재, 자연재해, 도난 등 재산 피해',
                examples: '화재보험, 재산종합보험, 배상책임보험',
              },
              {
                type: '제2종 (차량손해)',
                desc: '자동차 사고로 인한 차량 및 대물 피해',
                examples: '자동차보험, 대물배상, 자차손해',
              },
              {
                type: '제3종 (신체손해)',
                desc: '사고나 질병으로 인한 신체 피해',
                examples: '실손보험, 상해보험, 생명보험',
              },
              {
                type: '제4종 (종합)',
                desc: '모든 종류의 손해를 포괄적으로 사정',
                examples: '복합 사고, 대형 재해',
              },
            ].map((item) => (
              <div key={item.type} className="bg-white rounded-2xl p-5 border">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.type}</h3>
                    <p className="text-sm text-gray-500 mb-2">{item.desc}</p>
                    <p className="text-xs text-gray-400">예: {item.examples}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6">자주 묻는 질문</h2>
          <div className="space-y-4">
            {[
              {
                q: '손해사정사 비용은 얼마인가요?',
                a: '대부분 성공 보수제로 운영됩니다. 보험금을 받지 못하면 비용이 발생하지 않습니다. 일반적으로 증액된 금액의 10~20% 정도입니다.',
              },
              {
                q: '보험회사 손해사정사와 뭐가 다른가요?',
                a: '보험회사 소속 손해사정사는 회사 이익을 위해 일하지만, 독립 손해사정사는 피보험자(고객)의 이익을 위해 일합니다.',
              },
              {
                q: '언제 손해사정사를 찾아야 하나요?',
                a: '보험금이 예상보다 적게 나왔을 때, 보험사에서 지급을 거절했을 때, 복잡한 사고로 청구가 어려울 때 도움을 받으실 수 있습니다.',
              },
              {
                q: '어떤 자료가 필요한가요?',
                a: '보험증권, 사고 관련 서류(진단서, 수리견적서 등), 보험사 안내문 등을 준비해 주시면 됩니다.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-lg border p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              보험금, 제대로 받고 계신가요?
            </h2>
            <p className="text-gray-500 mb-6">
              15년 경력의 손해사정사가 무료로 검토해드립니다
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact">
                <button className="px-6 py-3 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">
                  무료 상담 신청
                </button>
              </Link>
              <Link href="/quiz">
                <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors">
                  보험금 자가진단
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
