'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import questionsData from '@/data/questions.json';

const COMMON_LIMIT = 10; // 共通問題数

export default function DiagnosisPage() {
    const router = useRouter();

    // 1. 状態管理
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [isSecondPhase, setIsSecondPhase] = useState(false);
    const [targetGroupId, setTargetGroupId] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0); // 0: 共通, 1: 個別前半, 2: 個別中盤, 3: 個別後半（10問ずつ）

    // 2. 問題のフィルタリング（メモ化して再計算を最適化）
    const displayQuestions = useMemo(() => {
        if (!isSecondPhase) {
            return questionsData.filter(q => q.groupId === "common").slice(0, COMMON_LIMIT);
        }
        // 特定のグループの個別問題（ID 11以降）を取得
        return questionsData.filter(q => q.groupId === targetGroupId && q.id > 10);
    }, [isSecondPhase, targetGroupId]);

    // 3. 現在のページに表示する10問
    const currentPageQuestions = useMemo(() => {
        const start = currentStep === 0 ? 0 : (currentStep - 1) * 10;
        return displayQuestions.slice(start, start + 10);
    }, [displayQuestions, currentStep]);

    // 4. 回答ハンドラー
    const handleAnswer = (questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    // 5. 次のステップへ
    const nextStep = () => {
        const allAnswered = currentPageQuestions.every(q => answers[q.id] !== undefined);
        if (!allAnswered) return;

        if (!isSecondPhase) {
            // 共通10問終了時の判定
            const scores: Record<string, number> = {};
            displayQuestions.forEach(q => {
                scores[q.groupId] = (scores[q.groupId] || 0) + (answers[q.id] || 0);
            });
            // 最もスコアが高いグループ（common以外）を探す
            const topGroup = Object.entries(scores)
                .filter(([id]) => id !== 'common')
                .sort((a, b) => b[1] - a[1])[0][0];

            setTargetGroupId(topGroup);
            setIsSecondPhase(true);
            setCurrentStep(1);
        } else if (currentStep < 3) {
            // 個別問題の次ページへ
            setCurrentStep(prev => prev + 1);
        } else {
            // 全終了
            localStorage.setItem('diagnosis_answers', JSON.stringify(answers));
            router.push('/result');
        }
        window.scrollTo(0, 0);
    };

    const progress = ((Object.keys(answers).length) / 40) * 100;

    return (
        <div className="max-w-2xl mx-auto min-h-screen bg-white pb-20 font-sans text-slate-900">
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md pt-4 pb-2 px-4 shadow-sm">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-bold uppercase">
                    <span>{isSecondPhase ? '専門診断' : '共通診断'}</span>
                    <span>{Math.min(Math.round(progress), 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className="px-5 py-6">
                {currentPageQuestions.map((q, idx) => (
                    <div key={q.id} className="py-10 border-b border-slate-100 last:border-0">
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

                                    // カラー設定
                                    const baseBorderColor = val > 3 ? 'border-emerald-300' : val < 3 ? 'border-red-300' : 'border-slate-300';
                                    const activeBgColor = val > 3 ? 'bg-emerald-500' : val < 3 ? 'bg-red-500' : 'bg-slate-500';

                                    return (
                                        <button
                                            key={val}
                                            onClick={() => handleAnswer(q.id, val)}
                                            className={`
                        rounded-full border-2 transition-all duration-150 active:scale-95
                        ${sizeClass} ${baseBorderColor}
                        ${isSelected ? `${activeBgColor} border-transparent shadow-inner` : 'bg-white'}
                      `}
                                        />
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
                        className={`w-full py-4 rounded-xl font-bold text-base shadow-lg transition-all
              ${currentPageQuestions.every(q => answers[q.id] !== undefined)
                                ? 'bg-indigo-600 text-white shadow-indigo-100'
                                : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                    >
                        {isSecondPhase && currentStep === 3 ? '結果を表示する' : '次のステップへ'}
                    </button>
                </div>
            </div>
        </div>
    );
}