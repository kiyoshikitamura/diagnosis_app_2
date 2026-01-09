import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer"; // ← 追加

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "才能開花・偉人診断プロファイリング",
    description: "歴史上の偉人があなたの真の才能を鑑定します",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <body className={`${inter.className} bg-slate-50 flex flex-col min-h-screen`}>
                {/* メインコンテンツ */}
                <main className="flex-grow">
                    {children}
                </main>

                {/* フッターをここに追加 */}
                <Footer />
            </body>
        </html>
    );
}