'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import resultDataRaw from '@/data/result_data.json';

// --- 型定義 ---
interface AdContent {
    ad_title: string;
    ad_text: string;
    ad_link_text: string;
    a8_html?: string;
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

function ResultContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [result, setResult] = useState<ResultData | null>(null);
    const [adContent, setAdContent] = useState<AdContent | null>(null);
    const [resultId, setResultId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [fullShareUrl, setFullShareUrl] = useState('');

    useEffect(() => {
        const processResult = () => {
            try {
                const typeParam = searchParams.get('type');
                const userAttribute = typeof window !== 'undefined' ? (localStorage.getItem('user_attribute') || 'cas_male') : 'cas_male';

                if (!typeParam || !resultData[typeParam]) {
                    router.replace('/');
                    return;
                }

                const coreData = resultData[typeParam];
                setResult(coreData);
                setResultId(typeParam);

                // --- 広告データ抽出：最強フォールバックロジック ---
                const monetizationMap = coreData.monetization || {};

                // 1. まず属性(high_male等)で探す
                let selectedAd = monetizationMap[userAttribute];

                // 2. なければ、その性格タイプのmonetizationにある「最初の広告」を強制取得
                if (!selectedAd) {
                    const availableAds = Object.values(monetizationMap);
                    if (availableAds.length > 0) {
                        selectedAd = availableAds[0];
                    }
                }

                // 3. それでもなければ(monetization自体が空なら)、全データから共通広告を探索
                if (!selectedAd) {
                    for (const key in resultData) {
                        const m = resultData[key].monetization;
                        if (m && Object.values(m).length > 0) {
                            selectedAd = Object.values(m)[0];
                            break;
                        }
                    }
                }

                setAdContent(selectedAd || null);
                setFullShareUrl(`https://www.daiakksindan.jp/result?type=${typeParam}`);

                // Meta Pixel (Facebook)
                const fb = (window as any).fbq;
                if (typeof fb === 'function') {
                    fb('track', 'CompleteRegistration');
                }

            } catch (error) {
                console.error("Result Page Error:", error);
                router.replace('/');
            } finally {
                setLoading(false);
            }
        };

        processResult();
    }, [searchParams, router]);

    if (loading || !result) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const shareText = `私の魂に宿る偉人は「${result.animal_name}」でした！\n#偉人診断\n`;

    return (
        <div className="max-w-2xl mx-auto min-h-screen bg-slate-50 pb-20 font-sans text-slate-900 overflow-x-hidden">

            {/* 1. 結果画像エリア */}
            <div className="w-full bg-white shadow-md leading-[0]">
                <img
                    src={`/results/${resultId}.png`}
                    alt={result.animal_name}
                    className="w-full h-auto block"
                />
            </div>

            <div className="px-5 mt-6 space-y-6">

                {/* 2. 分析テキストカード */}
                <div className="bg-white rounded-[2rem] shadow-sm p-8 space-y-6 border border-slate-50">
                    <div className="space-y-3">
                        <div className="text-center">
                            <h2 className="inline-block px-5 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Detail Analysis</h2>
                        </div>
                        <div className="text-slate-600 leading-relaxed text-[15px] whitespace-pre-wrap font-medium text-left">
                            {result.result_text}
                        </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-50">
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullShareUrl)}`)}
                                className="py-4 bg-slate-900 text-white rounded-2xl font-bold text-[10px] active:scale-95 transition-transform"
                            >
                                𝕏で送る
                            </button>
                            <button
                                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullShareUrl)}`, '_blank', 'width=600,height=400')}
                                className="py-4 bg-[#1877F2] text-white rounded-2xl font-bold text-[10px] active:scale-95 transition-transform"
                            >
                                Facebook
                            </button>
                            <button
                                onClick={() => {
                                    const cacheBust = new Date().getTime();
                                    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(fullShareUrl + '&v=' + cacheBust)}&text=${encodeURIComponent(shareText)}`;
                                    window.open(lineUrl);
                                }}
                                className="py-4 bg-[#06C755] text-white rounded-2xl font-bold text-[10px] active:scale-95 transition-transform"
                            >
                                LINE
                            </button>
                        </div>

                        <button
                            onClick={() => router.push('/list')}
                            className="w-full py-4 rounded-2xl bg-indigo-50 text-indigo-600 font-bold text-sm border border-indigo-100 shadow-sm transition-all hover:bg-indigo-100 active:scale-95"
                        >
                            他のタイプをすべて見る →
                        </button>
                    </div>
                </div>

                {/* 3. ターゲット広告エリア（絶対表示ロジック搭載） */}
                {adContent ? (
                    <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm overflow-hidden text-center">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <div className="h-[1px] w-8 bg-slate-100"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Recommended</span>
                            <div className="h-[1px] w-8 bg-slate-100"></div>
                        </div>

                        <div className="relative inline-block w-full min-h-[50px]">
                            {adContent.a8_html ? (
                                <div
                                    className="flex items-center justify-center [&>a]:inline-block [&>a>img]:max-w-full [&>a>img]:h-auto [&>a>img]:rounded-xl transition-transform active:scale-95"
                                    dangerouslySetInnerHTML={{ __html: adContent.a8_html }}
                                />
                            ) : (
                                <div className="text-[10px] text-slate-300 py-4">Now Loading Recommendations...</div>
                            )}
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-1">
                            <span className="text-[8px] text-slate-300 font-bold tracking-widest uppercase">Sponsored</span>
                        </div>
                    </div>
                ) : null}

                {/* 4. LINE公式誘導 */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-[2rem] p-8 text-white text-center shadow-lg relative overflow-hidden">
                    <h3 className="text-lg font-bold mb-2">公式鑑定をLINEで受ける</h3>
                    <p className="text-xs opacity-90 mb-6 leading-relaxed">あなたの強みを最大化する<br />「人生の戦略マップ」を無料配布中</p>
                    <a href="https://lin.ee/hW4POqg" className="flex items-center justify-center w-full py-4 bg-white text-green-600 rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-transform no-underline">
                        LINE公式アカウントを登録
                    </a>
                </div>

                <button
                    onClick={() => { localStorage.clear(); router.push('/'); }}
                    className="w-full py-4 text-slate-400 font-bold text-[10px] tracking-widest uppercase active:text-slate-600 transition-colors"
                >
                    ← Back to Top
                </button>
            </div>
        </div>
    );
}

export default function ResultClient() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-400 text-sm font-bold tracking-widest uppercase">
                Analyzing Mind...
            </div>
        }>
            <ResultContent />
        </Suspense>
    );
}