// pages/guides/cancer-insurance.js
// 암 진단비 청구 완벽 가이드 - SEO 최적화

import Layout from '../../components/Layout';
import Link from 'next/link';

export default function CancerInsuranceGuide() {
  const sections = [
    { id: 'intro', title: '암 진단비란?' },
    { id: 'types', title: '암의 종류와 보험금' },
    { id: 'coverage', title: '받을 수 있는 보험금 항목' },
    { id: 'documents', title: '청구에 필요한 서류' },
    { id: 'process', title: '청구 절차' },
    { id: 'issues', title: '흔한 분쟁 사례' },
    { id: 'tips', title: '더 많이 받는 방법' },
  ];

  return (
    <Layout
      title="암 진단비 청구 완벽 가이드 2024"
      description="암 진단을 받으셨나요? 암 진단비, 수술비, 입원비 등 받을 수 있는 모든 보험금을 정리했습니다. 손해사정사가 알려드리는 청구 꿀팁."
      keywords="암 진단비, 암보험 청구, 유사암, 소액암, 암 보험금, 암 진단비 지급"
    >
      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* 헤더 */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/guides" className="text-blue-500 hover:text-blue-600 text-sm">
              가이드
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500 text-sm">생명보험</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            암 진단비 청구 완벽 가이드
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            암 진단 후 받을 수 있는 모든 보험금과 청구 방법을 알려드립니다.
          </p>
          <div className="flex items-center gap-4 mt-6 text-sm text-gray-400">
            <span>2024년 기준</span>
            <span>|</span>
            <span>읽는 시간 12분</span>
          </div>
        </header>

        {/* 중요 안내 */}
        <div className="bg-purple-50 rounded-2xl p-5 mb-10">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💜</span>
            <div>
              <div className="font-medium text-purple-900 mb-1">힘든 시간을 보내고 계신다면</div>
              <div className="text-sm text-purple-700">
                치료에 집중하시고, 보험 청구는 가족이나 전문가에게 맡기셔도 됩니다.
                도움이 필요하시면 언제든 무료 상담을 신청해주세요.
              </div>
            </div>
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
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-sm">1</span>
              암 진단비란?
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                <strong>암 진단비</strong>는 암으로 확정 진단받았을 때 일시금으로 받는 보험금입니다.
                치료비로 사용하거나 생활비로 활용할 수 있으며, 사용처에 제한이 없습니다.
              </p>
              <div className="bg-white border rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">암 진단비의 특징</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">O</span>
                    <span>진단 즉시 지급 (치료 여부 관계없음)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">O</span>
                    <span>사용처 제한 없음</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">O</span>
                    <span>가입한 모든 보험에서 중복 지급</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">X</span>
                    <span>면책기간(보통 90일) 이내 진단 시 미지급</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 섹션 2 */}
          <section id="types" className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-sm">2</span>
              암의 종류와 보험금
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                보험에서 암은 <strong>일반암, 유사암, 소액암</strong>으로 구분됩니다.
                같은 암이라도 분류에 따라 받는 보험금이 크게 달라집니다.
              </p>

              <div className="grid gap-4">
                <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-red-500 text-white rounded text-xs font-medium">일반암</span>
                    <span className="text-sm text-red-600">100% 지급</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    위암, 폐암, 간암, 대장암, 유방암 등 대부분의 암
                  </p>
                  <p className="text-xs text-gray-400">
                    예시: 진단비 5,000만원 가입 → 5,000만원 지급
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-orange-500 text-white rounded text-xs font-medium">유사암</span>
                    <span className="text-sm text-orange-600">10~20% 지급</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>- 갑상선암</li>
                    <li>- 기타피부암 (악성흑색종 제외)</li>
                    <li>- 경계성종양</li>
                    <li>- 제자리암 (상피내암)</li>
                  </ul>
                  <p className="text-xs text-gray-400 mt-2">
                    예시: 진단비 5,000만원 가입 → 500~1,000만원 지급
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-yellow-500 text-white rounded text-xs font-medium">소액암</span>
                    <span className="text-sm text-yellow-600">10~20% 지급</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>- 전립선암</li>
                    <li>- 방광암 (침윤성 제외)</li>
                    <li>- 유방암 (침윤성 제외)</li>
                  </ul>
                  <p className="text-xs text-gray-400 mt-2">
                    * 보험사/약관에 따라 분류가 다를 수 있음
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>중요:</strong> 같은 암이라도 약관에 따라 유사암/소액암 분류가 다릅니다.
                  반드시 본인 약관을 확인하세요.
                </p>
              </div>
            </div>
          </section>

          {/* 섹션 3 */}
          <section id="coverage" className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-sm">3</span>
              받을 수 있는 보험금 항목
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                암 진단 시 진단비 외에도 다양한 항목에서 보험금을 받을 수 있습니다.
                가입한 보험의 특약을 모두 확인해보세요.
              </p>

              <div className="space-y-3">
                <div className="bg-white border rounded-xl p-4">
                  <h3 className="font-bold text-gray-900 mb-2">암 진단비</h3>
                  <p className="text-sm text-gray-500">확정 진단 시 일시금 지급</p>
                </div>
                <div className="bg-white border rounded-xl p-4">
                  <h3 className="font-bold text-gray-900 mb-2">암 수술비</h3>
                  <p className="text-sm text-gray-500">수술 시마다 지급 (횟수 제한 확인)</p>
                </div>
                <div className="bg-white border rounded-xl p-4">
                  <h3 className="font-bold text-gray-900 mb-2">암 입원일당</h3>
                  <p className="text-sm text-gray-500">입원일수 × 일당금액</p>
                </div>
                <div className="bg-white border rounded-xl p-4">
                  <h3 className="font-bold text-gray-900 mb-2">암 통원비</h3>
                  <p className="text-sm text-gray-500">항암치료 등 통원 시 지급</p>
                </div>
                <div className="bg-white border rounded-xl p-4">
                  <h3 className="font-bold text-gray-900 mb-2">항암방사선약물치료비</h3>
                  <p className="text-sm text-gray-500">항암, 방사선 치료 시 추가 지급</p>
                </div>
                <div className="bg-white border rounded-xl p-4">
                  <h3 className="font-bold text-gray-900 mb-2">실손의료비</h3>
                  <p className="text-sm text-gray-500">실제 치료비 중 본인부담금 보전</p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-5">
                <h3 className="font-medium text-purple-900 mb-2">체크리스트</h3>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-2 text-gray-600">
                    <input type="checkbox" className="rounded" />
                    <span>암 진단비 특약</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-600">
                    <input type="checkbox" className="rounded" />
                    <span>암 수술비 특약</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-600">
                    <input type="checkbox" className="rounded" />
                    <span>암 입원일당 특약</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-600">
                    <input type="checkbox" className="rounded" />
                    <span>항암치료비 특약</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-600">
                    <input type="checkbox" className="rounded" />
                    <span>실손의료비 (실손보험)</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* 섹션 4 */}
          <section id="documents" className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-sm">4</span>
              청구에 필요한 서류
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <div className="bg-white border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-500 font-medium">서류</th>
                      <th className="px-4 py-3 text-left text-gray-500 font-medium">발급처</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-3 font-medium">진단서 (암 확정)</td>
                      <td className="px-4 py-3 text-gray-500">병원 원무과</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3 font-medium">조직검사 결과지</td>
                      <td className="px-4 py-3 text-gray-500">병원 (병리과)</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3 font-medium">진료기록사본</td>
                      <td className="px-4 py-3 text-gray-500">병원 원무과</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3 font-medium">영수증/세부내역서</td>
                      <td className="px-4 py-3 text-gray-500">병원 수납창구</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3 font-medium">신분증 사본</td>
                      <td className="px-4 py-3 text-gray-500">-</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3 font-medium">통장 사본</td>
                      <td className="px-4 py-3 text-gray-500">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <p className="text-blue-800 text-sm">
                  <strong>팁:</strong> 서류는 한꺼번에 여러 부 발급받으세요.
                  가입한 보험사마다 청구해야 하므로 보험 개수만큼 필요합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 섹션 5 */}
          <section id="process" className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-sm">5</span>
              청구 절차
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    1
                  </div>
                  <div className="flex-1 pb-4 border-b">
                    <h3 className="font-bold text-gray-900 mb-1">가입 보험 확인</h3>
                    <p className="text-sm text-gray-500">
                      내보험다보여, 보험다모아 앱으로 가입한 모든 보험 확인
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    2
                  </div>
                  <div className="flex-1 pb-4 border-b">
                    <h3 className="font-bold text-gray-900 mb-1">약관 검토</h3>
                    <p className="text-sm text-gray-500">
                      암 분류, 면책기간, 감액기간 등 확인
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    3
                  </div>
                  <div className="flex-1 pb-4 border-b">
                    <h3 className="font-bold text-gray-900 mb-1">서류 준비</h3>
                    <p className="text-sm text-gray-500">
                      진단서, 조직검사 결과지 등 필요 서류 발급
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    4
                  </div>
                  <div className="flex-1 pb-4 border-b">
                    <h3 className="font-bold text-gray-900 mb-1">청구서 제출</h3>
                    <p className="text-sm text-gray-500">
                      각 보험사 앱, 홈페이지, 방문, 우편 중 선택
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    5
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">지급 확인</h3>
                    <p className="text-sm text-gray-500">
                      보통 3영업일 내 지급 (추가 심사 시 최대 30일)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 섹션 6 */}
          <section id="issues" className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-sm">6</span>
              흔한 분쟁 사례
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <div className="space-y-4">
                <div className="bg-white border rounded-xl p-5">
                  <h3 className="font-bold text-red-600 mb-2">사례 1: 유사암/소액암 분류 분쟁</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    "갑상선암인데 왜 10%만 주나요?"
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    <strong>대응:</strong> 약관의 암 분류 기준 확인. 가입 시기에 따라 일반암으로 인정되는 경우도 있음
                  </div>
                </div>

                <div className="bg-white border rounded-xl p-5">
                  <h3 className="font-bold text-red-600 mb-2">사례 2: 면책기간 분쟁</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    "가입 후 89일에 진단받았는데 안 준다고 해요"
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    <strong>대응:</strong> 90일 면책기간은 대부분 약관에 명시. 다만 '최초 계약'이 아닌 갱신계약이면 면책 미적용될 수 있음
                  </div>
                </div>

                <div className="bg-white border rounded-xl p-5">
                  <h3 className="font-bold text-red-600 mb-2">사례 3: 고지의무 위반</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    "가입 전 건강검진 결과를 안 알렸다고 거절당했어요"
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    <strong>대응:</strong> 고지의무 위반과 암 발생 간 인과관계가 없으면 보험금 청구 가능. 분쟁조정 신청
                  </div>
                </div>

                <div className="bg-white border rounded-xl p-5">
                  <h3 className="font-bold text-red-600 mb-2">사례 4: 재발/전이암</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    "암이 재발했는데 또 받을 수 있나요?"
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    <strong>대응:</strong> 약관에 '최초 1회 한' 조건 확인. 다른 부위 원발암이면 추가 지급 가능한 경우 있음
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 섹션 7 */}
          <section id="tips" className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-sm">7</span>
              더 많이 받는 방법
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm flex-shrink-0">1</span>
                  <div>
                    <h3 className="font-medium text-gray-900">모든 보험 확인하기</h3>
                    <p className="text-sm text-gray-500">
                      잊고 있던 보험, 단체보험(직장), 카드 부가보험까지 모두 확인
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm flex-shrink-0">2</span>
                  <div>
                    <h3 className="font-medium text-gray-900">병명 코드 확인하기</h3>
                    <p className="text-sm text-gray-500">
                      진단서의 병명 코드(C, D코드)가 약관상 일반암인지 확인
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm flex-shrink-0">3</span>
                  <div>
                    <h3 className="font-medium text-gray-900">수술비/입원비도 청구하기</h3>
                    <p className="text-sm text-gray-500">
                      진단비만 청구하지 말고, 수술비, 입원일당도 빠짐없이
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm flex-shrink-0">4</span>
                  <div>
                    <h3 className="font-medium text-gray-900">거절 시 이의제기하기</h3>
                    <p className="text-sm text-gray-500">
                      보험사 거절이 부당하다면 금감원 분쟁조정 신청
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm flex-shrink-0">5</span>
                  <div>
                    <h3 className="font-medium text-gray-900">전문가 상담받기</h3>
                    <p className="text-sm text-gray-500">
                      복잡하거나 거절당했다면 손해사정사 상담 추천
                    </p>
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
            <p>1. 암 진단비는 가입한 모든 보험에서 중복 지급됨</p>
            <p>2. 일반암/유사암/소액암 분류에 따라 지급액이 다름</p>
            <p>3. 진단비 외에 수술비, 입원비, 항암치료비도 청구</p>
            <p>4. 서류는 보험 개수만큼 여러 부 발급</p>
            <p>5. 거절 시 금감원 분쟁조정 활용 가능</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">
            청구가 복잡하거나 거절당하셨나요?
          </h2>
          <p className="text-purple-100 mb-6 text-sm">
            손해사정사가 무료로 검토해드립니다
          </p>
          <Link href="/contact">
            <button className="px-6 py-3 bg-white text-purple-600 rounded-xl font-medium hover:bg-purple-50 transition-colors">
              무료 상담 신청하기
            </button>
          </Link>
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
                  <div className="text-sm text-gray-500">암 치료비도 실손보험으로 청구하세요</div>
                </div>
              </div>
            </Link>
            <Link href="/guides/claim-rejection">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border hover:border-blue-200 transition-colors">
                <span className="text-2xl">⚠️</span>
                <div>
                  <div className="font-medium text-gray-900">보험금 거절 대응 가이드</div>
                  <div className="text-sm text-gray-500">보험사가 지급을 거부했을 때 대응법</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </article>
    </Layout>
  );
}
