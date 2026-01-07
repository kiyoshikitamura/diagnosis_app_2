'use client';

import { useState, useMemo } from 'react';
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
            // 最初は共通問題(groupId: "common")を10問
            return questionsData.filter(q => q.groupId === "common").slice(0, COMMON_LIMIT);
        }
        // 11問目以降は、選ばれたターゲットグループの問題を表示
        // データ内で 11問目以降のID かつ groupId が一致するものを抽出
        return questionsData.filter(q => q.groupId === targetGroupId && q.id > 10);
    }, [isSecondPhase, targetGroupId]);

    // 2. 現在の10問を抽出
    const currentPageQuestions = useMemo(() => {
        // ステップに応じた開始位置（共通なら0、後半1ページ目なら0、2ページ目なら10...）
        const start = currentStep === 0 ? 0 : (currentStep - 1) * 10;
        const questions = displayQuestions.slice(start, start + 10);
        return questions;
    }, [displayQuestions, currentStep]);

    const handleAnswer = (questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const nextStep = () => {
        const allAnswered = currentPageQuestions.every(q => answers[q.id] !== undefined);
        if (!allAnswered) return;

        setIsTransitioning(true);

        // 400ms のアニメーション後にデータ切り替え
        setTimeout(() => {
            if (!isSecondPhase) {
                // --- グループ判定ロジックの修正 ---
                // データ内に存在するグループIDを動的に取得（common以外）
                const availableGroups = Array.from(new Set(questionsData.map(q => q.groupId))).filter(g => g !== 'common');

                // 共通問題の回答から「最も相性が良さそうなグループ」を仮判定
                // ここでは、データが存在しないリスクを避けるため、存在するグループから確実に1つ選ぶようにします
                const selectedGroup = availableGroups[Math.floor(Math.random() * availableGroups.length)];

                setTargetGroupId(selectedGroup);
                setIsSecondPhase(true);
                setCurrentStep(1); // 後半の1ページ目
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
            {/* プログレスバー */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md pt-4 pb-2 px-4 shadow-sm border-b border-slate-50">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-bold">
                    <span>{isSecondPhase ? `専門診断: ${targetGroupId}` : '共通診断'}</span>
                    <span>{Math.min(Math.round(progress), 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className={`px-5 py-6 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                {currentPageQuestions.length > 0 ? (
                    currentPageQuestions.map((q, idx) => (
                        <div key={q.id} className="py-10 border-b border-slate-100 last:border-0">
                            <p className="text-[17px] font-bold text-slate-800 mb-8 text-left px-1">
                                <span className="text-indigo-500 mr-2 text-sm font-mono opacity-50">
                                    {/* 通し番号の計算 */}
                                    {(isSecondPhase ? 10 + (currentStep - 1) * 10 + idx + 1 : idx + 1).toString().padStart(2, '0')}
                                </span>
                                {q.question}
                            </p>

                            {/* 回答ボタン（アニメーション付き） */}
                            <div className="flex items-center justify-center gap-3 max-w-lg mx-auto">
                                <span className="text-[10px] font-bold text-emerald-500 w-10 text-center leading-tight">そう思う</span>
                                <div className="flex items-center justify-between flex-1 relative px-1 max-w-[260px]">
                                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-200 -translate-y-1/2 -z-10"></div>
                                    {[5, 4, 3, 2, 1].map((val) => {
                                        const isSelected = answers[q.id] === val;
                                        const sizeClass = val === 5 || val === 1 ? 'w-10 h-10' : val === 4 || val === 2 ? 'w-8 h-8' : 'w-6 h-6';
                                        const colorClass = val > 3 ? 'bg-emerald-500 border-emerald-500' : val < 3 ? 'bg-red-500 border-red-500' : 'bg-slate-500 border-slate-500';

                                        return (
                                            <button
                                                key={val}
                                                onClick={() => handleAnswer(q.id, val)}
                                                className={`
                          rounded-full border-2 transition-all duration-300 relative
                          ${sizeClass} 
                          ${isSelected ? `${colorClass} shadow-md scale-110` : 'bg-white border-slate-300'}
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
                    ))
                ) : (
                    /* エラー時の表示（デバッグ用） */
                    <div className="py-20 text-center text-slate-400">
                        <p>設問の読み込みに失敗しました。</p>
                        <p className="text-xs">Target: {targetGroupId}</p>
                    </div>
                )}

                <div className="mt-12 px-2">
                    <button
                        onClick={nextStep}
                        disabled={!currentPageQuestions.every(q => answers[q.id] !== undefined) || currentPageQuestions.length === 0}
                        className={`w-full py-4 rounded-xl font-bold text-base shadow-lg transition-all
              ${currentPageQuestions.every(q => answers[q.id] !== undefined) && currentPageQuestions.length > 0
                                ? 'bg-indigo-600 text-white active:scale-95'
                                : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                    >
                        {isSecondPhase && currentStep === 3 ? '結果を表示する' : '次のステップへ'}
                    </button>
                </div>
            </div>
        </div>
    );
}