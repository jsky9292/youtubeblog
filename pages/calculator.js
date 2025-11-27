// pages/calculator.js
// 교통사고 합의금 계산기 - SEO 최적화

import { useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function Calculator() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    accidentType: '',
    injuryType: '',
    hospitalDays: '',
    outpatientDays: '',
    treatmentCost: '',
    monthlyIncome: '',
    faultRatio: '0',
    hasOngoingPain: false,
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateSettlement = () => {
    const hospitalDays = parseInt(formData.hospitalDays) || 0;
    const outpatientDays = parseInt(formData.outpatientDays) || 0;
    const treatmentCost = parseInt(formData.treatmentCost) || 0;
    const monthlyIncome = parseInt(formData.monthlyIncome) || 0;
    const faultRatio = parseInt(formData.faultRatio) || 0;
    const myFaultRatio = (100 - faultRatio) / 100;

    // 1. 치료비 (실제 발생액)
    const medicalCost = treatmentCost;

    // 2. 위자료 계산 (일반 기준)
    // 입원: 일당 약 5~8만원, 통원: 일당 약 3~5만원
    const hospitalConsolation = hospitalDays * 60000;
    const outpatientConsolation = outpatientDays * 35000;
    const consolationMoney = hospitalConsolation + outpatientConsolation;

    // 3. 휴업손해 (소득이 있는 경우)
    const totalTreatmentDays = hospitalDays + Math.ceil(outpatientDays * 0.5);
    const dailyIncome = monthlyIncome / 30;
    const lostWages = monthlyIncome > 0 ? Math.round(dailyIncome * totalTreatmentDays * 0.85) : 0;

    // 4. 향후치료비 (지속 통증 있는 경우)
    const futureTreatment = formData.hasOngoingPain ? Math.round(treatmentCost * 0.3) : 0;

    // 5. 기타 비용 (교통비 등 추정)
    const miscCost = Math.round((hospitalDays * 10000) + (outpatientDays * 5000));

    // 총액 계산
    const totalBeforeFault = medicalCost + consolationMoney + lostWages + futureTreatment + miscCost;

    // 과실상계 적용
    const finalAmount = Math.round(totalBeforeFault * myFaultRatio);

    // 범위 계산 (실제는 ±20% 변동)
    const minAmount = Math.round(finalAmount * 0.8);
    const maxAmount = Math.round(finalAmount * 1.3);

    setResult({
      breakdown: {
        medicalCost,
        consolationMoney,
        lostWages,
        futureTreatment,
        miscCost,
        totalBeforeFault,
        faultDeduction: totalBeforeFault - finalAmount,
      },
      finalAmount,
      range: { min: minAmount, max: maxAmount },
      hospitalDays,
      outpatientDays,
    });

    setStep(3);
  };

  const formatMoney = (num) => {
    if (num >= 10000) {
      return `${Math.round(num / 10000)}만원`;
    }
    return `${num.toLocaleString()}원`;
  };

  const accidentTypes = [
    { value: 'rear-end', label: '추돌사고', desc: '뒤에서 받힘' },
    { value: 'side', label: '측면충돌', desc: '옆에서 충돌' },
    { value: 'head-on', label: '정면충돌', desc: '마주보고 충돌' },
    { value: 'pedestrian', label: '보행자사고', desc: '차에 치임' },
    { value: 'other', label: '기타', desc: '그 외 사고' },
  ];

  const injuryTypes = [
    { value: 'whiplash', label: '경추/요추 염좌', desc: '목, 허리 통증' },
    { value: 'fracture', label: '골절', desc: '뼈가 부러짐' },
    { value: 'bruise', label: '타박상/찰과상', desc: '멍, 긁힘' },
    { value: 'disc', label: '디스크', desc: '추간판 손상' },
    { value: 'multiple', label: '복합 부상', desc: '여러 부위 손상' },
  ];

  return (
    <Layout
      title="교통사고 합의금 계산기"
      description="교통사고 합의금을 무료로 계산해보세요. 치료비, 위자료, 휴업손해까지 한번에 계산합니다."
      keywords="교통사고 합의금 계산, 합의금 계산기, 위자료 계산, 휴업손해"
    >
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            교통사고 합의금 계산기
          </h1>
          <p className="text-gray-500">
            예상 합의금을 무료로 계산해보세요
          </p>
        </div>

        {/* 진행 표시 */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`w-8 h-1 ${step > s ? 'bg-blue-500' : 'bg-gray-200'}`}></div>}
            </div>
          ))}
        </div>

        {/* Step 1: 사고 정보 */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border p-6">
              <h2 className="font-semibold text-gray-900 mb-4">어떤 사고를 당하셨나요?</h2>
              <div className="grid grid-cols-2 gap-3">
                {accidentTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleSelectChange('accidentType', type.value)}
                    className={`p-4 border rounded-xl text-left transition-all ${
                      formData.accidentType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{type.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border p-6">
              <h2 className="font-semibold text-gray-900 mb-4">어디를 다치셨나요?</h2>
              <div className="grid grid-cols-2 gap-3">
                {injuryTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleSelectChange('injuryType', type.value)}
                    className={`p-4 border rounded-xl text-left transition-all ${
                      formData.injuryType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{type.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!formData.accidentType || !formData.injuryType}
              className="w-full py-4 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300"
            >
              다음
            </button>
          </div>
        )}

        {/* Step 2: 상세 정보 */}
        {step === 2 && (
          <div className="space-y-6">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              이전
            </button>

            <div className="bg-white rounded-2xl border p-6 space-y-5">
              <h2 className="font-semibold text-gray-900">치료 정보를 입력해주세요</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">입원 일수</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="hospitalDays"
                      value={formData.hospitalDays}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">일</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">통원 일수</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="outpatientDays"
                      value={formData.outpatientDays}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">일</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">총 치료비 (본인부담금)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="treatmentCost"
                    value={formData.treatmentCost}
                    onChange={handleChange}
                    placeholder="500000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">원</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">월 소득 (선택)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleChange}
                    placeholder="없으면 0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">원</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">휴업손해 계산에 사용됩니다</p>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">상대방 과실 비율</label>
                <select
                  name="faultRatio"
                  value={formData.faultRatio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="100">100:0 (내 과실 없음)</option>
                  <option value="90">90:10</option>
                  <option value="80">80:20</option>
                  <option value="70">70:30</option>
                  <option value="60">60:40</option>
                  <option value="50">50:50</option>
                </select>
              </div>

              <label className="flex items-center gap-3 cursor-pointer py-2">
                <input
                  type="checkbox"
                  name="hasOngoingPain"
                  checked={formData.hasOngoingPain}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">치료 종료 후에도 통증이 지속됨</span>
              </label>
            </div>

            <button
              onClick={calculateSettlement}
              disabled={!formData.treatmentCost && !formData.hospitalDays && !formData.outpatientDays}
              className="w-full py-4 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300 shadow-lg shadow-blue-500/30"
            >
              합의금 계산하기
            </button>
          </div>
        )}

        {/* Step 3: 결과 */}
        {step === 3 && result && (
          <div className="space-y-6">
            {/* 결과 요약 */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white text-center">
              <p className="text-blue-100 mb-2">예상 합의금</p>
              <p className="text-4xl font-bold mb-1">
                {formatMoney(result.range.min)} ~ {formatMoney(result.range.max)}
              </p>
              <p className="text-sm text-blue-200">
                중간값: {formatMoney(result.finalAmount)}
              </p>
            </div>

            {/* 상세 내역 */}
            <div className="bg-white rounded-2xl border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">산정 내역</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">치료비</span>
                  <span className="font-medium">{result.breakdown.medicalCost.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    위자료
                    <span className="text-xs text-gray-400 ml-1">
                      (입원 {result.hospitalDays}일 + 통원 {result.outpatientDays}일)
                    </span>
                  </span>
                  <span className="font-medium">{result.breakdown.consolationMoney.toLocaleString()}원</span>
                </div>
                {result.breakdown.lostWages > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">휴업손해</span>
                    <span className="font-medium">{result.breakdown.lostWages.toLocaleString()}원</span>
                  </div>
                )}
                {result.breakdown.futureTreatment > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">향후치료비 (예상)</span>
                    <span className="font-medium">{result.breakdown.futureTreatment.toLocaleString()}원</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">기타 (교통비 등)</span>
                  <span className="font-medium">{result.breakdown.miscCost.toLocaleString()}원</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-gray-900 font-medium">합계</span>
                  <span className="font-bold">{result.breakdown.totalBeforeFault.toLocaleString()}원</span>
                </div>
                {result.breakdown.faultDeduction > 0 && (
                  <div className="flex justify-between text-sm text-red-500">
                    <span>과실상계 차감</span>
                    <span>-{result.breakdown.faultDeduction.toLocaleString()}원</span>
                  </div>
                )}
              </div>
            </div>

            {/* 주의사항 */}
            <div className="bg-yellow-50 rounded-2xl p-5">
              <h3 className="font-medium text-yellow-800 mb-2 text-sm">참고사항</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 실제 합의금은 부상 정도, 치료 경과에 따라 달라집니다</li>
                <li>• 후유장해가 있으면 추가 보상이 가능합니다</li>
                <li>• 보험사 제시 금액이 이보다 낮다면 검토가 필요합니다</li>
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-gray-900 rounded-2xl p-6 text-center">
              <h3 className="text-white font-semibold mb-2">
                보험사 제시 금액이 적으신가요?
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                손해사정사가 무료로 검토해드립니다
              </p>
              <Link href="/contact">
                <button className="w-full py-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors">
                  무료 상담 신청
                </button>
              </Link>
            </div>

            {/* 다시 계산 */}
            <button
              onClick={() => {
                setStep(1);
                setResult(null);
                setFormData({
                  accidentType: '',
                  injuryType: '',
                  hospitalDays: '',
                  outpatientDays: '',
                  treatmentCost: '',
                  monthlyIncome: '',
                  faultRatio: '0',
                  hasOngoingPain: false,
                });
              }}
              className="w-full py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
            >
              다시 계산하기
            </button>
          </div>
        )}

        {/* 하단 안내 (Step 1, 2) */}
        {step < 3 && (
          <div className="mt-8 bg-gray-50 rounded-2xl p-5">
            <h3 className="font-medium text-gray-900 mb-2 text-sm">합의금 구성요소</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white rounded-xl p-3">
                <div className="font-medium text-gray-900">치료비</div>
                <div className="text-xs text-gray-500">실제 발생한 병원비</div>
              </div>
              <div className="bg-white rounded-xl p-3">
                <div className="font-medium text-gray-900">위자료</div>
                <div className="text-xs text-gray-500">정신적 피해 보상</div>
              </div>
              <div className="bg-white rounded-xl p-3">
                <div className="font-medium text-gray-900">휴업손해</div>
                <div className="text-xs text-gray-500">일 못한 기간 보상</div>
              </div>
              <div className="bg-white rounded-xl p-3">
                <div className="font-medium text-gray-900">기타비용</div>
                <div className="text-xs text-gray-500">교통비, 간병비 등</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
