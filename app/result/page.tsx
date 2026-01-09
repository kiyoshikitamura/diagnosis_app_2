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

const resultData = resultDataRaw as Record<string, ResultData>;
const questionsData = questionsDataRaw as Question[];

export default function ResultPage() {
    const router = useRouter();
    const [result, setResult] = useState<ResultData | null>(null);
    const [adContent, setAdContent] = useState<AdContent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const processResult = () => {
            try {
                const savedAnswersStr = localStorage.getItem('diagnosis_answers');
                const userAttribute = localStorage.getItem('user_attribute') || 'cas_male';

                if (!savedAnswersStr) {
                    router.push('/');
                    return;
                }

                const answers: Record<string, number> = JSON.parse(savedAnswersStr);
                const mbtiList = ["entj", "estj", "enfj", "infj", "intj", "estp", "entp", "intp", "istj", "esfj", "isfj", "istp", "infp", "enfp", "esfp", "isfp"];

                // 判定ロジック：回答の合計からインデックスを算出
                const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
                const mbtiIndex = totalScore % mbtiList.length;
                const topGroupId = mbtiList[mbtiIndex];

                // --- 安全なデータ取得ロジック ---
                // 1. 指定のIDで取得を試みる
                let coreData = resultData[topGroupId];

                // 2. もし見つからなければ、JSONの最初のデータを使う
                if (!coreData) {
                    const firstKey = Object.keys(resultData)[0];
                    coreData = resultData[firstKey];
                }

                if (coreData) {
                    setResult(coreData);

                    // 3. 広告データの取得（オプショナルチェーン ?. でクラッシュを防止）
                    // 属性に一致するものがなければ、monetizationの中の最初のデータを使う
                    const selectedAd = coreData.monetization?.[userAttribute] ||
                        Object.values(coreData.monetization || {})[0];

                    setAdContent(selectedAd || null);
                }
            } catch (error) {
                console.error('Fatal Analysis Error:', error);
            } finally {
                // 何があっても0.5秒後には読み込み画面を消す
                setTimeout(() => setLoading(false), 500);
            }
        };

        processResult();
    }, [router]);

    // シェア用
    const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shareText = result ? `私の魂に宿る偉人は「${result.animal_name}」でした！` : '';

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">Analyzing your soul...</p>
            </div>
        );
    }

    // 万が一データが空の場合の表示
    if (!result) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
                <p className="text-slate-400 mb-6">解析データが見つかりませんでした。</p>
                <button onClick={() => router.push('/')} className="py-4 px-10 bg-indigo-600 text-white rounded-2xl font-bold">トップに戻る</button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
            <div className="bg-indigo-600 pt-16 pb-24 px-6 text-center text-white rounded-b-[3rem] shadow-lg">
                <p className="text-indigo-100 font-bold tracking-[0.2em] text-[10px] mb-3 uppercase opacity-70">Diagnosis Result</p>
                <h1 className="text-3xl font-black mb-1">あなたは「{result.animal_name}」</h1>
                <p className="text-indigo-50/80 text-sm font-medium">{result.catchphrase}</p>
            </div>

            <div className="px-5 -mt-12 space-y-6">
                <div className="bg-white rounded-[2.5rem] shadow-sm p-8 space-y-8 border border-white">
                    <div className="w-24 h-24 bg-indigo-50 rounded-3xl mx-auto flex items-center justify-center text-5xl border border-indigo-100/30">
                        {result.emoji}
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3 text-center">
                            <h2 className="inline-block px-5 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-1">Your Identity</h2>
                            <p className="text-slate-700 leading-relaxed text-base font-bold px-2">
                                {result.base_description}
                            </p>
                        </div>
                        <div className="bg-slate-50/80 p-6 rounded-3xl text-slate-600 leading-relaxed text-sm whitespace-pre-wrap border border-slate-100">
                            {result.result_text}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4">
                        <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`)} className="py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs">𝕏でシェア</button>
                        <button onClick={() => window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`)} className="py-4 bg-[#06C755] text-white rounded-2xl font-bold text-xs">LINEで送る</button>
                    </div>
                </div>

                {adContent && (
                    <div className="bg-white rounded-[2.5rem] p-8 border border-indigo-100 shadow-sm">
                        <span className="inline-block px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-black rounded mb-3 uppercase">Recommended</span>
                        <h3 className="text-lg font-bold mb-2 text-slate-800">{adContent.ad_title}</h3>
                        <p className="text-slate-500 text-xs mb-6 leading-relaxed">{adContent.ad_text}</p>
                        <a href="#" className="flex items-center justify-center w-full py-4.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100">
                            {adContent.ad_link_text}
                        </a>
                    </div>
                )}

                <div className="bg-green-500 rounded-[2.5rem] p-8 text-white text-center shadow-lg">
                    <h3 className="text-lg font-bold mb-2">さらに詳しい鑑定をLINEで受ける</h3>
                    <p className="text-xs opacity-90 mb-6">公式LINE限定「人生の戦略マップ」を無料配布中</p>
                    <a href="https://line.me/R/ti/p/YOUR_LINE_ID" className="flex items-center justify-center w-full py-4 bg-white text-green-600 rounded-2xl font-bold text-sm">LINE公式アカウントを登録</a>
                </div>

                <button onClick={() => router.push('/')} className="w-full py-6 text-slate-300 font-bold text-xs tracking-widest uppercase hover:text-indigo-500 transition-colors">
                    ← Back to Entrance
                </button>
            </div>
        </div>
    );
}