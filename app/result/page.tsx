'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import resultDataRaw from '@/data/result_data.json';
import questionsData from '@/data/questions.json';

const resultData = resultDataRaw as Record<string, any>;

export default function ResultPage() {
    const router = useRouter();
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedAnswers = localStorage.getItem('diagnosis_answers');
        if (!savedAnswers) { router.push('/'); return; }

        try {
            const answers = JSON.parse(savedAnswers);
            const scores: Record<string, number> = {};
            Object.entries(answers).forEach(([qId, value]) => {
                const question = questionsData.find(q => q.id === parseInt(qId));
                if (question && question.groupId !== 'common') {
                    scores[question.groupId] = (scores[question.groupId] || 0) + (value as number);
                }
            });
            const topGroupId = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0];
            const finalResult = topGroupId && resultData[topGroupId] ? resultData[topGroupId] : Object.values(resultData)[0];
            setResult(finalResult);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [router]);

    const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shareText = result ? `性格診断の結果、私は「${result.animal_name}」タイプでした！\n#動物性格診断 #心理テスト\n` : '';

    const shareOnX = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    const shareOnLine = () => window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');

    if (loading || !result) return null;

    return (
        <div className="max-w-2xl mx-auto min-h-screen bg-slate-50 pb-20 font-sans">
            <div className="bg-indigo-600 pt-16 pb-24 px-6 text-center text-white rounded-b-[3rem] shadow-xl">
                <p className="text-indigo-200 font-bold tracking-widest text-xs mb-2 uppercase">Analysis Complete</p>
                <h1 className="text-3xl font-black mb-2 tracking-tight">あなたは「{result.animal_name}」</h1>
                <p className="text-indigo-100 text-sm opacity-90">{result.ad_title}</p>
            </div>

            <div className="px-6 -mt-12 space-y-6">
                <div className="bg-white rounded-3xl shadow-lg p-8 space-y-8 border border-white">
                    <div className="w-32 h-32 bg-indigo-50 rounded-full mx-auto flex items-center justify-center text-5xl shadow-inner border-4 border-white">
                        {result.emoji || '🐾'}
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center">
                                <span className="w-1.5 h-6 bg-indigo-500 rounded-full mr-3"></span>
                                基本性格
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-[15px] bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                {result.base_description}
                            </p>
                        </div>
                        <div className="text-slate-600 leading-relaxed text-[15px] whitespace-pre-wrap">
                            {result.result_text}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <p className="text-center text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">Share Result</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={shareOnX} className="flex items-center justify-center gap-2 py-3 bg-black text-white rounded-xl font-bold text-sm active:scale-95 transition-all">
                                <span className="text-lg">𝕏</span>でポスト
                            </button>
                            <button onClick={shareOnLine} className="flex items-center justify-center gap-2 py-3 bg-[#06C755] text-white rounded-xl font-bold text-sm active:scale-95 transition-all">
                                <span className="text-lg">LINE</span>で送る
                            </button>
                        </div>
                    </div>
                </div>

                {/* アフィリエイトリンク */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-100 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="bg-white p-3 rounded-2xl shadow-sm"><span className="text-2xl">🎁</span></div>
                        <div className="flex-1">
                            <p className="text-amber-800 text-[10px] font-black uppercase tracking-wider mb-1">Recommended</p>
                            <h3 className="text-slate-800 font-bold text-sm mb-2">{result.animal_name}タイプにおすすめ</h3>
                            <a href="https://px.a8.net/..." target="_blank" rel="noopener noreferrer" className="inline-block w-full py-3 bg-white text-amber-600 border border-amber-200 text-center rounded-xl font-bold text-sm shadow-sm hover:bg-amber-100 transition-colors">詳細を見る</a>
                        </div>
                    </div>
                </div>

                <button onClick={() => router.push('/')} className="w-full py-4 text-slate-400 font-bold text-sm hover:text-indigo-600 transition-colors">← 診断をやり直す</button>
            </div>
        </div>
    );
}