'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import resultDataRaw from '@/data/result_data.json';
import questionsDataRaw from '@/data/questions.json';

// 型定義
interface Question {
    id: number;
    question: string;
    groupId: string;
}

interface AdContent {
    ad_title: string;
    ad_text: string;
    ad_link_text: string;
}

interface ResultData {
    animal_name: string;
    emoji: string;
    catchphrase: string;
    base_description: string;
    result_text: string;
    monetization: Record<string, AdContent>;
}

// JSONデータを型安全に扱う
const resultData = resultDataRaw as Record<string, ResultData>;
const questionsData = questionsDataRaw as Question[];

export default function ResultPage() {
    const router = useRouter();
    const [result, setResult] = useState<ResultData | null>(null);
    const [adContent, setAdContent] = useState<AdContent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedAnswersStr = localStorage.getItem('diagnosis_answers');
        const userAttribute = localStorage.getItem('user_attribute') || 'cas_male';

        if (!savedAnswersStr) {
            router.push('/');
            return;
        }

        try {
            const answers: Record<string, number> = JSON.parse(savedAnswersStr);

            // MBTI判定ロジック (簡易集計)
            const scores: Record<string, number> = {};

            // questionsDataを元に計算
            Object.entries(answers).forEach(([qId, value]) => {
                const question = questionsData.find((q: Question) => q.id === parseInt(qId));
                if (question && question.groupId !== 'common') {
                    // 本来はここで特性ごとのロジックを組みますが、一旦groupIdごとに加算
                    scores[question.groupId] = (scores[question.groupId] || 0) + value;
                }
            });

            // スコアが最大のMBTIを取得（なければデフォルトentj）
            const topGroupId = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || 'entj';

            const coreData = resultData[topGroupId];
            if (coreData) {
                setResult(coreData);
                setAdContent(coreData.monetization[userAttribute] || coreData.monetization['cas_male']);
            }
        } catch (error) {
            console.error('Analysis error:', error);
            router.push('/');
        } finally {
            setLoading(false);
        }
    }, [router]);

    const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shareText = result ? `私の魂に宿る偉人は「${result.animal_name}」でした！\n#偉人診断 #才能プロファイリング\n` : '';

    const shareOnX = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    const shareOnLine = () => window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');

    if (loading || !result) return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto min-h-screen bg-slate-50 pb-20 font-sans text-slate-900 overflow-x-hidden">
            {/* 診断結果ヘッダー */}
            <div className="bg-gradient-to-b from-indigo-500 to-indigo-600 pt-16 pb-24 px-6 text-center text-white rounded-b-[3rem] shadow-md">
                <p className="text-indigo-100 font-bold tracking-[0.2em] text-[10px] mb-3 uppercase opacity-80">Profiling Complete</p>
                <h1 className="text-3xl font-black mb-1 tracking-tight">
                    あなたは「{result.animal_name}」タイプ
                </h1>
                <p className="text-indigo-50/90 text-sm font-medium italic">{result.catchphrase}</p>
            </div>

            <div className="px-5 -mt-12 space-y-6">
                {/* メイン解説カード */}
                <div className="bg-white rounded-[2.5rem] shadow-sm p-8 space-y-8 border border-white">
                    <div className="w-24 h-24 bg-indigo-50 rounded-3xl mx-auto flex items-center justify-center text-5xl shadow-inner border border-indigo-100/50">
                        {result.emoji}
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-[14px] font-black text-indigo-600 flex items-center justify-center bg-indigo-50/50 py-2.5 rounded-full uppercase tracking-widest">
                                Identity Profile
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-[15px] px-2 text-center font-medium">
                                {result.base_description}
                            </p>
                        </div>

                        <div className="bg-slate-50/80 p-6 rounded-3xl text-slate-600 leading-relaxed text-[14px] whitespace-pre-wrap border border-slate-100">
                            {result.result_text}
                        </div>
                    </div>

                    {/* SNSシェアボタン */}
                    <div className="pt-6 border-t border-slate-50">
                        <p className="text-center text-[10px] font-bold text-slate-300 mb-4 uppercase tracking-widest">Share your result</p>
                        <div className="grid grid-cols-2 gap-3 px-2">
                            <button onClick={shareOnX} className="py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs active:scale-95 transition-all shadow-sm">𝕏でシェア</button>
                            <button onClick={shareOnLine} className="py-4 bg-[#06C755] text-white rounded-2xl font-bold text-xs active:scale-95 transition-all shadow-sm">LINEで送る</button>
                        </div>
                    </div>
                </div>

                {/* 属性別マネタイズ枠 */}
                {adContent && (
                    <div className="bg-white rounded-[2.5rem] p-1.5 border border-indigo-100 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-br from-indigo-50/50 to-white p-7 rounded-[2rem]">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-2.5 py-1 bg-indigo-600 text-white text-[9px] font-black rounded-lg uppercase tracking-wider">For You</span>
                            </div>
                            <h3 className="text-[17px] font-bold mb-2 text-slate-800 tracking-tight">{adContent.ad_title}</h3>
                            <p className="text-slate-500 text-xs mb-6 leading-relaxed">{adContent.ad_text}</p>
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-full py-4.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                            >
                                {adContent.ad_link_text}
                            </a>
                        </div>
                    </div>
                )}

                {/* LINE登録誘導枠 */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-[2.5rem] p-8 text-white text-center shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-lg font-bold mb-2">さらに詳細な鑑定を公開中</h3>
                        <p className="text-xs opacity-90 mb-6 leading-relaxed">
                            公式LINE登録者限定で、あなたの強みを活かす<br />「人生の戦略ロードマップ」を無料配布中。
                        </p>
                        <a
                            href="https://line.me/R/ti/p/YOUR_LINE_ID"
                            className="flex items-center justify-center w-full py-4 bg-white text-green-600 rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-transform"
                        >
                            LINEで公式鑑定を受ける
                        </a>
                    </div>
                    <div className="absolute -right-4 -bottom-4 text-6xl opacity-20 rotate-12">📱</div>
                </div>

                <button
                    onClick={() => router.push('/')}
                    className="w-full py-6 text-slate-300 font-bold text-xs tracking-[0.2em] hover:text-indigo-500 transition-colors uppercase"
                >
                    ← Retake Profiling
                </button>
            </div>
        </div>
    );
}