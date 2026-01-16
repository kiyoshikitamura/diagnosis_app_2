'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">

            {/* --- メインビジュアル（ファーストビュー） --- */}
            <section className="h-screen flex flex-col items-center justify-center px-6 text-center relative">
                <div className="relative z-10 space-y-10 w-full max-w-lg">

                    {/* キービジュアル表示 */}
                    <div className="w-full leading-[0] shadow-2xl rounded-[2.5rem] overflow-hidden">
                        <img
                            src="/main-visual.png"
                            alt="偉人診断"
                            className="w-full h-auto"
                        />
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <p className="text-slate-600 text-[15px] font-bold leading-relaxed">
                                あなたの深層心理に眠る、<br />歴史的偉人の正体を解き明かす.
                            </p>
                            <p className="text-slate-400 text-[11px] font-medium tracking-widest">
                                全30問 / 所要時間 約3分
                            </p>
                        </div>

                        <button
                            onClick={() => router.push('/quiz')}
                            className="w-full max-w-xs py-5 bg-slate-900 text-white rounded-2xl font-bold text-sm tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-200"
                        >
                            診断を開始する
                        </button>
                    </div>

                    {/* スクロール誘導 */}
                    <div className="pt-8 animate-bounce opacity-30">
                        <div className="w-[1px] h-10 bg-slate-900 mx-auto" />
                    </div>
                </div>
            </section>

            {/* --- 診断の強み（スクロールで表示） --- */}
            <section className="bg-slate-50 py-24 px-6 border-t border-slate-100">
                <div className="max-w-2xl mx-auto space-y-16">

                    <div className="text-center space-y-3">
                        <h2 className="text-xl font-black tracking-tighter text-slate-900">なぜこの診断は信頼できるのか</h2>
                        <div className="w-8 h-1 bg-indigo-500 mx-auto rounded-full" />
                    </div>

                    <div className="grid gap-6">
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                            <div className="space-y-3">
                                <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">01. Logic</div>
                                <h3 className="font-black text-lg text-slate-800 tracking-tight">16類型の心理統計学に基づいた分析</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                    MBTI（16性格タイプ）の理論をベースに、現代の心理学的な指標を取り入れた高精度なロジックを採用.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                            <div className="space-y-3">
                                <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">02. Data</div>
                                <h3 className="font-black text-lg text-slate-800 tracking-tight">歴史的データとのマッチング</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                    何百人もの偉人のエピソード、名言、行動指針を独自のデータベース化. あなたの性格特性と最も共鳴する人物を特定します.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                            <div className="space-y-3">
                                <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">03. Support</div>
                                <h3 className="font-black text-lg text-slate-800 tracking-tight">属性別のキャリア・ライフスタイル提案</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                    単なる性格診断に留まらず、あなたの現状の属性に合わせた、明日から使える具体的なアクションプランを提案.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- フッター --- */}
            <footer className="py-16 px-6 text-center border-t border-slate-50 bg-slate-50">
                <div className="flex justify-center gap-8 mb-8">
                    <a href="/privacy" className="text-[11px] font-bold text-slate-400 hover:text-slate-900 transition-colors tracking-tighter">プライバシーポリシー</a>
                    <a href="/terms" className="text-[11px] font-bold text-slate-400 hover:text-slate-900 transition-colors tracking-tighter">利用規約</a>
                    {/* リンク先を /info から /about へ修正しました */}
                    <a href="/about" className="text-[11px] font-bold text-slate-400 hover:text-slate-900 transition-colors tracking-tighter">運営者情報</a>
                </div>
                <p className="text-[10px] text-slate-300 font-bold tracking-widest uppercase">
                    © 偉人診断プロファイリング
                </p>
            </footer>
        </div>
    );
}