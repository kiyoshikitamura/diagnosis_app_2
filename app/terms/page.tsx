'use client';

import { useRouter } from 'next/navigation';

export default function TermsPage() {
    const router = useRouter();

    return (
        <div className="max-w-2xl mx-auto min-h-screen bg-white py-12 px-6 font-sans text-slate-700 leading-relaxed">
            <div className="mb-10 text-center">
                <h1 className="text-2xl font-black text-slate-800 mb-2">利用規約</h1>
                <p className="text-[10px] text-slate-400 tracking-widest uppercase">Terms of Service</p>
            </div>

            <div className="space-y-8 text-sm">
                <section>
                    <h2 className="font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 mb-4 text-base">
                        第1条（適用）
                    </h2>
                    <p>
                        本規約は、ユーザーと当サイト運営者との間の本サービスの利用に関わる一切の関係に適用されるものとします。
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 mb-4 text-base">
                        第2条（禁止事項）
                    </h2>
                    <p className="mb-2">ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>法令または公序良俗に違反する行為</li>
                        <li>本サービスの運営を妨害するおそれのある行為</li>
                        <li>他のユーザーに成りすます行為</li>
                        <li>当サイトのサーバーやネットワークの機能を破壊したり、妨害したりする行為</li>
                        <li>その他、運営者が不適切と判断する行為</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 mb-4 text-base">
                        第3条（本サービスの提供の停止等）
                    </h2>
                    <p>
                        当サイトは、システムの保守点検または更新、停電、天災、その他不可抗力により、本サービスの提供が困難と判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 mb-4 text-base">
                        第4条（著作権・知的財産権）
                    </h2>
                    <p>
                        本サービスに含まれるテキスト、画像、プログラム等の著作権およびその他の知的財産権は、すべて当サイト運営者または正当な権利者に帰属します。これらを無断で転載、複製、改ざん、公衆送信する行為を禁じます。
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 mb-4 text-base">
                        第5条（サービスの変更・終了）
                    </h2>
                    <p>
                        当サイトは、ユーザーに通知することなく、本サービスの内容を変更し、または本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 mb-4 text-base">
                        第6条（規約の変更）
                    </h2>
                    <p>
                        当サイトは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
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