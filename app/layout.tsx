import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";

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
            {/* min-h-screen を付与してフッターが沈むように調整 */}
            <body className={`${inter.className} bg-slate-50 min-h-screen flex flex-col`}>
                {/* main に flex-grow をつけることでコンテンツが少ないときもフッターを下に固定 */}
                <main className="flex-grow">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}