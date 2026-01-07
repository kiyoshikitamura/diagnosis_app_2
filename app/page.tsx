'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import questionsData from '@/data/questions.json';

const COMMON_LIMIT = 10;

export default function DiagnosisPage() {
    const router = useRouter();

    const [isStarted, setIsStarted] = useState(false);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [isSecondPhase, setIsSecondPhase] = useState(false);
    const [targetGroupId, setTargetGroupId] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false); // 分析中フラグを追加

    const displayQuestions = useMemo(() => {
        if (!isSecondPhase) {
            return questionsData.filter(q => q.groupId === "common").slice(0, COMMON_LIMIT);
        }
        const filtered = questionsData.filter(q => q.groupId === targetGroupId && q.groupId !== "common");
        return filtered.length > 0 ? filtered : questionsData.slice(10, 40);
    }, [isSecondPhase, targetGroupId]);

    const currentPageQuestions = useMemo(() => {
        const start = currentStep === 0 ? 0 : (currentStep - 1) * 10;
        return displayQuestions.slice(start, start + 10);
    }, [displayQuestions, currentStep]);

    const handleAnswer = (questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const nextStep = () => {
        const allAnswered = currentPageQuestions.every(q => answers[q.id] !== undefined);
        if (!allAnswered) return;

        // 最後のページの「結果を表示する」を押した場合
        if (isSecondPhase && currentStep === 3) {
            setIsAnalyzing(true); // 即座に分析中画面へ
            localStorage.setItem('diagnosis_answers', JSON.stringify(answers));

            // 少しだけ「分析中」を見せてから遷移（高級感を出す演出）
            setTimeout(() => {
                router.push('/result');
            }, 1200);
            return;
        }

        // それ以外の「次のステップへ」の場合
        setIsTransitioning(true);
        setTimeout(() => {
            if (!isSecondPhase) {
                const allGroups = Array.from(new Set(questionsData.map(q => q.groupId))).filter(g => g !== 'common' && g !== '');
                const selectedGroup = allGroups.length > 0 ? allGroups[Math.floor(Math.random() * allGroups.length)] : "lion";
                setTargetGroupId(selectedGroup);
                setIsSecondPhase(true);
                setCurrentStep(1);
            } else {
                setCurrentStep(prev => prev + 1);
            }
            window.scrollTo(0, 0);
            setIsTransitioning(false);
        }, 400);
    };

    const progress = (Object.keys(answers).length / 40) * 100;

    // --- ローディング画面（分析中） ---
    if (isAnalyzing) {
        return (
            <div className="max-w-2xl mx-auto min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
                <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">深層心理を分析中...</h2>
                <p className="text-slate-400 text-sm">まもなくあなたの動物タイプが判明します</p>
            </div>
        );
    }

    // --- 開始画面 ---
    if (!isStarted) {
        return (
            <div className="max-w-2xl mx-auto min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 font-sans text-slate-900">
                <div className="w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
                    <div className="space-y-4">
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">
                            あなたの内なる動物<br /><span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">性格診断テスト</span>
                        </h1>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                            40個の質問に答えるだけで、あなたの深層心理に隠れた「動物タイプ」が明らかになります。
                        </p>
                    </div>
                    <div className="py-10">
                        <div className="w-32 h-32 bg-indigo-50 rounded-3xl mx-auto flex items-center justify-center mb-4">
                            <span className="text-5xl">🦁</span>
                        </div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Estimated time: 3 mins</p>
                    </div>
                    <button
                        onClick={() => setIsStarted(true)}
                        className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all duration-200"
                    >
                        診断をはじめる
                    </button>
                </div>
            </div>
        );
    }

    // --- 診断メイン ---
    return (
        <div className="max-w-2xl mx-auto min-h-screen bg-white pb-20 font-sans text-slate-900 overflow-x-hidden">
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md pt-4 pb-2 px-4 shadow-sm border-b border-slate-50">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-bold">
                    <span>{isSecondPhase ? `Phase 2` : 'Phase 1: Common'}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className={`px-5 py-6 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                {currentPageQuestions.map((q, idx) => (
                    <div key={q.id} className="py-10 border-b border-slate-100 last:border-0">
                        <p className="text-[17px] font-bold text-slate-800 mb-8 text-left px-1 leading-relaxed">
                            <span className="text-indigo-500 mr-2 text-sm font-mono opacity-50">
                                {(isSecondPhase ? 10 + (currentStep - 1) * 10 + idx + 1 : idx + 1).toString().padStart(2, '0')}
                            </span>
                            {q.question}
                        </p>
                        <div className="flex items-center justify-center gap-3 max-w-lg mx-auto">
                            <span className="text-[10px] font-bold text-emerald-500 w-10 text-center leading-tight">そう思う</span>
                            <div className="flex items-center justify-between flex-1 relative px-1 max-w-[260px]">
                                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-200 -translate-y-1/2 -z-10"></div>
                                {[5, 4, 3, 2, 1].map((val) => {
                                    const isSelected = answers[q.id] === val;
                                    const sizeClass = val === 5 || val === 1 ? 'w-10 h-10' : val === 4 || val === 2 ? 'w-8 h-8' : 'w-6 h-6';
                                    const activeColor = val > 3 ? 'bg-emerald-500 border-emerald-500' : val < 3 ? 'bg-red-500 border-red-500' : 'bg-slate-500 border-slate-500';

                                    return (
                                        <button
                                            key={val}
                                            onClick={() => handleAnswer(q.id, val)}
                                            className={`rounded-full border-2 transition-all duration-300 relative ${sizeClass} ${isSelected ? `${activeColor} shadow-md scale-110` : 'bg-white border-slate-300'}`}
                                        >
                                            {isSelected && (
                                                <span className="absolute inset-0 rounded-full animate-ping bg-current opacity-20"></span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            <span className="text-[10px] font-bold text-red-500 w-10 text-center leading-tight">そう思わない</span>
                        </div>
                    </div>
                ))}

                <div className="mt-12 px-2">
                    <button
                        onClick={nextStep}
                        disabled={!currentPageQuestions.every(q => answers[q.id] !== undefined)}
                        className={`w-full py-4 rounded-xl font-bold text-base shadow-lg transition-all ${currentPageQuestions.every(q => answers[q.id] !== undefined) ? 'bg-indigo-600 text-white active:scale-95' : 'bg-slate-100 text-slate-300'}`}
                    >
                        {isSecondPhase && currentStep === 3 ? '結果を解析する' : '次のステップへ'}
                    </button>
                </div>
            </div>
        </div>
    );
}