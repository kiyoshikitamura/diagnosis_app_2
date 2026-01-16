import { Metadata } from 'next';
import ResultClient from './ResultClient';

// 常にサーバーサイドで最新のURLパラメータを参照させ、キャッシュを防ぐ
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
    params: Promise<any>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * LINEや𝕏のクローラーに、各タイプごとの画像を確実に伝えるメタデータ生成
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
    const sParams = await props.searchParams;

    // URLからtypeを取得（取得できない場合はデフォルト 'istp'）
    const typeParam = sParams?.type;
    let type = 'istp';

    if (typeof typeParam === 'string') {
        type = typeParam.toLowerCase();
    } else if (Array.isArray(typeParam) && typeParam[0]) {
        type = typeParam[0].toLowerCase();
    }

    const siteUrl = 'https://daiakksindan.jp';
    const imageUrl = `${siteUrl}/results/${type}.png`;
    const pageUrl = `${siteUrl}/result?type=${type}`;

    return {
        title: '偉人診断結果 | あなたの魂に宿る偉人は？',
        description: '診断の結果、私の性格は歴史上のあの偉人にそっくりでした！',
        metadataBase: new URL(siteUrl),
        alternates: {
            canonical: pageUrl, // LINEのクローラーがURLを正規のものとして認識するために必要
        },
        openGraph: {
            title: '魂の偉人診断結果',
            description: 'あなたの中に眠る偉人の才能を解き放て。',
            url: pageUrl,
            siteName: '偉人診断',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: '偉人診断結果カード',
                },
            ],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: '魂の偉人診断結果',
            description: 'あなたの中に眠る偉人の才能を解き放て。',
            images: [imageUrl],
        },
        // LINEやチャットアプリのクローラー向けの補強タグ
        other: {
            'image': imageUrl,
            'og:image:secure_url': imageUrl,
        },
    };
}

/**
 * 表示担当の ResultClient を呼び出し
 */
export default function ResultPage() {
    return <ResultClient />;
}