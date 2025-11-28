// pages/guides/car-accident.js
// 교통사고 합의금 완벽 가이드 - SEO 최적화

import Layout from '../../components/Layout';
import Link from 'next/link';

export default function CarAccidentGuide() {
  const sections = [
    { id: 'intro', title: '교통사고 합의금이란?' },
    { id: 'components', title: '합의금 구성 항목' },
    { id: 'calculation', title: '합의금 계산 방법' },
    { id: 'negotiation', title: '합의금 협상 전략' },
    { id: 'mistakes', title: '흔한 실수와 주의사항' },
    { id: 'timeline', title: '합의 진행 시기' },
    { id: 'expert', title: '전문가 도움이 필요한 경우' },
  ];

  return (
    <Layout
      title="교통사고 합의금 완벽 가이드 2024"
      description="교통사고 합의금 계산법부터 협상 전략까지. 보험사에게 제대로 된 보상을 받는 방법을 손해사정사가 알려드립니다."
      keywords="교통사고 합의금, 자동차사고 합의금, 합의금 계산, 합의금 협상, 위자료"
    >
      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* 헤더 */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/guides" className="text-blue-500 hover:text-blue-600 text-sm">
              가이드
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500 text-sm">자동차보험</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            교통사고 합의금 완벽 가이드
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            합의금 계산법부터 협상 전략까지, 제대로 된 보상을 받는 방법을 알려드립니다.
          </p>
          <div className="flex items-center gap-4 mt-6 text-sm text-gray-400">
            <span>2024년 기준</span>
            <span>|</span>
            <span>읽는 시간 15분</span>
          </div>
        </header>

        {/* 바로가기 */}
        <div className="bg-blue-50 rounded-2xl p-5 mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="font-medium text-blue-900 mb-1">내 합의금 미리 계산해보기</div>
              <div className="text-sm text-blue-600">예상 합의금을 1분 만에 확인하세요</div>
            </div>
            <Link href="/calculator">
              <button className="px-5 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors">
                합의금 계산기
              </button>
            </Link>
          </div>
        </div>

        {/* 목차 */}
        <nav className="bg-gray-50 rounded-2xl p-5 mb-10">
          <h2 className="font-medium text-gray-900 mb-3">목차</h2>
          <ol className="space-y-2">
            {sections.map((section, idx) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-sm text-gray-600 hover:text-blue-500 flex items-center gap-2"
                >
                  <span className="w-5 h-5 bg-gray-200 rounded text-xs flex items-center justify-center text-gray-500">
                    {idx + 1}
                  </span>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* 본문 */}
        <div className="prose max-w-none">
          {/* 섹션 1 */}
          <section id="intro" className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm">1</span>
              교통사고 합의금이란?
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                <strong>교통사고 합의금</strong>은 사고로 인한 모든 손해를 금전으로 보상받는 것입니다.
                단순히 치료비만 받는 것이 아니라, 정신적 피해에 대한 위자료, 일하지 못한 기간의 휴업손해 등
                다양한 항목이 포함됩니다.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>핵심 포인트:</strong> 보험사가 먼저 제시하는 합의금은 대부분 최소 금액입니다.
                  협상을 통해 더 받을 수 있는 경우가 많습니다.
                </p>
              </div>
            </div>
          </section>

          {/* 섹션 2 */}
          <section id="components" className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm">2</span>
              합의금 구성 항목
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>교통사고 합의금은 크게 <strong>4가지 항목</strong>으로 구성됩니다.</p>

              <div className="grid gap-4">
                <div className="bg-white border rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 mb-2">1. 치료비 (적극적 손해)</h3>
                  <ul className="text-sm space-y-1 text-gray-500">
                    <li>- 병원비, 약값, 검사비</li>
                    <li>- 향후 치료비 (추가 치료 예정시)</li>
                    <li>- 보조기구 비용 (목발, 휠체어 등)</li>
                    <li>- 간병비 (필요한 경우)</li>
                  </ul>
                </div>

                <div className="bg-white border rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 mb-2">2. 위자료 (정신적 손해)</h3>
                  <ul className="text-sm space-y-1 text-gray-500">
                    <li>- 입원 위자료: 입원일수 × 일당</li>
                    <li>- 통원 위자료: 통원일수 × 일당</li>
                    <li>- 상해등급에 따른 추가 위자료</li>
                  </ul>
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">
                      <strong>2024년 기준 위자료 일당:</strong><br/>
                      입원 4~8만원 / 통원 2~4만원 (상해 정도에 따라 차등)
                    </p>
                  </div>
                </div>

                <div className="bg-white border rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 mb-2">3. 휴업손해 (일실수익)</h3>
                  <ul className="text-sm space-y-1 text-gray-500">
                    <li>- 일하지 못한 기간의 소득 손실</li>
                    <li>- 직장인: 실제 급여 기준</li>
                    <li>- 자영업자: 소득금액증명서 기준</li>
                    <li>- 주부/무직: 일용노임 기준</li>
                  </ul>
                </div>

                <div className="bg-white border rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 mb-2">4. 기타 비용</h3>
                  <ul className="text-sm space-y-1 text-gray-500">
                    <li>- 교통비 (병원 왕복 비용)</li>
                    <li>- 차량 수리비 / 렌트비</li>
                    <li>- 기타 실비 지출</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 섹션 3 */}
          <section id="calculation" className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm">3</span>
              합의금 계산 방법
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                합의금은 각 항목을 더한 후, <strong>과실 비율</strong>을 적용하여 최종 금액이 결정됩니다.
              </p>

              <div className="bg-gray-900 text-white rounded-xl p-5">
                <p className="text-sm text-gray-400 mb-2">합의금 계산 공식</p>
                <p className="text-lg font-mono">
                  (치료비 + 위자료 + 휴업손해) × (1 - 과실비율)
                </p>
              </div>

              <div className="bg-white border rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">예시: 경추 염좌 (2주 입원)</h3>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 text-gray-500">치료비</td>
                      <td className="py-2 text-right">1,200,000원</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-500">입원 위자료 (14일 × 6만원)</td>
                      <td className="py-2 text-right">840,000원</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-500">휴업손해 (14일)</td>
                      <td className="py-2 text-right">1,500,000원</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">소계</td>
                      <td className="py-2 text-right font-medium">3,540,000원</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-500">과실비율 (본인 20%)</td>
                      <td className="py-2 text-right text-red-500">-708,000원</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold text-blue-600">최종 합의금</td>
                      <td className="py-2 text-right font-bold text-blue-600">2,832,000원</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 rounded-xl p-5">
                <p className="text-sm text-blue-800">
                  <strong>정확한 계산이 필요하시면?</strong><br/>
                  합의금 계산기로 내 상황에 맞는 예상 금액을 확인해보세요.
                </p>
                <Link href="/calculator">
                  <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">
                    합의금 계산하기
                  </button>
                </Link>
              </div>
            </div>
          </section>

          {/* 섹션 4 */}
          <section id="negotiation" className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm">4</span>
              합의금 협상 전략
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                보험사 담당자는 회사 이익을 위해 최소 금액으로 합의하려 합니다.
                다음 전략을 활용하면 더 나은 결과를 얻을 수 있습니다.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">첫 제안 바로 수락하지 않기</h3>
                    <p className="text-sm text-gray-500">
                      보험사의 첫 제안은 협상 시작점입니다. 대부분 20~40% 낮게 제시됩니다.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">모든 서류 꼼꼼히 준비</h3>
                    <p className="text-sm text-gray-500">
                      진단서, 소견서, 소득증빙서류 등 객관적 자료를 확보하세요.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">과실비율 확인하기</h3>
                    <p className="text-sm text-gray-500">
                      보험사가 주장하는 과실비율이 적정한지 검토하세요.
                      블랙박스, 목격자 등으로 유리한 증거를 확보하면 좋습니다.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">서면으로 기록 남기기</h3>
                    <p className="text-sm text-gray-500">
                      전화 통화 내용을 정리하고, 중요한 내용은 문자나 이메일로 확인받으세요.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">5</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">조급해하지 않기</h3>
                    <p className="text-sm text-gray-500">
                      합의 시효는 사고일로부터 3년입니다. 치료가 끝난 후 협상해도 늦지 않습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 섹션 5 */}
          <section id="mistakes" className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm">5</span>
              흔한 실수와 주의사항
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <div className="grid gap-4">
                <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                  <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                    <span>X</span> 치료 중 급하게 합의
                  </h3>
                  <p className="text-sm text-red-700">
                    치료가 끝나기 전에 합의하면 추가 치료비를 받기 어렵습니다.
                    후유증이 생겨도 보상받을 수 없습니다.
                  </p>
                </div>

                <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                  <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                    <span>X</span> 구두 합의만 하기
                  </h3>
                  <p className="text-sm text-red-700">
                    반드시 서면 합의서를 작성하세요.
                    합의금 금액, 지급 시기, 포함 항목을 명확히 기재해야 합니다.
                  </p>
                </div>

                <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                  <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                    <span>X</span> 자차보험만 생각하기
                  </h3>
                  <p className="text-sm text-red-700">
                    자동차보험 외에도 실손보험, 상해보험 등에서 추가 보상받을 수 있습니다.
                    가입한 보험을 모두 확인하세요.
                  </p>
                </div>

                <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                  <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                    <span>X</span> 과실비율 무조건 인정
                  </h3>
                  <p className="text-sm text-red-700">
                    보험사가 제시하는 과실비율이 항상 맞는 것은 아닙니다.
                    판례를 검토하면 유리하게 바꿀 수 있는 경우도 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 섹션 6 */}
          <section id="timeline" className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm">6</span>
              합의 진행 시기
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>합의는 <strong>치료가 완전히 끝난 후</strong>에 하는 것이 가장 좋습니다.</p>

              <div className="bg-white border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-500 font-medium">상황</th>
                      <th className="px-4 py-3 text-left text-gray-500 font-medium">권장 시기</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-3">경미한 부상 (타박상, 경미 염좌)</td>
                      <td className="px-4 py-3">치료 종료 후 1~2주</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3">일반 부상 (골절, 인대손상)</td>
                      <td className="px-4 py-3">치료 종료 후 1~3개월</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3">중상해 (수술, 장기치료)</td>
                      <td className="px-4 py-3">후유장해 판정 후</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>주의:</strong> 합의 청구 시효는 사고일로부터 <strong>3년</strong>입니다.
                  시효가 지나면 보상받을 수 없으니 유의하세요.
                </p>
              </div>
            </div>
          </section>

          {/* 섹션 7 */}
          <section id="expert" className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm">7</span>
              전문가 도움이 필요한 경우
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>다음 상황에서는 손해사정사나 변호사의 도움을 받는 것이 좋습니다.</p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">&gt;</span>
                  <span>보험사가 제시한 합의금이 너무 적다고 느껴질 때</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">&gt;</span>
                  <span>과실비율에 대한 분쟁이 있을 때</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">&gt;</span>
                  <span>후유장해가 남았을 때</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">&gt;</span>
                  <span>보험사가 보상을 거부할 때</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">&gt;</span>
                  <span>여러 보험이 얽혀 복잡할 때</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-medium text-gray-900 mb-3">손해사정사 vs 변호사</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-4 border">
                    <h4 className="font-medium text-blue-600 mb-2">손해사정사</h4>
                    <ul className="space-y-1 text-gray-500">
                      <li>- 보험금 산정 전문</li>
                      <li>- 비용이 상대적으로 저렴</li>
                      <li>- 협상 중심 해결</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4 border">
                    <h4 className="font-medium text-purple-600 mb-2">변호사</h4>
                    <ul className="space-y-1 text-gray-500">
                      <li>- 소송 진행 가능</li>
                      <li>- 법적 분쟁 해결</li>
                      <li>- 비용이 상대적으로 높음</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 요약 */}
        <div className="bg-gray-100 rounded-2xl p-6 mb-10">
          <h2 className="font-bold text-gray-900 mb-4">핵심 요약</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>1. 합의금 = 치료비 + 위자료 + 휴업손해 - 과실분</p>
            <p>2. 치료가 끝난 후 합의하는 것이 유리</p>
            <p>3. 보험사 첫 제안은 협상 시작점 (바로 수락 X)</p>
            <p>4. 서류 준비와 서면 기록이 중요</p>
            <p>5. 어려우면 전문가 도움 받기</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">
            합의금 협상이 어려우신가요?
          </h2>
          <p className="text-blue-100 mb-6 text-sm">
            손해사정사가 무료로 검토해드립니다
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/calculator">
              <button className="w-full sm:w-auto px-6 py-3 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-colors">
                합의금 계산하기
              </button>
            </Link>
            <Link href="/contact">
              <button className="w-full sm:w-auto px-6 py-3 bg-white text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors">
                무료 상담 신청
              </button>
            </Link>
          </div>
        </div>

        {/* 관련 가이드 */}
        <div className="mt-12 pt-8 border-t">
          <h2 className="font-bold text-gray-900 mb-4">관련 가이드</h2>
          <div className="grid gap-3">
            <Link href="/guides/silson-insurance">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border hover:border-blue-200 transition-colors">
                <span className="text-2xl">🏥</span>
                <div>
                  <div className="font-medium text-gray-900">실손보험 청구 완벽 가이드</div>
                  <div className="text-sm text-gray-500">교통사고로 입원했다면 실손보험도 청구하세요</div>
                </div>
              </div>
            </Link>
            <Link href="/guides/claim-rejection">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border hover:border-blue-200 transition-colors">
                <span className="text-2xl">⚠️</span>
                <div>
                  <div className="font-medium text-gray-900">보험금 거절 대응 가이드</div>
                  <div className="text-sm text-gray-500">보험사가 보상을 거부했을 때 대응 방법</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </article>
    </Layout>
  );
}
