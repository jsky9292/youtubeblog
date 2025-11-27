// pages/quiz.js
// 보험금 자가진단 - 전환 최적화 버전

import { useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

const questions = [
  {
    id: 'situation',
    question: '현재 상황을 선택해주세요',
    options: [
      { value: 'accident', label: '사고를 당했어요', icon: '🚗', weight: 1 },
      { value: 'disease', label: '질병 진단을 받았어요', icon: '🏥', weight: 1 },
      { value: 'treatment', label: '치료를 받고 있어요', icon: '💊', weight: 0.8 },
      { value: 'claim-done', label: '보험금을 청구했어요', icon: '📋', weight: 1.2 },
    ]
  },
  {
    id: 'claim-status',
    question: '보험금 청구는 어떻게 되었나요?',
    options: [
      { value: 'not-yet', label: '아직 청구 안 함', score: 15, risk: 'medium' },
      { value: 'in-progress', label: '청구 진행 중', score: 10, risk: 'low' },
      { value: 'partial', label: '일부만 받음', score: 25, risk: 'high' },
      { value: 'rejected', label: '거절당함', score: 35, risk: 'critical' },
      { value: 'received', label: '전액 받음', score: 5, risk: 'low' },
    ]
  },
  {
    id: 'amount-feeling',
    question: '받은/제시받은 금액이 어떤가요?',
    conditions: ['partial', 'received', 'in-progress'],
    options: [
      { value: 'too-low', label: '너무 적은 것 같아요', score: 30, risk: 'high' },
      { value: 'not-sure', label: '적정한지 모르겠어요', score: 20, risk: 'medium' },
      { value: 'okay', label: '괜찮은 것 같아요', score: 5, risk: 'low' },
    ]
  },
  {
    id: 'treatment-status',
    question: '치료는 어떤 상태인가요?',
    options: [
      { value: 'ongoing-hospital', label: '입원 중이에요', score: 25, risk: 'medium' },
      { value: 'ongoing-outpatient', label: '통원 치료 중이에요', score: 15, risk: 'low' },
      { value: 'finished', label: '치료가 끝났어요', score: 10, risk: 'low' },
      { value: 'pain-remains', label: '치료 끝났는데 아직 아파요', score: 30, risk: 'high' },
    ]
  },
  {
    id: 'insurance-type',
    question: '어떤 보험이 있으세요?',
    multiple: true,
    options: [
      { value: 'auto', label: '자동차보험', score: 10 },
      { value: 'health', label: '실손보험', score: 10 },
      { value: 'life', label: '생명/건강보험', score: 15 },
      { value: 'unknown', label: '잘 모르겠어요', score: 20 },
    ]
  },
  {
    id: 'know-coverage',
    question: '보험에서 뭘 받을 수 있는지 아세요?',
    options: [
      { value: 'know-well', label: '잘 알고 있어요', score: 5, risk: 'low' },
      { value: 'know-some', label: '대충 알아요', score: 15, risk: 'medium' },
      { value: 'dont-know', label: '잘 모르겠어요', score: 25, risk: 'high' },
    ]
  },
];

const resultProfiles = {
  critical: {
    title: '전문가 상담이 꼭 필요해요',
    emoji: '🚨',
    color: 'from-red-500 to-red-600',
    textColor: 'text-red-600',
    bgColor: 'bg-red-50',
    message: '보험금이 거절되거나 적게 나왔을 가능성이 높아요. 손해사정사가 검토하면 추가로 받을 수 있는 금액이 있을 수 있어요.',
    cta: '무료로 검토받기',
    urgency: '지금 바로 상담받으세요',
  },
  high: {
    title: '추가 보험금 가능성이 높아요',
    emoji: '💡',
    color: 'from-orange-500 to-orange-600',
    textColor: 'text-orange-600',
    bgColor: 'bg-orange-50',
    message: '현재 상황에서 놓치고 있는 보험금이 있을 수 있어요. 전문가 검토로 정확한 금액을 확인해보세요.',
    cta: '놓친 보험금 확인하기',
    urgency: '상담 추천',
  },
  medium: {
    title: '한번 확인해보시는 게 좋아요',
    emoji: '🔍',
    color: 'from-blue-500 to-blue-600',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    message: '받을 수 있는 보험금을 모두 받고 계신지 확인이 필요해요. 무료 상담으로 확인해보세요.',
    cta: '무료 상담 받기',
    urgency: '확인 권장',
  },
  low: {
    title: '잘 진행되고 있는 것 같아요',
    emoji: '✅',
    color: 'from-green-500 to-green-600',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    message: '현재로서는 큰 문제가 없어 보여요. 다만 궁금한 점이 있으시면 언제든 문의해주세요.',
    cta: '궁금한 점 문의하기',
    urgency: '',
  },
};

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const getCurrentQuestion = () => {
    let step = 0;
    for (const q of questions) {
      // 조건부 질문 체크
      if (q.conditions) {
        const prevAnswer = answers['claim-status'];
        if (!q.conditions.includes(prevAnswer)) {
          continue;
        }
      }
      if (step === currentStep) {
        return q;
      }
      step++;
    }
    return null;
  };

  const getTotalSteps = () => {
    let count = 0;
    for (const q of questions) {
      if (q.conditions) {
        const prevAnswer = answers['claim-status'];
        if (!q.conditions.includes(prevAnswer)) {
          continue;
        }
      }
      count++;
    }
    return count;
  };

  const handleAnswer = (questionId, value, score = 0, risk = 'low') => {
    const newAnswers = {
      ...answers,
      [questionId]: { value, score, risk }
    };
    setAnswers(newAnswers);

    // 다음 질문으로
    const totalSteps = getTotalSteps();
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleMultipleAnswer = (questionId, values) => {
    const score = values.length * 10;
    handleAnswer(questionId, values, score, 'medium');
  };

  const calculateResult = () => {
    let totalScore = 0;
    let maxRisk = 'low';
    const riskOrder = ['low', 'medium', 'high', 'critical'];

    Object.values(answers).forEach(answer => {
      totalScore += answer.score || 0;
      if (riskOrder.indexOf(answer.risk) > riskOrder.indexOf(maxRisk)) {
        maxRisk = answer.risk;
      }
    });

    // 점수와 리스크를 종합해서 결과 결정
    if (maxRisk === 'critical' || totalScore >= 80) {
      return 'critical';
    } else if (maxRisk === 'high' || totalScore >= 60) {
      return 'high';
    } else if (totalScore >= 40) {
      return 'medium';
    }
    return 'low';
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
  };

  const currentQuestion = getCurrentQuestion();
  const totalSteps = getTotalSteps();
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <Layout
      title="보험금 자가진단"
      description="내 보험금, 제대로 받고 있나요? 1분 진단으로 확인해보세요."
      keywords="보험금 자가진단, 보험금 계산, 보험금 청구"
    >
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {showResult ? '진단 결과' : '보험금 자가진단'}
          </h1>
          {!showResult && (
            <p className="text-gray-500">1분이면 충분해요</p>
          )}
        </div>

        {/* 진행 바 */}
        {!showResult && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>진행중</span>
              <span>{currentStep + 1} / {totalSteps}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* 질문 */}
        {!showResult && currentQuestion && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(
                    currentQuestion.id,
                    option.value,
                    option.score || 0,
                    option.risk || 'low'
                  )}
                  className="w-full bg-white rounded-2xl border p-5 text-left hover:border-blue-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    {option.icon && (
                      <span className="text-2xl">{option.icon}</span>
                    )}
                    <span className="font-medium text-gray-900 group-hover:text-blue-600">
                      {option.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="mt-4 text-sm text-gray-400 hover:text-gray-600"
              >
                ← 이전으로
              </button>
            )}
          </div>
        )}

        {/* 결과 */}
        {showResult && (
          <div className="space-y-6">
            {(() => {
              const resultType = calculateResult();
              const result = resultProfiles[resultType];

              return (
                <>
                  {/* 결과 카드 */}
                  <div className={`bg-gradient-to-br ${result.color} rounded-3xl p-8 text-white text-center`}>
                    <div className="text-5xl mb-4">{result.emoji}</div>
                    <h2 className="text-2xl font-bold mb-2">{result.title}</h2>
                    {result.urgency && (
                      <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm">
                        {result.urgency}
                      </span>
                    )}
                  </div>

                  {/* 상세 메시지 */}
                  <div className={`${result.bgColor} rounded-2xl p-5`}>
                    <p className={`${result.textColor} text-sm leading-relaxed`}>
                      {result.message}
                    </p>
                  </div>

                  {/* 내 답변 요약 */}
                  <div className="bg-white rounded-2xl border p-5">
                    <h3 className="font-medium text-gray-900 mb-3 text-sm">내 상황 요약</h3>
                    <div className="space-y-2 text-sm">
                      {answers['claim-status']?.value === 'rejected' && (
                        <div className="flex items-center gap-2 text-red-600">
                          <span>⚠️</span>
                          <span>보험금 거절 상태</span>
                        </div>
                      )}
                      {answers['claim-status']?.value === 'partial' && (
                        <div className="flex items-center gap-2 text-orange-600">
                          <span>💰</span>
                          <span>일부만 지급받음</span>
                        </div>
                      )}
                      {answers['amount-feeling']?.value === 'too-low' && (
                        <div className="flex items-center gap-2 text-orange-600">
                          <span>📉</span>
                          <span>금액이 적다고 느낌</span>
                        </div>
                      )}
                      {answers['treatment-status']?.value === 'pain-remains' && (
                        <div className="flex items-center gap-2 text-blue-600">
                          <span>🏥</span>
                          <span>치료 후에도 통증 지속</span>
                        </div>
                      )}
                      {answers['know-coverage']?.value === 'dont-know' && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <span>❓</span>
                          <span>보장내용 파악 필요</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="space-y-3">
                    <Link href="/contact">
                      <button className="w-full py-4 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 text-lg">
                        {result.cta}
                      </button>
                    </Link>

                    <div className="grid grid-cols-2 gap-3">
                      <Link href="/calculator">
                        <button className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                          합의금 계산하기
                        </button>
                      </Link>
                      <Link href="/cases">
                        <button className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                          비슷한 사례 보기
                        </button>
                      </Link>
                    </div>

                    <button
                      onClick={resetQuiz}
                      className="w-full py-3 text-gray-500 hover:text-gray-700 transition-colors text-sm"
                    >
                      다시 진단받기
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* 안내 */}
        {!showResult && (
          <p className="text-center text-xs text-gray-400 mt-8">
            입력하신 정보는 진단 목적으로만 사용됩니다
          </p>
        )}
      </div>
    </Layout>
  );
}
