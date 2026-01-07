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
        if (isSecondPhase && currentStep === 3) {
            setIsAnalyzing(true);
            localStorage.setItem('diagnosis_answers', JSON.stringify(answers));
            setTimeout(() => router.push('/result'), 1200);
            return;
        }
        setIsTransitioning(true);
        setTimeout(() => {
            if (!isSecondPhase) {
                const groups = Array.from(new Set(questionsData.map(q => q.groupId))).filter(g => g !== 'common' && g !== '');
                setTargetGroupId(groups[0] || "lion");
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
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-bold text-slate-600">深層心理を分析中...</p>
        </div>
    );

    if (!isStarted) return (
        <div className="max-w-2xl mx-auto min-h-screen flex flex-col items-center justify-center px-6 text-center">
            <h1 className="text-3xl font-black mb-6">動物性格診断</h1>
            <div className="text-6xl mb-8">🦁</div>
            <button onClick={() => setIsStarted(true)} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold">診断をはじめる</button>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto min-h-screen pb-20">
            <div className="sticky top-0 bg-white/90 p-4 border-b">
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
            </div>
            <div className={`px-5 py-6 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                {currentPageQuestions.map((q, idx) => (
                    <div key={q.id} className="py-10 border-b border-slate-100 last:border-0">
                        <p className="text-lg font-bold mb-8 text-left">{q.question}</p>
                        <div className="flex justify-between items-center max-w-[280px] mx-auto">
                            {[5, 4, 3, 2, 1].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => handleAnswer(q.id, val)}
                                    className={`rounded-full border-2 transition-all ${answers[q.id] === val ? 'w-10 h-10 bg-indigo-600 border-indigo-600' : 'w-8 h-8 bg-white border-slate-300'}`}
                                />
                            ))}
                        </div>
                    </div>
                ))}
                <button
                    onClick={nextStep}
                    disabled={!currentPageQuestions.every(q => answers[q.id] !== undefined)}
                    className="w-full mt-12 py-4 bg-indigo-600 text-white rounded-xl font-bold disabled:bg-slate-100 disabled:text-slate-300"
                >
                    {isSecondPhase && currentStep === 3 ? '結果を表示する' : '次のステップへ'}
                </button>
            </div>
        </div>
    );
}