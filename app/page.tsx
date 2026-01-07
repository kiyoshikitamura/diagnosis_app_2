'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import questionsData from '@/data/questions.json';

const COMMON_LIMIT = 10;

export default function HomePage() {
    const router = useRouter();
    const [isStarted, setIsStarted] = useState(false);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [isSecondPhase, setIsSecondPhase] = useState(false);
    const [targetGroupId, setTargetGroupId] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const displayQuestions = useMemo(() => {
        if (!isSecondPhase) return questionsData.filter(q => q.groupId === "common").slice(0, COMMON_LIMIT);
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
        if (isSecondPhase && currentStep === 3) {
            setIsAnalyzing(true);
            localStorage.setItem('diagnosis_answers', JSON.stringify(answers));
            setTimeout(() => router.push('/result'), 1500);
            return;
        }
        setIsTransitioning(true);
        setTimeout(() => {
            if (!isSecondPhase) {
                const groups = Array.from(new Set(questionsData.map(q => q.groupId))).filter(g => g !== 'common' && g !== '');
                setTargetGroupId(groups[Math.floor(Math.random() * groups.length)] || "lion");
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

    if (isAnalyzing) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 text-center">
            <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">深層心理を分析中...</h2>
            <p className="text-slate-400 text-sm">あなたに最適な動物タイプを導き出しています</p>
        </div>
    );

    if (!isStarted) return (
        <div className="max-w-2xl mx-auto min-h-screen flex flex-col items-center justify-center px-6 text-center bg-white">
            <div className="space-y-8 animate-in fade-in zoom-in duration-700">
                <h1 className="text-3xl font-black text-slate-800 leading-tight">
                    あなたの内なる動物<br /><span className="text-indigo-600 underline underline-offset-8 decoration-indigo-100">性格診断テスト</span>
                </h1>
                <div className="w-32 h-32 bg-indigo-50 rounded-3xl mx-auto flex items-center justify-center text-5xl shadow-inner">🦁</div>
                <div className="space-y-2">
                    <button onClick={() => setIsStarted(true)} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-indigo-700 active:scale-95 transition-all">
                        診断をはじめる
                    </button>
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Estimated time: 3 mins</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto min-h-screen bg-white pb-20 overflow-x-hidden">
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md pt-4 pb-2 px-4 border-b border-slate-50 shadow-sm">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-bold uppercase">
                    <span>{isSecondPhase ? 'Phase 2' : 'Phase 1'}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className={`px-5 py-6 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                {currentPageQuestions.map((q, idx) => (
                    <div key={q.id} className="py-10 border-b border-slate-100 last:border-0">
                        <p className="text-[17px] font-bold text-slate-800 mb-8 text-left leading-relaxed">
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
                                    const borderColor = val > 3 ? 'border-emerald-300' : val < 3 ? 'border-red-300' : 'border-slate-300';
                                    return (
                                        <button
                                            key={val}
                                            onClick={() => handleAnswer(q.id, val)}
                                            className={`rounded-full border-2 transition-all duration-300 relative ${sizeClass} ${isSelected ? `${activeColor} shadow-md scale-110` : `bg-white ${borderColor}`}`}
                                        >
                                            {isSelected && <span className="absolute inset-0 rounded-full animate-ping bg-current opacity-20"></span>}
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