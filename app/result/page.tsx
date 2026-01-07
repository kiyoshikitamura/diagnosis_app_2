'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import resultDataRaw from '@/data/result_data.json';
import questionsData from '@/data/questions.json';

// 型エラーを回避するための定義
const resultData = resultDataRaw as Record<string, any>;

export default function ResultPage() {
    const router = useRouter();
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedAnswers = localStorage.getItem('diagnosis_answers');

        if (!savedAnswers) {
            router.push('/diagnosis');
            return;
        }

        try {
            const answers = JSON.parse(savedAnswers);
            const scores: Record<string, number> = {};

            // スコア集計
            Object.entries(answers).forEach(([qId, value]) => {
                const question = questionsData.find(q => q.id === parseInt(qId));
                if (question && question.groupId !== 'common') {
                    scores[question.groupId] = (scores[question.groupId] || 0) + (value as number);
                }
            });

            // 最もスコアが高いグループIDを取得
            const topGroupId = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0];

            // JSONがオブジェクト形式なので、直接キーでアクセス
            // topGroupId が無い場合や、データに存在しない場合のセーフティ
            const finalResult = topGroupId && resultData[topGroupId]
                ? resultData[topGroupId]
                : Object.values(resultData)[0]; // 見つからない場合は最初のデータを表示

            setResult(finalResult);
        } catch (error) {
            console.error("Result calculation error:", error);
        } finally {
            setLoading(false);
        }
    }, [router]);

    if (loading) return <div className="flex items-center justify-center min-h-screen font-bold text-slate-400">分析中...</div>;
    if (!result) return <div className="p-10 text-center">結果データが読み込めませんでした。</div>;

    return (
        <div className="max-w-2xl mx-auto min-h-screen bg-slate-50 pb-20 font-sans">
            {/* ヘッダー */}
            <div className="bg-indigo-600 pt-16 pb-24 px-6 text-center text-white rounded-b-[3rem] shadow-xl">
                <p className="text-indigo-200 font-bold tracking-widest text-xs mb-2 uppercase">Your Animal Type</p>
                <h1 className="text-3xl font-black mb-2 tracking-tight">
                    あなたは「{result.animal_name}」タイプ
                </h1>
                <p className="text-indigo-100 text-sm opacity-90 font-medium">
                    {result.ad_title || "あなたの個性が明らかに"}
                </p>
            </div>

            {/* メインカード */}
            <div className="px-6 -mt-12">
                <div className="bg-white rounded-3xl shadow-lg p-8 space-y-8 border border-white">

                    {/* 画像表示エリア（animal_idに基づいて表示可能） */}
                    <div className="w-40 h-40 bg-gradient-to-br from-indigo-50 to-slate-50 rounded-full mx-auto flex items-center justify-center text-6xl shadow-inner border-4 border-white">
                        {/* 画像ができるまではIDを表示 */}
                        <span className="text-xs font-black text-indigo-200 uppercase">{result.animal_id}</span>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center">
                                <span className="w-1.5 h-6 bg-indigo-500 rounded-full mr-3"></span>
                                基本的な性格
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-[15px] bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                {result.base_description}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center">
                                <span className="w-1.5 h-6 bg-emerald-400 rounded-full mr-3"></span>
                                詳しい診断結果
                            </h2>
                            <div className="text-slate-600 leading-relaxed text-[15px] whitespace-pre-wrap">
                                {result.result_text}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50">
                        <button
                            onClick={() => router.push('/diagnosis')}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-base hover:bg-slate-800 active:scale-95 transition-all shadow-lg"
                        >
                            もう一度診断する
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}