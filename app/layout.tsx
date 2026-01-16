import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

// --- TypeScriptの型定義（ビルドエラー回避用） ---
declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        twq: (...args: any[]) => void;
        dataLayer: any[];
    }
}

// 設定用ID
const GA_MEASUREMENT_ID = 'G-EDG9J0HY35';
const X_PIXEL_ID = 'r0m8s';

export const metadata: Metadata = {
    title: '偉人診断 | あなたの魂に宿る偉人は誰？',
    description: '16タイプ性格診断をベースにした本格偉人診断。あなたの本質と、現代での生存戦略を解き明かします。',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ja">
            <head>
                {/* --- Google Analytics (gtag.js) --- */}
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}
                </Script>

                {/* --- X (Twitter) Pixel Base Code --- */}
                <Script id="x-pixel" strategy="afterInteractive">
                    {`
            !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
            },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
            a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
            twq('config','${X_PIXEL_ID}');
          `}
                </Script>
            </head>
            <body className={inter.className}>
                <div className="min-h-screen bg-slate-50">
                    {children}
                </div>
            </body>
        </html>
    );
}