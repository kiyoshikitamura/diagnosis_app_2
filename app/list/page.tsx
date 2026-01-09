'use client';

import { useRouter } from 'next/navigation';
import resultDataRaw from '@/data/result_data.json';

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

export default function ListPage() {
    const router = useRouter();
    const mbtiList = Object.keys(resultData);

    return (
        <div className="max-w-2xl mx-auto min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
            <div className="bg-indigo-600 pt-12 pb-20 px-6 text-center text-white rounded-b-[2.5rem] shadow-lg">
                <div className="inline-block px-3 py-1 bg-indigo-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border border-indigo-400">
                    Encyclopedia
                </div>
                <h1 className="text-2xl font-black mb-1 tracking-tight">偉人・指導者図鑑</h1>
                <p className="text-indigo-100 text-xs opacity-80 leading-relaxed">
                    全16タイプの魂を網羅。<br />あなたの周りにも、この英雄たちがいるかもしれません。
                </p>
            </div>

            <div className="px-5 -mt-10 grid grid-cols-1 gap-4">
                {mbtiList.map((id) => {
                    const person = resultData[id];
                    return (
                        <button
                            key={id}
                            onClick={() => router.push(`/result?type=${id}`)}
                            className="bg-white rounded-3xl p-5 shadow-sm border border-white flex gap-4 items-center transition-all active:scale-[0.98] text-left w-full"
                        >
                            <div className="text-3xl bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                                {person.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h3 className="text-[16px] font-bold text-slate-800 truncate">{person.animal_name}</h3>
                                </div>
                                {/* 修正箇所：
                   - text-indigo-500 から text-slate-400 (目立たない色) へ変更
                   - italic を削除 (より馴染むように)
                   - line-clamp-1 から line-clamp-2 (2行表示) へ変更
                */}
                                <p className="text-[11px] text-slate-400 font-medium leading-snug line-clamp-2">
                                    {person.catchphrase}
                                </p>
                            </div>
                            <div className="text-slate-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="mt-12 px-8 space-y-4">
                <button
                    onClick={() => router.push('/result')}
                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                >
                    <span>✨</span>
                    自分の鑑定結果に戻る
                </button>

                <button
                    onClick={() => router.push('/')}
                    className="w-full py-4 bg-white text-slate-500 rounded-2xl font-bold border border-slate-200 active:scale-95 transition-all text-xs tracking-widest uppercase"
                >
                    最初からやり直す
                </button>
            </div>
        </div>
    );
}