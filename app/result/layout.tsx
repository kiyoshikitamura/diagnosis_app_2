import { Viewport } from 'next';

/**
 * 警告回避のため、viewportの設定を独立して定義
 */
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // ズームによるレイアウト崩れ防止
};

/**
 * 結果ページのレイアウト
 * メタデータは page.tsx 側で dynamic に生成するため、ここでは定義しません。
 */
export default function ResultLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50">
            {children}
        </div>
    );
}