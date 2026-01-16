'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import questionsDataRaw from '@/data/questions.json';

interface Question {
    id: number;
    question: string;
    groupId: string;
}

const questionsData = questionsDataRaw as Question[];

export default function QuizPage() {
    const router = useRouter();
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [isSecondPhase, setIsSecondPhase] = useState(false);
    const [userAttribute, setUserAttribute] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // MBTI判定ロジック
    const calculateMBTI = (allAnswers: Record<number, number>) => {
        let scores = { EI: 0, SN: 0, TF: 0, JP: 0 };
        Object.entries(allAnswers).forEach(([id, value]) => {
            const qId = parseInt(id);
            if (qId <= 10) return;
            const score = value - 3;
            if (qId % 4 === 1) scores.EI += score;
            else if (qId % 4 === 2) scores.SN += score;
            else if (qId % 4 === 3) scores.TF += score;
            else scores.JP += score;
        });
        return [
            scores.EI >= 0 ? 'e' : 'i',
            scores.SN >= 0 ? 'n' : 's',
            scores.TF >= 0 ? 'f' : 't',
            scores.JP >= 0 ? 'j' : 'p'
        ].join('');
    };

    // 属性判定ロジック
    const determineAttribute = (allAnswers: Record<number, number>) => {
        const genderScore = ([1, 2, 3, 4, 5].reduce((acc, id) => acc + (allAnswers[id] || 3), 0)) / 5;
        const classScore = ([6, 7, 8, 9, 10].reduce((acc, id) => acc + (allAnswers[id] || 3), 0)) / 5;
        const isMale = genderScore >= 3;
        const isHigh = classScore >= 3;
        if (isHigh && isMale) return 'high_male';
        if (isHigh && !isMale) return 'high_female';
        if (!isHigh && isMale) return 'cas_male';
        return 'cas_female';
    };

    const nextStep = () => {
        if (!isSecondPhase) {
            const attr = determineAttribute(answers);
            setUserAttribute(attr);
            setIsSecondPhase(true);
            setCurrentStep(1);
        } else if (currentStep < 2) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsAnalyzing(true);
            localStorage.setItem('diagnosis_answers', JSON.stringify(answers));
            localStorage.setItem('user_attribute', userAttribute || 'cas_male');
            const topGroupId = calculateMBTI(answers);
            setTimeout(() => {
                window.location.href = `/result?type=${topGroupId}&v=${new Date().getTime()}`;
            }, 2200);
        }
        window.scrollTo(0, 0);
    };

    // --- 修正箇所: 確実にページと状態をリセットする ---
    const resetQuiz = () => {
        if (confirm('診断を最初からやり直しますか？')) {
            window.location.href = '/quiz';
        }
    };

    const displayQuestions = useMemo(() => {
        if (!isSecondPhase) return questionsData.filter(q => q.groupId === "common").slice(0, 10);
        return questionsData.filter(q => q.groupId === userAttribute).slice(0, 20);
    }, [isSecondPhase, userAttribute]);

    const currentPageQuestions = useMemo(() => {
        const start = isSecondPhase ? (currentStep - 1) * 10 : 0;
        return displayQuestions.slice(start, start + 10);
    }, [displayQuestions, currentStep, isSecondPhase]);

    const totalAnswered = Object.keys(answers).length;

    // 解析中画面
    if (isAnalyzing) {
        return (
            <div className="max-w-2xl mx-auto min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tighter">深層心理を解析中...</h2>
                <p className="text-xs text-slate-400 mt-2 tracking-widest font-medium">歴史のデータベースと照合しています</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto min-h-screen bg-slate-50 pb-20 font-sans overflow-x-hidden text-slate-900">
            {/* プログレスバー（数値付き） */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm pt-4 pb-3 px-5 border-b border-slate-100 z-10">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-black text-indigo-600 tracking-widest uppercase">Progress</span>
                    <span className="text-xs font-bold text-slate-600">{totalAnswered} / 30</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-700 ease-out" style={{ width: `${(totalAnswered / 30) * 100}%` }} />
                </div>
            </div>

            <div className="px-5 py-6 space-y-4">
                {currentPageQuestions.map((q, index) => {
                    const qNumber = isSecondPhase ? (currentStep - 1) * 10 + (index + 1) + 10 : index + 1;
                    return (
                        <div key={q.id} className="bg-white rounded-[2rem] p-7 shadow-sm border border-slate-50">
                            <p className="text-[15px] font-bold text-slate-700 mb-10 leading-relaxed text-center">
                                <span className="text-indigo-500 mr-2 text-xs uppercase italic">Q.{qNumber}</span><br />
                                {q.question}
                            </p>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center max-w-sm mx-auto">
                                    <span className="text-[10px] font-bold text-slate-400">そう思う</span>
                                    <span className="text-[10px] font-bold text-slate-400">そう思わない</span>
                                </div>
                                <div className="flex justify-between items-center max-w-sm mx-auto px-1">
                                    {[
                                        { val: 5, size: 'w-11 h-11' },
                                        { val: 4, size: 'w-9 h-9' },
                                        { val: 3, size: 'w-7 h-7' },
                                        { val: 2, size: 'w-9 h-9' },
                                        { val: 1, size: 'w-11 h-11' }
                                    ].map((item) => (
                                        <button
                                            key={item.val}
                                            onClick={() => setAnswers(prev => ({ ...prev, [q.id]: item.val }))}
                                            className={`rounded-full border-2 transition-all duration-200 flex items-center justify-center ${item.size} ${answers[q.id] === item.val
                                                    ? 'bg-indigo-600 border-indigo-600 ring-4 ring-indigo-50'
                                                    : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div className="pt-6 space-y-6 text-center">
                    <button
                        onClick={nextStep}
                        disabled={currentPageQuestions.some(q => !answers[q.id])}
                        className={`w-full py-5 rounded-2xl font-black text-sm transition-all shadow-xl ${currentPageQuestions.every(q => answers[q.id])
                                ? 'bg-slate-900 text-white active:scale-95'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                            }`}
                    >
                        {isSecondPhase && currentStep === 2 ? '結果を解析する' : '次の設問へ'}
                    </button>

                    <button
                        onClick={resetQuiz}
                        className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest border-b border-transparent hover:border-indigo-600 pb-0.5"
                    >
                        診断を最初からやり直す
                    </button>
                </div>
            </div>

            <footer className="mt-12 py-10 px-6 text-center border-t border-slate-100">
                <div className="flex justify-center gap-6 mb-6">
                    <a href="/privacy" className="text-[10px] font-bold text-slate-400 hover:text-slate-600 tracking-tighter">プライバシーポリシー</a>
                    <a href="/terms" className="text-[10px] font-bold text-slate-400 hover:text-slate-600 tracking-tighter">利用規約</a>
                    <a href="/about" className="text-[10px] font-bold text-slate-400 hover:text-slate-600 tracking-tighter">運営者情報</a>
                </div>
                <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">© 偉人診断プロファイリング</p>
            </footer>
        </div>
    );
}