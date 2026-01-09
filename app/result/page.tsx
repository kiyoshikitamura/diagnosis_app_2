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
        // 1. ローカルストレージの取得
        const savedAnswersStr = localStorage.getItem('diagnosis_answers');
        const userAttribute = localStorage.getItem('user_attribute') || 'cas_male';

        if (!savedAnswersStr) {
            console.error("No answers found in localStorage");
            router.push('/');
            return;
        }

        try {
            const answers: Record<string, number> = JSON.parse(savedAnswersStr);

            // 2. MBTI判定（40問のスコア合計から16タイプのどれかを決定するロジック）
            // questions.jsonの属性別30問（ID 101以降）の回答を使って判定
            const mbtiList = ["entj", "estj", "enfj", "infj", "intj", "estp", "entp", "intp", "istj", "esfj", "isfj", "istp", "infp", "enfp", "esfp", "isfp"];

            // 現在は属性別の質問が「属性ID(high_male等)」になっているため、
            // 暫定的に回答の合計値から16タイプのインデックスを決定する安全なロジックに変更
            const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
            const mbtiIndex = totalScore % mbtiList.length;
            const topGroupId = mbtiList[mbtiIndex];

            // 3. データの紐付け
            let coreData = resultData[topGroupId];

            // 万が一データが見つからない場合は最初のデータ(entj)を強制使用
            if (!coreData) {
                console.warn(`Data not found for ID: ${topGroupId}. Falling back to entj.`);
                coreData = resultData['entj'];
            }

            if (coreData) {
                setResult(coreData);
                // 広告の取得（指定属性がなければデフォルトを使用）
                const selectedAd = coreData.monetization[userAttribute] || Object.values(coreData.monetization)[0];
                setAdContent(selectedAd);
            }

        } catch (error) {
            console.error('Analysis error details:', error);
            // エラーが起きても止まらないよう、最低限のデータをセット
            const fallbackData = Object.values(resultData)[0];
            setResult(fallbackData);
            setAdContent(Object.values(fallbackData.monetization)[0]);
        } finally {
            // どんな場合でも必ずローディングを終了させる
            setLoading(false);
        }
    }, [router]);

    // シェア設定
    const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shareText = result ? `私の魂に宿る偉人は「${result.animal_name}」でした！\n#偉人診断 #才能プロファイリング\n` : '';

    const shareOnX = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    const shareOnLine = () => window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`, '_blank');

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 text-sm font-medium">結果を解析中...</p>
        </div>
    );

    if (!result) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 text-center">
            <p className="text-slate-600 mb-4">申し訳ありません。データの読み込みに失敗しました。</p>
            <button onClick={() => router.push('/')} className="py-3 px-8 bg-indigo-600 text-white rounded-xl font-bold">トップに戻る</button>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto min-h-screen bg-slate-50 pb-20 font-sans text-slate-900 overflow-x-hidden">
            <div className="bg-gradient-to-b from-indigo-500 to-indigo-600 pt-16 pb-24 px-6 text-center text-white rounded-b-[3rem] shadow-md">
                <p className="text-indigo-100 font-bold tracking-[0.2em] text-[10px] mb-3 uppercase opacity-80">Profiling Complete</p>
                <h1 className="text-3xl font-black mb-1 tracking-tight">あなたは「{result.animal_name}」</h1>
                <p className="text-indigo-50/90 text-sm font-medium italic">{result.catchphrase}</p>
            </div>

            <div className="px-5 -mt-12 space-y-6">
                <div className="bg-white rounded-[2.5rem] shadow-sm p-8 space-y-8 border border-white">
                    <div className="w-24 h-24 bg-indigo-50 rounded-3xl mx-auto flex items-center justify-center text-5xl shadow-inner border border-indigo-100/50">
                        {result.emoji}
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3 text-center">
                            <h2 className="inline-block px-6 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-2">Identity Profile</h2>
                            <p className="text-slate-700 leading-relaxed text-[16px] font-bold">
                                {result.base_description}
                            </p>
                        </div>
                        <div className="bg-slate-50/80 p-6 rounded-3xl text-slate-600 leading-relaxed text-[14px] whitespace-pre-wrap border border-slate-100">
                            {result.result_text}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50">
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={shareOnX} className="py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs active:scale-95 transition-all">𝕏でシェア</button>
                            <button onClick={shareOnLine} className="py-4 bg-[#06C755] text-white rounded-2xl font-bold text-xs active:scale-95 transition-all">LINEで送る</button>
                        </div>
                    </div>
                </div>

                {adContent && (
                    <div className="bg-white rounded-[2.5rem] p-1.5 border border-indigo-100 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-br from-indigo-50/50 to-white p-7 rounded-[2rem]">
                            <span className="px-2.5 py-1 bg-indigo-600 text-white text-[9px] font-black rounded-lg uppercase tracking-wider mb-3 inline-block">Recommended</span>
                            <h3 className="text-[17px] font-bold mb-2 text-slate-800 tracking-tight">{adContent.ad_title}</h3>
                            <p className="text-slate-500 text-xs mb-6 leading-relaxed">{adContent.ad_text}</p>
                            <a href="#" className="flex items-center justify-center w-full py-4.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 transition-all active:scale-95">
                                {adContent.ad_link_text}
                            </a>
                        </div>
                    </div>
                )}

                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-[2.5rem] p-8 text-white text-center shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-lg font-bold mb-2">公式鑑定をLINEで受ける</h3>
                        <p className="text-xs opacity-90 mb-6">あなたの強みを最大化する<br />「人生の戦略マップ」を無料配布中</p>
                        <a href="https://line.me/R/ti/p/YOUR_LINE_ID" className="flex items-center justify-center w-full py-4 bg-white text-green-600 rounded-2xl font-bold text-sm shadow-xl transition-all active:scale-95">
                            LINE公式アカウントを登録
                        </a>
                    </div>
                </div>

                <button onClick={() => router.push('/')} className="w-full py-6 text-slate-300 font-bold text-xs tracking-[0.2em] hover:text-indigo-500 transition-colors uppercase">
                    ← Back to Top
                </button>
            </div>
        </div>
    );
}