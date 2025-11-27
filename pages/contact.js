// pages/contact.js
// 시그널플래너 스타일 - 간편 상담 신청

import { useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function Contact() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    situation: '',
    name: '',
    phone: '',
    agreement: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const situations = [
    {
      value: 'accident',
      label: '사고가 났어요',
      icon: '🚗',
      desc: '교통사고, 상해사고 등',
      examples: ['자동차 사고', '넘어져서 다침', '산재']
    },
    {
      value: 'disease',
      label: '질병 진단받았어요',
      icon: '🏥',
      desc: '암, 뇌질환, 심장질환 등',
      examples: ['암 진단', '뇌졸중', '심근경색']
    },
    {
      value: 'rejected',
      label: '보험금 거절당했어요',
      icon: '❌',
      desc: '청구했는데 거절됨',
      examples: ['입원비 거절', '수술비 미지급', '과소지급']
    },
    {
      value: 'check',
      label: '받을 수 있는지 확인',
      icon: '🔍',
      desc: '청구 가능 여부 확인',
      examples: ['뭘 받을 수 있는지 모름', '서류가 복잡함']
    },
  ];

  const handleSituationSelect = (value) => {
    setFormData(prev => ({ ...prev, situation: value }));
    setStep(2);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreement) {
      alert('개인정보 수집에 동의해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert('제출 중 오류가 발생했습니다.');
      }
    } catch (error) {
      alert('제출 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Layout title="상담 신청 완료">
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">접수 완료!</h1>
          <p className="text-gray-500 mb-2">
            손해사정사가 곧 연락드릴게요
          </p>
          <p className="text-sm text-gray-400 mb-8">
            평균 응답시간: 24시간 이내
          </p>
          <Link href="/">
            <button className="px-6 py-3 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 transition-colors">
              홈으로
            </button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="무료 상담" description="보험금 청구 무료 상담. 손해사정사가 직접 검토해드립니다.">
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* 진행 표시 */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
          <div className={`w-12 h-1 rounded ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
        </div>

        {/* Step 1: 상황 선택 */}
        {step === 1 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">어떤 상황이세요?</h1>
              <p className="text-gray-500">해당하는 상황을 선택해주세요</p>
            </div>

            <div className="space-y-3">
              {situations.map((item) => (
                <button
                  key={item.value}
                  onClick={() => handleSituationSelect(item.value)}
                  className="w-full bg-white rounded-2xl border p-5 text-left hover:border-blue-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{item.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 group-hover:text-blue-500 transition-colors">
                        {item.label}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{item.desc}</div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {item.examples.map((ex, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: 연락처 입력 */}
        {step === 2 && (
          <div>
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              이전
            </button>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">연락처만 남겨주세요</h1>
              <p className="text-gray-500">전화로 자세한 상황을 들을게요</p>
            </div>

            {/* 선택된 상황 표시 */}
            <div className="bg-blue-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{situations.find(s => s.value === formData.situation)?.icon}</span>
                <div>
                  <div className="font-medium text-blue-900">
                    {situations.find(s => s.value === formData.situation)?.label}
                  </div>
                  <div className="text-sm text-blue-600">
                    {situations.find(s => s.value === formData.situation)?.desc}
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-white rounded-2xl border p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                    placeholder="홍길동"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">연락처</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                    placeholder="010-1234-5678"
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer py-2">
                <input
                  type="checkbox"
                  name="agreement"
                  checked={formData.agreement}
                  onChange={handleChange}
                  className="mt-0.5 w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">
                  개인정보 수집 및 이용에 동의합니다
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting || !formData.name || !formData.phone || !formData.agreement}
                className="w-full py-4 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300 shadow-lg shadow-blue-500/30 text-lg"
              >
                {submitting ? '접수 중...' : '무료 상담 신청'}
              </button>
            </form>

            {/* 안심 문구 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                상담 비용 무료 · 강제 가입 없음 · 24시간 내 연락
              </p>
            </div>
          </div>
        )}

        {/* 하단 분쟁사례 링크 */}
        {step === 1 && (
          <div className="mt-8 pt-6 border-t">
            <Link href="/cases">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">보험금 분쟁, 이렇게 해결했어요</div>
                    <div className="text-sm text-gray-500">실제 청구 성공 사례 보기</div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
