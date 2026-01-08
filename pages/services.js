// pages/services.js
// 서비스 안내 페이지

import Layout from '../components/Layout';
import Link from 'next/link';

export default function Services() {
  const services = [
    {
      icon: 'directions_car',
      title: '교통사고 보상',
      desc: '교통사고 발생 시 피해자의 정당한 보상을 받을 수 있도록 전문적으로 지원합니다.',
      details: [
        '과실 비율 산정 및 분석',
        '보험사 대응 및 협상',
        '합의금 산정 및 청구',
        '후유장해 평가 지원',
        '자동차보험 분쟁 조정',
      ],
      color: 'blue',
    },
    {
      icon: 'engineering',
      title: '산재 / 근재 보험',
      desc: '산업재해 및 근로자 재해 보상에 대한 전문적인 손해사정 서비스를 제공합니다.',
      details: [
        '산재보험 승인 신청 대행',
        '불승인 산재 재심사 청구',
        '휴업급여, 장해급여 청구',
        '유족급여 청구 지원',
        '근로복지공단 대응',
      ],
      color: 'green',
    },
    {
      icon: 'gavel',
      title: '보험 분쟁 해결',
      desc: '보험금 지급 거절, 감액 등 억울한 상황에서 고객의 권리를 찾아드립니다.',
      details: [
        '암 진단비 분쟁',
        '후유장해 등급 분쟁',
        '실손의료비 분쟁',
        '사망보험금 분쟁',
        '고지의무 위반 대응',
      ],
      color: 'red',
    },
    {
      icon: 'handshake',
      title: '배상책임 보험',
      desc: '다양한 배상책임 사고에 대해 적정한 보상을 받을 수 있도록 도와드립니다.',
      details: [
        '일상생활 배상책임',
        '영업배상 책임',
        '시설물 사고 배상',
        '의료과실 배상',
        '제조물 책임',
      ],
      color: 'purple',
    },
  ];

  const process = [
    { step: '01', title: '무료 상담', desc: '전화 또는 온라인으로 상담 신청' },
    { step: '02', title: '사건 분석', desc: '전문가가 사건 내용 상세 분석' },
    { step: '03', title: '전략 수립', desc: '최적의 보상 전략 수립' },
    { step: '04', title: '청구 대행', desc: '보험사 대응 및 청구 진행' },
    { step: '05', title: '결과 안내', desc: '보상금 수령 및 결과 안내' },
  ];

  return (
    <Layout
      title="서비스 안내"
      description="보험을 담다의 전문 손해사정 서비스를 안내합니다. 교통사고, 산재, 보험분쟁, 배상책임 전문."
    >
      {/* 히어로 섹션 */}
      <section className="w-full bg-white py-16">
        <div className="flex justify-center">
          <div className="w-full max-w-[1280px] px-4 md:px-10 text-center">
            <h2 className="text-primary font-bold text-sm tracking-wide uppercase mb-4">서비스 안내</h2>
            <h1 className="text-gray-900 text-3xl md:text-5xl font-bold leading-tight mb-6">
              전문 손해사정 서비스
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
              보험을 담다는 고객의 정당한 권리를 찾아드리기 위해<br className="hidden sm:block" />
              다양한 분야의 전문 손해사정 서비스를 제공합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 서비스 상세 */}
      <section className="w-full bg-background-light py-16">
        <div className="flex justify-center">
          <div className="w-full max-w-[1280px] px-4 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="size-14 rounded-lg bg-blue-50 flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                    </div>
                    <div>
                      <h2 className="text-gray-900 text-xl font-bold mb-2">{service.title}</h2>
                      <p className="text-gray-500 text-sm">{service.desc}</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {service.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-gray-700">
                        <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 진행 과정 */}
      <section className="w-full bg-white py-16 border-t border-gray-100">
        <div className="flex justify-center">
          <div className="w-full max-w-[1280px] px-4 md:px-10">
            <div className="text-center mb-12">
              <h2 className="text-gray-900 text-3xl font-bold mb-4">서비스 진행 과정</h2>
              <p className="text-gray-500">체계적인 5단계 프로세스로 진행됩니다</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {process.map((item, idx) => (
                <div key={item.step} className="text-center">
                  <div className="size-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                  {idx < process.length - 1 && (
                    <div className="hidden md:block absolute right-0 top-8 text-gray-300">
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-background-light py-12">
        <div className="flex justify-center">
          <div className="w-full max-w-[1280px] px-4 md:px-10">
            <div className="bg-primary rounded-xl p-8 md:p-12 text-white text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                무료 상담을 신청하세요
              </h2>
              <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                보험 문제로 고민하고 계신가요? 전문 손해사정사가 무료로 상담해 드립니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center h-12 px-8 bg-white text-primary rounded-lg font-bold hover:bg-gray-100 transition-colors"
                >
                  온라인 상담 신청
                </Link>
                <a
                  href="tel:1588-0000"
                  className="inline-flex items-center justify-center h-12 px-8 bg-white/10 text-white rounded-lg font-medium border border-white/30 hover:bg-white/20 transition-colors"
                >
                  <span className="material-symbols-outlined mr-2">call</span>
                  1588-0000
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
