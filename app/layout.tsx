import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "才能開花・偉人診断プロファイリング",
    description: "歴史上の偉人があなたの真の才能を鑑定します",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ja">
            <body className={`${inter.className} bg-slate-50 min-h-screen flex flex-col`}>
                {/* メインコンテンツエリア：flex-growにより、コンテンツが少ない場合でもフッターを最下部に押し下げます */}
                <main className="flex-grow">
                    {children}
                </main>

                {/* 共通フッター：利用規約、プライバシーポリシー、運営者情報へのリンクを含みます */}
                <Footer />

                {/* Googleアナリティクス設定：ユーザーのアクセス解析を自動で行います */}
                <GoogleAnalytics gaId="G-EDG9J0HY35" />
            </body>
        </html>
    );
}