'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import questionsData from '../data/questions.json';

export default function HomePage() {
    const router = useRouter();
    const [isStarted, setIsStarted] = useState(false);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [isSecondPhase, setIsSecondPhase] = useState(false);
    const [userAttribute, setUserAttribute] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0); // 0:共通, 1:属性別P1, 2:属性別P2, 3:属性別P3
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // 共通10問から属性を判定
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
        // 判定された属性に一致する30問を取得
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

    if (isAnalyzing) {
        return (
            <div className="max-w-2xl mx-auto min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                <h2 className="text-xl font-bold text-slate-800">英雄の魂を照合中...</h2>
            </div>
        );
    }

    if (!isStarted) {
        return (
            <div className="max-w-2xl mx-auto min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
                <h1 className="text-3xl font-black text-slate-800 mb-4">歴史の偉人が教える<br /><span className="text-indigo-600">あなたの「才能」鑑定</span></h1>
                <div className="w-32 h-32 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-5xl">🏛️</div>
                <button onClick={() => setIsStarted(true)} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl">診断をはじめる</button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto min-h-screen bg-white pb-20">
            <div className="sticky top-0 bg-white/90 backdrop-blur pt-4 pb-2 px-5 border-b border-slate-100">
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1">
                    <span>PROGRESS</span>
                    <span>{Math.round((Object.keys(answers).length / 40) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${(Object.keys(answers).length / 40) * 100}%` }} />
                </div>
            </div>

            <div className="px-5 py-6">
                {currentPageQuestions.map((q) => (
                    <div key={q.id} className="py-8 border-b border-slate-50 last:border-0">
                        <p className="text-lg font-bold text-slate-800 mb-6">{q.question}</p>
                        <div className="flex justify-between items-center gap-2 max-w-sm mx-auto">
                            <span className="text-[10px] font-bold text-indigo-400">同意</span>
                            {[5, 4, 3, 2, 1].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => handleAnswer(q.id, val)}
                                    className={`w-10 h-10 rounded-full border-2 transition-all ${answers[q.id] === val ? 'bg-indigo-600 border-indigo-600 scale-110 shadow-lg' : 'bg-white border-slate-200'}`}
                                />
                            ))}
                            <span className="text-[10px] font-bold text-slate-400">不同意</span>
                        </div>
                    </div>
                ))}
                <button
                    onClick={nextStep}
                    disabled={currentPageQuestions.some(q => !answers[q.id])}
                    className={`w-full py-5 mt-10 rounded-2xl font-bold transition-all ${currentPageQuestions.every(q => answers[q.id]) ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-300'}`}
                >
                    {isSecondPhase && currentStep === 3 ? '結果を解析する' : '次のステップへ'}
                </button>
            </div>
        </div>
    );
}