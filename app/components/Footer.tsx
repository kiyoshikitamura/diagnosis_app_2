'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full py-12 px-6 bg-white border-t border-slate-100 mt-auto">
            <div className="max-w-2xl mx-auto text-center">
                {/* リンク一覧 */}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
                    <Link href="/about" className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                        運営者情報
                    </Link>
                    <Link href="/terms" className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                        利用規約
                    </Link>
                    <Link href="/privacy" className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                        プライバシーポリシー
                    </Link>
                </div>

                {/* コピーライト */}
                <p className="text-[10px] text-slate-300 tracking-wider">
                    &copy; {new Date().getFullYear()} 偉人診断プロファイリング
                </p>
            </div>
        </footer>
    );
}