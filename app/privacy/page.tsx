'use client';

import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
    const router = useRouter();

    return (
        <div className="max-w-2xl mx-auto min-h-screen bg-white py-12 px-6 font-sans text-slate-700 leading-relaxed">
            <div className="mb-10 text-center">
                <h1 className="text-2xl font-black text-slate-800 mb-2">プライバシーポリシー</h1>
                <p className="text-[10px] text-slate-400 tracking-widest uppercase">Privacy Policy</p>
            </div>

            <div className="space-y-8 text-sm">
                <section>
                    <h2 className="font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 mb-4 text-base">
                        1. 広告の配信について
                    </h2>
                    <p className="mb-3">
                        当サイトは、第三者配信の広告サービス「A8.net」およびその他のアフィリエイトプログラムを利用しています。
                    </p>
                    <p>
                        広告配信事業者は、ユーザーの興味に応じた商品やサービスの広告を表示するため、当サイトや他サイトへのアクセスに関する情報「Cookie」（氏名、住所、メールアドレス、電話番号は含まれません）を使用することがあります。
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 mb-4 text-base">
                        2. 診断データおよび個人情報の収集について
                    </h2>
                    <p className="mb-3">
                        当サイトで提供する診断コンテンツにおいて、ユーザーが入力した回答内容はすべてユーザーのブラウザ内（ローカルストレージ）で処理され、当サイトのサーバーに送信・保存されることはありません。
                    </p>
                    <p>
                        お問い合わせや公式LINEへの登録を通じて取得した個人情報は、お問い合わせへの回答や情報提供のためにのみ使用し、法令に基づく場合を除き、第三者に開示・提供することはありません。
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 mb-4 text-base">
                        3. 免責事項
                    </h2>
                    <p className="mb-3">
                        当サイトのコンテンツ・情報について、できる限り正確な情報を提供するよう努めておりますが、正確性や安全性を保証するものではありません。
                    </p>
                    <p>
                        当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。診断結果に基づく行動についても、ユーザーご自身の判断と責任において行っていただきますようお願いいたします。
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 mb-4 text-base">
                        4. プライバシーポリシーの変更について
                    </h2>
                    <p>
                        当サイトは、個人情報に関して適用される日本の法令を遵守するとともに、本ポリシーの内容を適宜見直しその改善に努めます。修正された最新のプライバシーポリシーは常に本ページにて開示されます。
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