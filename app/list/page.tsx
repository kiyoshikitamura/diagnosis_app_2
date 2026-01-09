'use client';

import { useRouter } from 'next/navigation';
import resultDataRaw from '@/data/result_data.json';

const resultData = resultDataRaw as Record<string, any>;

export default function ListPage() {
    const router = useRouter();
    const mbtiList = Object.keys(resultData);

    return (
        <div className="max-w-2xl mx-auto min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
            {/* ヘッダー */}
            <div className="bg-indigo-600 pt-12 pb-16 px-6 text-center text-white rounded-b-[2.5rem] shadow-lg">
                <h1 className="text-2xl font-black mb-2 tracking-tight">偉人・指導者図鑑</h1>
                <p className="text-indigo-100 text-xs opacity-80">全16タイプの英雄たちが、あなたの魂に眠っています。</p>
            </div>

            <div className="px-5 -mt-8 grid grid-cols-1 gap-4">
                {mbtiList.map((id) => {
                    const person = resultData[id];
                    return (
                        <div key={id} className="bg-white rounded-3xl p-6 shadow-sm border border-white flex gap-5 items-start">
                            <div className="text-4xl bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0">
                                {person.emoji}
                            </div>
                            <div className="flex-1 text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{id}</span>
                                    <h3 className="text-lg font-bold text-slate-800">{person.animal_name}</h3>
                                </div>
                                {/* 100文字程度の要約紹介 */}
                                <p className="text-[13px] text-slate-500 leading-relaxed mb-1">
                                    {person.base_description.slice(0, 95)}...
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-10 px-6 text-center">
                <button
                    onClick={() => router.push('/')}
                    className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold border-2 border-indigo-600 active:scale-95 transition-all"
                >
                    診断トップに戻る
                </button>
            </div>
        </div>
    );
}