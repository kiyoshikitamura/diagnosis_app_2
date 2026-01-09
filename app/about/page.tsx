'use client';

import { useRouter } from 'next/navigation';

export default function AboutPage() {
    const router = useRouter();

    return (
        <div className="max-w-2xl mx-auto min-h-screen bg-white py-12 px-6 font-sans text-slate-700 leading-relaxed">
            <div className="mb-10 text-center">
                <h1 className="text-2xl font-black text-slate-800 mb-2">運営者情報</h1>
                <p className="text-[10px] text-slate-400 tracking-widest uppercase">About Us</p>
            </div>

            <div className="space-y-8 text-sm">
                <section className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <h2 className="font-bold text-slate-800 mb-4 text-base flex items-center gap-2">
                        <span>💡</span> 運営コンセプト
                    </h2>
                    <p className="text-slate-600 leading-loose">
                        「自分の中に眠るまだ見ぬ才能に、光を当てる。」<br />
                        当サイトは、歴史を動かしてきた偉人たちの思考パターンと、現代の心理統計学を掛け合わせ、誰もが持つ「強み」をポジティブに再発見していただくために誕生しました。日々の生活や仕事において、自分自身の可能性を信じるきっかけを提供することが私たちの使命です。
                    </p>
                </section>

                <section className="px-2">
                    <h2 className="font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 mb-4 text-base">
                        運営の詳細
                    </h2>
                    <table className="w-full border-collapse">
                        <tbody>
                            <tr className="border-b border-slate-100">
                                <th className="py-4 text-left w-1/3 text-slate-500 font-medium">運営組織</th>
                                <td className="py-4 text-slate-800">偉人診断プロファイリング 運営事務局</td>
                            </tr>
                            <tr className="border-b border-slate-100">
                                <th className="py-4 text-left text-slate-500 font-medium">お問い合わせ</th>
                                <td className="py-4 text-slate-800">
                                    <p className="mb-1 italic">daiakksindan@gmail.com</p>
                                    <p className="text-[10px] text-slate-400">※上記アドレス、または公式LINEより受け付けております。</p>
                                </td>
                            </tr>
                            <tr>
                                <th className="py-4 text-left text-slate-500 font-medium">公式サイト</th>
                                <td className="py-4 text-slate-800">https://www.daiakksindan.jp</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <section className="px-2">
                    <h2 className="font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 mb-4 text-base">
                        情報の正確性について
                    </h2>
                    <p>
                        診断結果は、提供される回答に基づいた統計的傾向を示すものであり、学術的な診断や特定の個人の性格を断定するものではありません。エンターテインメントおよび自己啓発のヒントとしてお楽しみください。
                    </p>
                </section>
            </div>

            <div className="mt-16 text-center">
                <button
                    onClick={() => router.push('/')}
                    className="px-8 py-3 bg-slate-100 text-slate-500 rounded-full font-bold text-xs hover:bg-slate-200 transition-colors"
                >
                    トップページへ戻る
                </button>
            </div>
        </div>
    );
}