'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
// パスが正しいか確認してください
import questionsData from '../data/questions.json';

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

    // --- ロジック部分は前回のものを維持 ---
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

        if (isSecondPhase && currentStep === 3) {
            setIsAnalyzing(true);
            localStorage.setItem('diagnosis_answers', JSON.stringify(answers));
            setTimeout(() => {
                router.push('/result');
            }, 1200);
            return;
        }

        setIsTransitioning(true);
        setTimeout(() => {
            if (!isSecondPhase) {
                const allGroups = Array.from(new Set(questionsData.map(q => q.groupId))).filter(g => g !== 'common' && g !== '');
                const selectedGroup = allGroups.length > 0 ? allGroups[0] : "lion";
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

    if (isAnalyzing) {
        return (
            <div className="max-w-2xl mx-auto min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
                <div className="relative w-20 h-20 mb-8">
                    <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h2 className="text-xl font-bold text-slate-800">分析中...</h2>
            </div>
        );
    }

    if (!isStarted) {
        return (
            <div className="max-w-2xl mx-auto min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
                <div className="text-center space-y-8 animate-in fade-in duration-700">
                    <h1 className="text-3xl font-black text-slate-800 leading-tight">
                        あなたの内なる動物<br /><span className="text-indigo-600">性格診断テスト</span>
                    </h1>
                    <div className="w-32 h-32 bg-indigo-50 rounded-3xl mx-auto flex items-center justify-center text-5xl">🦁</div>
                    <button
                        onClick={() => setIsStarted(true)}
                        className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-all"
                    >
                        診断をはじめる
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto min-h-screen bg-white pb-20 overflow-x-hidden">
            {/* 診断UIを表示 */}
            <div className="sticky top-0 z-10 bg-white/95 pt-4 pb-2 px-4 border-b border-slate-50">
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
            </div>
            <div className={`px-5 py-6 transition-all duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                {currentPageQuestions.map((q, idx) => (
                    <div key={q.id} className="py-10 border-b border-slate-100 last:border-0">
                        <p className="text-[17px] font-bold text-slate-800 mb-8 text-left">
                            {q.question}
                        </p>
                        {/* 5段階ボタンのコード ... */}
                        <div className="flex items-center justify-center gap-3">
                            {/* 以前のボタンUIをここに維持 */}
                            {[5, 4, 3, 2, 1].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => handleAnswer(q.id, val)}
                                    className={`w-10 h-10 rounded-full border-2 ${answers[q.id] === val ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-200'}`}
                                />
                            ))}
                        </div>
                    </div>
                ))}
                <button onClick={nextStep} className="w-full mt-10 py-4 bg-indigo-600 text-white rounded-xl font-bold">
                    {isSecondPhase && currentStep === 3 ? '結果を表示する' : '次のステップへ'}
                </button>
            </div>
        </div>
    );
}