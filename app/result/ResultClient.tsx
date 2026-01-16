'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// 型定義
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

function ResultContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [result, setResult] = useState<ResultData | null>(null);
    const [adContent, setAdContent] = useState<AdContent | null>(null);
    const [resultId, setResultId] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const typeParam = searchParams.get('type');
                const userAttr = typeof window !== 'undefined' ? (localStorage.getItem('user_attribute') || 'cas_male') : 'cas_male';

                // キャッシュを回避して最新のJSONを取得
                const res = await fetch('/result_data.json', { cache: 'no-store' });
                const allData = await res.json();

                if (typeParam && allData[typeParam]) {
                    const core = allData[typeParam];
                    setResult(core);
                    setResultId(typeParam);
                    const m = core.monetization || {};
                    // 属性に一致する広告、なければ最初の一つ
                    setAdContent(m[userAttr] || Object.values(m)[0] || null);
                }
            } catch (e) {
                console.error("Data fetch error");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [searchParams]);

    if (loading || !result) return null;

    const shareUrl = `https://www.daiakksindan.jp/result?type=${resultId}`;
    const shareText = `私の魂に宿る偉人は「${result.animal_name}」でした！\n#偉人診断\n`;

    return (
        <div className="max-w-2xl mx-auto min-h-screen bg-slate-50 pb-20 font-sans text-slate-900 overflow-x-hidden">

            {/* 1. 結果画像 */}
            <div className="w-full bg-white shadow-md leading-[0]">
                <img src={`/results/${resultId}.png`} alt={result.animal_name} className="w-full h-auto block" />
            </div>

            <div className="px-5 mt-6 space-y-6">

                {/* 2. 分析カード */}
                <div className="bg-white rounded-[2rem] shadow-sm p-8 space-y-6 border border-slate-50">
                    <div className="space-y-3 text-center">
                        <h2 className="inline-block px-5 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Detail Analysis</h2>
                        <div className="text-slate-600 leading-relaxed text-[15px] whitespace-pre-wrap font-medium text-left">
                            {result.result_text}
                        </div>
                    </div>

                    {/* SNS共有ボタン */}
                    <div className="grid grid-cols-3 gap-2 pt-6 border-t border-slate-50">
                        <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`)} className="py-4 bg-slate-900 text-white rounded-2xl font-bold text-[10px] active:scale-95">𝕏</button>
                        <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400')} className="py-4 bg-[#1877F2] text-white rounded-2xl font-bold text-[10px] active:scale-95">Facebook</button>
                        <button onClick={() => window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`)} className="py-4 bg-[#06C755] text-white rounded-2xl font-bold text-[10px] active:scale-95">LINE</button>
                    </div>

                    <button onClick={() => router.push('/list')} className="w-full py-4 rounded-2xl bg-indigo-50 text-indigo-600 font-bold text-sm border border-indigo-100 transition-all active:scale-95">他のタイプをすべて見る →</button>
                </div>

                {/* 3. 広告エリア（自サーバー画像 & HTMLレンダリング） */}
                {adContent && adContent.a8_html && (
                    <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm text-center">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <div className="h-[1px] w-8 bg-slate-100"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Recommended</span>
                            <div className="h-[1px] w-8 bg-slate-100"></div>
                        </div>

                        {/* 修正：物理的なサイズ指定と画像比率の維持 */}
                        <div className="flex justify-center items-center w-full min-h-[250px]">
                            <div
                                className="w-[300px] h-[250px] [&_a]:block [&_a]:w-[300px] [&_a]:h-[250px] [&_img]:w-[300px] [&_img]:h-[250px] [&_img]:rounded-xl [&_img]:shadow-sm [&_img]:object-cover"
                                dangerouslySetInnerHTML={{ __html: adContent.a8_html }}
                            />
                        </div>

                        <div className="mt-4">
                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Sponsored</span>
                        </div>
                    </div>
                )}

                {/* 4. LINE公式 */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-[2rem] p-8 text-white text-center shadow-lg relative overflow-hidden">
                    <h3 className="text-lg font-bold mb-2">公式鑑定をLINEで受ける</h3>
                    <p className="text-xs opacity-90 mb-6 leading-relaxed">あなたの強みを最大化する<br />「人生の戦略マップ」を無料配布中</p>
                    <a href="https://lin.ee/hW4POqg" className="flex items-center justify-center w-full py-4 bg-white text-green-600 rounded-2xl font-bold text-sm shadow-xl no-underline active:scale-95 transition-transform">LINE公式アカウントを登録</a>
                </div>

                <button onClick={() => { localStorage.clear(); router.push('/'); }} className="w-full py-4 text-slate-400 font-bold text-[10px] tracking-widest uppercase">← Back to Top</button>
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