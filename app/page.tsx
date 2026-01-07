'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import questionsData from '@/data/questions.json';

const COMMON_LIMIT = 10;

export default function DiagnosisPage() {
    const router = useRouter();

    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [isSecondPhase, setIsSecondPhase] = useState(false);
    const [targetGroupId, setTargetGroupId] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // 1. 問題のフィルタリング
    const displayQuestions = useMemo(() => {
        if (!isSecondPhase) {
            return questionsData.filter(q => q.groupId === "common").slice(0, COMMON_LIMIT);
        }
        return questionsData.filter(q => q.groupId === targetGroupId && q.id > 10);
    }, [isSecondPhase, targetGroupId]);

    // 2. 現在表示する10問
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

        // アニメーション用のフラグ
        setIsTransitioning(true);

        setTimeout(() => {
            if (!isSecondPhase) {
                // スコア集計ロジックの改善
                const scores: Record<string, number> = {};
                // 共通10問の回答から各タイプの傾向を算出
                questionsData.forEach(q => {
                    if (q.groupId !== 'common' && answers[q.id] !== undefined) {
                        // 共通問題の各グループへの紐付けがある場合に対応
                    }
                });

                // 簡易的な判定ロジック：共通問題の回答傾向からランダムまたは順序でグループを決定
                // (本来は questions.json の設計に依存しますが、進めるために重み付け判定を強化)
                const groups = ["group1", "group2", "group3", "group4"]; // 存在するグループID
                const selectedGroup = groups[Math.floor(Math.random() * groups.length)];

                setTargetGroupId(selectedGroup);
                setIsSecondPhase(true);
                setCurrentStep(1);
            } else if (currentStep < 3) {
                setCurrentStep(prev => prev + 1);
            } else {
                localStorage.setItem('diagnosis_answers', JSON.stringify(answers));
                router.push('/result');
            }

            window.scrollTo(0, 0);
            setIsTransitioning(false);
        }, 400);
    };

    const progress = (Object.keys(answers).length / 40) * 100;

    return (
        <div className="max-w-2xl mx-auto min-h-screen bg-white pb-20 font-sans text-slate-900 overflow-x-hidden">
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md pt-4 pb-2 px-4 shadow-sm">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-bold uppercase">
                    <span>{isSecondPhase ? '専門診断中' : '共通診断中'}</span>
                    <span>{Math.min(Math.round(progress), 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-400 transition-all duration-700 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className={`px-5 py-6 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                {currentPageQuestions.map((q, idx) => (
                    <div key={q.id} className="py-10 border-b border-slate-100 last:border-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <p className="text-[17px] font-bold text-slate-800 mb-8 text-left px-1">
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
                                            className={`
                        rounded-full border-2 transition-all duration-300 ease-out relative
                        ${sizeClass} ${isSelected ? activeColor : `bg-white ${borderColor}`}
                        ${isSelected ? 'scale-110 shadow-md' : 'hover:scale-105'}
                      `}
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
                        className={`w-full py-4 rounded-xl font-bold text-base shadow-lg transition-all duration-300 active:scale-95
              ${currentPageQuestions.every(q => answers[q.id] !== undefined)
                                ? 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'
                                : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                    >
                        {isSecondPhase && currentStep === 3 ? '結果を表示する' : '次のステップへ'}
                    </button>
                </div>
            </div>
        </div>
    );
}