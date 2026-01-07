'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import questionsData from '@/data/questions.json';

const QUESTIONS_PER_PAGE = 10;

export default function DiagnosisPage() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(0);
    const [answers, setAnswers] = useState<number[]>(new Array(questionsData.length).fill(null));

    const answeredCount = answers.filter(a => a !== null).length;
    const progress = (answeredCount / questionsData.length) * 100;

    const handleAnswer = (qIndex: number, value: number) => {
        const newAnswers = [...answers];
        newAnswers[qIndex] = value;
        setAnswers(newAnswers);
    };

    const nextStep = () => {
        if (currentPage < Math.ceil(questionsData.length / QUESTIONS_PER_PAGE) - 1) {
            setCurrentPage(currentPage + 1);
            window.scrollTo(0, 0);
        } else {
            completeDiagnosis();
        }
    };

    const completeDiagnosis = () => {
        localStorage.setItem('diagnosis_answers', JSON.stringify(answers));
        router.push('/result');
    };

    const startIndex = currentPage * QUESTIONS_PER_PAGE;
    const currentQuestions = questionsData.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
    const isPageComplete = currentQuestions.every((_, i) => answers[startIndex + i] !== null);

    return (
        <div className="max-w-2xl mx-auto min-h-screen bg-white pb-20 font-sans text-slate-900">
            {/* 固定プログレスバー */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md pt-4 pb-2 px-4 shadow-sm">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-bold uppercase tracking-wider">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-400 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="px-5 py-6">
                {currentQuestions.map((q, i) => {
                    const globalIndex = startIndex + i;
                    return (
                        <div key={globalIndex} className="py-10 border-b border-slate-100 last:border-0">
                            {/* 設問を左揃えに変更 */}
                            <p className="text-[17px] font-bold text-slate-800 mb-8 leading-relaxed text-left px-1">
                                <span className="text-indigo-500 mr-2 text-sm font-mono opacity-50">{(globalIndex + 1).toString().padStart(2, '0')}</span>
                                {q.question}
                            </p>

                            {/* 5段階円形ボタン（横並びテキスト版） */}
                            <div className="flex items-center justify-center gap-3 max-w-lg mx-auto">

                                {/* 左側：そう思う */}
                                <span className="text-[10px] sm:text-[12px] font-bold text-emerald-500 w-10 sm:w-14 text-center leading-tight shrink-0">
                                    そう思う
                                </span>

                                <div className="flex items-center justify-between flex-1 relative px-1 max-w-[260px]">
                                    {/* 中央のライン */}
                                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-200 -translate-y-1/2 -z-10"></div>

                                    {[5, 4, 3, 2, 1].map((val) => {
                                        const sizeClass = val === 5 || val === 1 ? 'w-10 h-10' :
                                            val === 4 || val === 2 ? 'w-8 h-8' :
                                                'w-6 h-6';

                                        const borderColor = val > 3 ? 'border-emerald-300' : val < 3 ? 'border-red-300' : 'border-slate-300';
                                        const activeBg = val > 3 ? 'bg-emerald-400 border-emerald-400' :
                                            val < 3 ? 'bg-red-400 border-red-400' :
                                                'bg-slate-400 border-slate-400';

                                        return (
                                            <button
                                                key={val}
                                                onClick={() => handleAnswer(globalIndex, val)}
                                                className={`
                          rounded-full border-2 transition-all duration-200 active:scale-90 bg-white
                          ${sizeClass} ${borderColor}
                          ${answers[globalIndex] === val ? activeBg : 'hover:border-slate-400'}
                        `}
                                            />
                                        );
                                    })}
                                </div>

                                {/* 右側：そう思わない */}
                                <span className="text-[10px] sm:text-[12px] font-bold text-red-500 w-10 sm:w-14 text-center leading-tight shrink-0">
                                    そう思わない
                                </span>
                            </div>
                        </div>
                    );
                })}

                <div className="mt-12 px-2">
                    <button
                        onClick={nextStep}
                        disabled={!isPageComplete}
                        className={`
              w-full py-4 rounded-xl font-bold text-base shadow-lg transition-all duration-300
              ${isPageComplete ? 'bg-indigo-600 text-white shadow-indigo-100 active:translate-y-0.5' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}
            `}
                    >
                        {currentPage === Math.ceil(questionsData.length / QUESTIONS_PER_PAGE) - 1 ? '診断結果を表示する' : '次の10問へ'}
                    </button>
                </div>
            </div>
        </div>
    );
}