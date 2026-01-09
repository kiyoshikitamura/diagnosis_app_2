'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import questionsData from '../data/questions.json';

export default function HomePage() {
    const router = useRouter();
    const [isStarted, setIsStarted] = useState(false);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [isSecondPhase, setIsSecondPhase] = useState(false);
    const [userAttribute, setUserAttribute] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // 属性判定
    const determineAttribute = (allAnswers: Record<number, number>) => {
        const genderScore = ((allAnswers[1] || 3) + (allAnswers[2] || 3) + (allAnswers[3] || 3) + (allAnswers[4] || 3) + (allAnswers[5] || 3)) / 5;
        const classScore = ((allAnswers[6] || 3) + (allAnswers[7] || 3) + (allAnswers[8] || 3) + (allAnswers[9] || 3) + (allAnswers[10] || 3)) / 5;
        const isMale = genderScore >= 3;
        const isHigh = classScore >= 3;
        if (isHigh && isMale) return 'high_male';
        if (isHigh && !isMale) return 'high_female';
        if (!isHigh && isMale) return 'cas_male';
        return 'cas_female';
    };

    const displayQuestions = useMemo(() => {
        if (!isSecondPhase) {
            return questionsData.filter(q => q.groupId === "common").slice(0, 10);
        }
        return questionsData.filter(q => q.groupId === userAttribute);
    }, [isSecondPhase, userAttribute]);

    const currentPageQuestions = useMemo(() => {
        const start = isSecondPhase ? (currentStep - 1) * 10 : 0;
        return displayQuestions.slice(start, start + 10);
    }, [displayQuestions, currentStep, isSecondPhase]);

    const handleAnswer = (questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const nextStep = () => {
        if (!isSecondPhase) {
            const attr = determineAttribute(answers);
            setUserAttribute(attr);
            setIsSecondPhase(true);
            setCurrentStep(1);
        } else if (currentStep < 3) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsAnalyzing(true);
            localStorage.setItem('diagnosis_answers', JSON.stringify(answers));
            localStorage.setItem('user_attribute', userAttribute || 'cas_male');
            setTimeout(() => router.push('/result'), 1800);
        }
        window.scrollTo(0, 0);
    };

    const handleReset = () => {
        if (confirm('最初からやり直しますか？')) {
            localStorage.removeItem('diagnosis_answers');
            setAnswers({});
            setIsStarted(false);
            setIsSecondPhase(false);
            setCurrentStep(0);
            window.scrollTo(0, 0);
        }
    };

    if (isAnalyzing) {
        return (
            <div className="max-w-2xl mx-auto min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                {/* ローディングテキストの変更 */}
                <h2 className="text-xl font-bold text-slate-800">回答を分析中...</h2>
            </div>
        );
    }

    if (!isStarted) {
        return (
            <div className="max-w-2xl mx-auto min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
                <h1 className="text-3xl font-black text-slate-800 mb-4 leading-tight">歴史の偉人が教える<br /><span className="text-indigo-600">あなたの「才能」鑑定</span></h1>
                <div className="w-32 h-32 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 text-5xl">🏛️</div>
                <button onClick={() => setIsStarted(true)} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-all">診断をはじめる</button>
            </div>
        );
    }

    const isFinalStep = isSecondPhase && currentStep === 3;

    return (
        <div className="max-w-2xl mx-auto min-h-screen bg-slate-50 pb-20 font-sans">
            <div className="sticky top-0 bg-white/90 backdrop-blur pt-4 pb-2 px-5 border-b border-slate-100 z-10">
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1">
                    <span className="tracking-widest">PROGRESS</span>
                    <span>{Math.round((Object.keys(answers).length / 40) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-700 ease-out" style={{ width: `${(Object.keys(answers).length / 40) * 100}%` }} />
                </div>
            </div>

            <div className="px-5 py-6 space-y-4">
                {currentPageQuestions.map((q, index) => {
                    const qNumber = isSecondPhase ? (currentStep - 1) * 10 + (index + 1) + 10 : index + 1;

                    return (
                        <div key={q.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[11px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">Q{qNumber}</span>
                            </div>
                            <p className="text-[15px] font-bold text-slate-700 leading-relaxed mb-8">{q.question}</p>

                            {/* 回答エリア：中央に向かってサイズが小さくなるデザイン */}
                            <div className="flex justify-between items-center gap-1 max-w-sm mx-auto relative px-2 mt-10">
                                <span className="text-[10px] font-bold text-indigo-500 absolute -top-8 left-0">そう思う</span>
                                <span className="text-[10px] font-bold text-slate-400 absolute -top-8 right-0">そう思わない</span>

                                {[5, 4, 3, 2, 1].map((val) => {
                                    // 値に応じてサイズを変更 (5,1は最大, 4,2は中, 3は最小)
                                    const sizeClass =
                                        val === 5 || val === 1 ? 'w-11 h-11' :
                                            val === 4 || val === 2 ? 'w-9 h-9' :
                                                'w-7 h-7';

                                    return (
                                        <button
                                            key={val}
                                            onClick={() => handleAnswer(q.id, val)}
                                            className={`relative ${sizeClass} rounded-full border-2 transition-all duration-300 flex-shrink-0
                        ${answers[q.id] === val
                                                    ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100 scale-110'
                                                    : 'bg-white border-slate-200'
                                                }`}
                                        >
                                            {/* 回答の丸をシンプルな中空デザイン（〇）に変更しつつ、選択時のアニメーションを維持 */}
                                            {answers[q.id] === val && (
                                                <div className="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-40" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                <div className="pt-6 space-y-4">
                    <button
                        onClick={nextStep}
                        disabled={currentPageQuestions.some(q => !answers[q.id])}
                        className={`w-full py-5 rounded-2xl font-bold transition-all active:scale-[0.98] ${currentPageQuestions.every(q => answers[q.id])
                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {isFinalStep ? '結果を解析する' : '次の設問へ'}
                    </button>

                    {/* 最終ステップ（40問目終了時）以外で表示する「最初からやり直す」ボタン */}
                    {!isFinalStep && (
                        <button
                            onClick={handleReset}
                            className="w-full py-4 bg-white text-slate-400 rounded-2xl font-bold border border-slate-200 active:scale-95 transition-all text-xs tracking-widest uppercase shadow-sm"
                        >
                            最初からやり直す
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}