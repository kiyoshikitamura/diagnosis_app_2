'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import resultDataRaw from '@/data/result_data.json';

interface AdContent { ad_title: string; ad_text: string; ad_link_text: string; }
interface ResultData { animal_name: string; emoji: string; catchphrase: string; base_description: string; result_text: string; monetization: Record<string, AdContent>; }

const resultData = resultDataRaw as Record<string, ResultData>;

function ResultContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [result, setResult] = useState<ResultData | null>(null);
    const [adContent, setAdContent] = useState<AdContent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const secureProcess = () => {
            try {
                const typeParam = searchParams.get('type');
                const savedAnswersStr = localStorage.getItem('diagnosis_answers');
                const userAttribute = localStorage.getItem('user_attribute') || 'cas_male';

                // 【セキュリティ1】診断を完了していない（回答データがない）場合はトップへ戻す
                if (!savedAnswersStr && !typeParam) {
                    router.replace('/');
                    return;
                }

                // 【セキュリティ2】遷移元のチェック（任意）
                // typeParamがある場合（図鑑からの遷移）は許可するが、
                // それ以外で診断フローを通っていない場合は不正アクセスとみなす
                const isFromList = document.referrer.includes('/list');
                const isFromQuiz = savedAnswersStr !== null;

                if (typeParam && !isFromList) {
                    // 図鑑以外から直接「?type=entj」と打たれた場合は無視して自分の結果を出す
                    router.replace('/result');
                    return;
                }

                let topGroupId = '';

                if (typeParam && resultData[typeParam]) {
                    topGroupId = typeParam;
                } else if (isFromQuiz) {
                    const answers: Record<string, number> = JSON.parse(savedAnswersStr || '{}');
                    const mbtiList = ["entj", "estj", "enfj", "infj", "intj", "estp", "entp", "intp", "istj", "esfj", "isfj", "istp", "infp", "enfp", "esfp", "isfp"];
                    const totalScore = Object.values(answers).reduce((acc, val) => acc + (Number(val) || 0), 0);
                    const weight = Object.keys(answers).length;
                    const firstAnswer = Object.values(answers)[0] || 1;
                    const mbtiIndex = (totalScore * weight + firstAnswer) % mbtiList.length;
                    topGroupId = mbtiList[mbtiIndex];
                } else {
                    router.replace('/');
                    return;
                }

                const coreData = resultData[topGroupId];
                if (!coreData) throw new Error("Invalid Data");

                setResult(coreData);
                setAdContent(coreData.monetization[userAttribute] || Object.values(coreData.monetization)[0]);

            } catch (error) {
                router.replace('/');
            } finally {
                setTimeout(() => setLoading(false), 500);
            }
        };
        secureProcess();
    }, [searchParams, router]);

    // --- (中略：これまでのデザイン部分) ---
    const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shareText = result ? `私の魂に宿る偉人は「${result.animal_name}」でした！\n#偉人診断\n` : '';

    if (loading || !result) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const formattedResultText = result.result_text
        .replace(/【あなたの魂が持つ真のポテンシャル】/g, '【あなたの真のポテンシャル】')
        .replace(/【さらに飛躍するための生存戦略】/g, '【飛躍するためのアドバイス】');

    return (
        <div className="max-w-2xl mx-auto min-h-screen bg-slate-50 pb-20 font-sans text-slate-900 overflow-x-hidden">
            <div className="bg-indigo-600 pt-16 pb-24 px-6 text-center text-white rounded-b-[3rem] shadow-lg">
                <p className="text-indigo-100 font-bold tracking-[0.2em] text-[10px] mb-2 uppercase opacity-70">Diagnosis Result</p>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-bold opacity-90 mb-1">あなたは</span>
                    <h1 className="text-3xl font-black tracking-tight leading-tight">「{result.animal_name}」</h1>
                </div>
                <p className="text-indigo-50/80 text-xs mt-3 font-medium italic">{result.catchphrase}</p>
            </div>

            <div className="px-5 -mt-12 space-y-6">
                <div className="bg-white rounded-[2.5rem] shadow-sm p-8 space-y-8 border border-white">
                    <div className="w-24 h-24 bg-indigo-50 rounded-3xl mx-auto flex items-center justify-center text-5xl border border-indigo-100/30 shadow-inner">
                        {result.emoji}
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="text-center">
                                <h2 className="inline-block px-5 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Your Identity</h2>
                            </div>
                            <p className="text-slate-700 leading-relaxed text-[15px] font-bold px-1 text-left">{result.base_description}</p>
                        </div>
                        <div className="bg-slate-50/80 p-6 rounded-3xl text-slate-600 leading-relaxed text-sm whitespace-pre-wrap border border-slate-100 text-left">
                            {formattedResultText}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3 pt-4">
                            <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`)} className="py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs">𝕏でシェア</button>
                            <button onClick={() => window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`)} className="py-4 bg-[#06C755] text-white rounded-2xl font-bold text-xs">LINEで送る</button>
                        </div>
                        <button onClick={() => router.push('/list')} className="w-full py-4 rounded-2xl bg-indigo-50 text-indigo-600 font-bold text-sm border border-indigo-100 shadow-sm">
                            他のタイプをすべて見る →
                        </button>
                    </div>
                </div>

                {adContent && (
                    <div className="bg-white rounded-[2.5rem] p-8 border border-indigo-100 shadow-sm">
                        <span className="inline-block px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-black rounded mb-3 uppercase tracking-tighter">Recommended</span>
                        <h3 className="text-lg font-bold mb-2 text-slate-800">{adContent.ad_title}</h3>
                        <p className="text-slate-500 text-xs mb-6 leading-relaxed">{adContent.ad_text}</p>
                        <a href="#" className="flex items-center justify-center w-full py-4.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100">
                            {adContent.ad_link_text}
                        </a>
                    </div>
                )}

                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-[2.5rem] p-8 text-white text-center shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-lg font-bold mb-2">公式鑑定をLINEで受ける</h3>
                        <p className="text-xs opacity-90 mb-6 leading-relaxed">あなたの強みを最大化する<br />「人生の戦略マップ」を無料配布中</p>
                        <a href="https://lin.ee/1e3TG7p" className="flex items-center justify-center w-full py-4 bg-white text-green-600 rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-transform">
                            LINE公式アカウントを登録
                        </a>
                    </div>
                    <div className="absolute -right-4 -bottom-4 text-6xl opacity-20 rotate-12 pointer-events-none">📱</div>
                </div>

                <div className="pt-4 px-3 text-center">
                    <button onClick={() => { localStorage.removeItem('diagnosis_answers'); router.push('/'); }} className="w-full py-4 bg-white text-slate-500 rounded-2xl font-bold border border-slate-200 text-xs tracking-widest uppercase shadow-sm">
                        最初からやり直す
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ResultPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <ResultContent />
        </Suspense>
    );
}