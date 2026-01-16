'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// 型定義
interface AdContent { ad_title: string; ad_text: string; ad_link_text: string; a8_html?: string; }
interface ResultData { animal_name: string; emoji: string; catchphrase: string; base_description: string; result_text: string; monetization: Record<string, AdContent>; }

function ResultContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [result, setResult] = useState<ResultData | null>(null);
    const [contentObj, setContentObj] = useState<AdContent | null>(null);
    const [resultId, setResultId] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDataAndProcess = async () => {
            try {
                const typeParam = searchParams.get('type');
                const userAttr = typeof window !== 'undefined' ? (localStorage.getItem('user_attribute') || 'cas_male') : 'cas_male';

                // 1. JSONファイルを直接Fetchで取得（ビルドキャッシュをバイパス）
                const response = await fetch('/result_data.json', { cache: 'no-store' });
                if (!response.ok) throw new Error('Failed to fetch data');
                const allData = await response.json();

                if (!typeParam || !allData[typeParam]) {
                    router.replace('/');
                    return;
                }

                const coreData = allData[typeParam];
                setResult(coreData);
                setResultId(typeParam);

                // 2. 広告データ抽出
                const mData = coreData.monetization || {};
                let selected = mData[userAttr] || Object.values(mData)[0] || null;

                setContentObj(selected);
            } catch (error) {
                console.error("Data Load Error:", error);
            } finally {
                setLoading(false);
            }
        };

        loadDataAndProcess();
    }, [searchParams, router]);

    if (loading || !result) return <div className="min-h-screen flex items-center justify-center bg-white">Loading...</div>;

    const shareUrl = `https://www.daiakksindan.jp/result?type=${resultId}`;
    const shareText = `私の魂に宿る偉人は「${result.animal_name}」でした！\n#偉人診断\n`;

    return (
        <div className="max-w-2xl mx-auto min-h-screen bg-slate-50 pb-20 font-sans text-slate-900 overflow-x-hidden">
            <div className="w-full bg-white shadow-md leading-[0]">
                <img src={`/results/${resultId}.png`} alt={result.animal_name} className="w-full h-auto block" />
            </div>

            <div className="px-5 mt-6 space-y-6">
                <div className="bg-white rounded-[2rem] shadow-sm p-8 space-y-6 border border-slate-50">
                    <div className="space-y-3 text-center">
                        <h2 className="inline-block px-5 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Detail Analysis</h2>
                        <div className="text-slate-600 leading-relaxed text-[15px] whitespace-pre-wrap font-medium text-left">
                            {result.result_text}
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-6 border-t border-slate-50">
                        <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`)} className="py-4 bg-slate-900 text-white rounded-2xl font-bold text-[10px]">𝕏</button>
                        <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400')} className="py-4 bg-[#1877F2] text-white rounded-2xl font-bold text-[10px]">Facebook</button>
                        <button onClick={() => window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`)} className="py-4 bg-[#06C755] text-white rounded-2xl font-bold text-[10px]">LINE</button>
                    </div>
                    <button onClick={() => router.push('/list')} className="w-full py-4 rounded-2xl bg-indigo-50 text-indigo-600 font-bold text-sm border border-indigo-100 shadow-sm transition-all active:scale-95">他のタイプをすべて見る →</button>
                </div>

                {/* 隔離レンダリングエリア（Fetchデータによるiframe描画） */}
                {contentObj && contentObj.a8_html && (
                    <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm text-center">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Pick Up</div>
                        <div className="flex justify-center overflow-hidden">
                            <iframe
                                srcDoc={`<!DOCTYPE html><html><head><base target="_top"><style>body{margin:0;display:flex;justify-content:center;align-items:center;background:transparent;}img{max-width:100%;height:auto;border-radius:12px;}</style></head><body>${contentObj.a8_html}</body></html>`}
                                className="w-full border-none"
                                style={{ height: '120px' }}
                                scrolling="no"
                            />
                        </div>
                    </div>
                )}

                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-[2rem] p-8 text-white text-center shadow-lg relative overflow-hidden">
                    <h3 className="text-lg font-bold mb-2">公式鑑定をLINEで受ける</h3>
                    <p className="text-xs opacity-90 mb-6">「人生の戦略マップ」を無料配布中</p>
                    <a href="https://lin.ee/hW4POqg" className="flex items-center justify-center w-full py-4 bg-white text-green-600 rounded-2xl font-bold text-sm shadow-xl no-underline">LINE公式アカウントを登録</a>
                </div>

                <button onClick={() => { localStorage.clear(); router.push('/'); }} className="w-full py-4 text-slate-400 font-bold text-[10px] tracking-widest uppercase active:text-slate-600 transition-colors">← Back to Top</button>
            </div>
        </div>
    );
}

export default function ResultClient() {
    return (
        <Suspense fallback={null}>
            <ResultContent />
        </Suspense>
    );
}