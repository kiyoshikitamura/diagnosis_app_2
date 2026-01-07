'use client';

import { useEffect, useState } from 'react';
import resultData from '@/data/result_data.json';
import adLinks from '@/data/ad_links.json'; // 作成した広告リンクファイルを読み込み

interface AnimalResult {
    animal_name: string;
    base_description: string;
    result_text: string;
    ad_title: string;
    animal_id: string;
}

export default function ResultPage() {
    const [result, setResult] = useState<AnimalResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [adUrl, setAdUrl] = useState<string>('https://example.com/default'); // デフォルトURL

    useEffect(() => {
        try {
            const answersJson = localStorage.getItem('diagnosis_answers');
            const userType = localStorage.getItem('user_type') || 'male_casual';

            if (!answersJson) {
                setError('回答データが見つかりません。最初から診断をやり直してください。');
                return;
            }

            const answers = JSON.parse(answersJson);

            // スコア計算 (X軸: 11-25問目, Y軸: 26-40問目)
            const scoreX = answers.slice(10, 25).reduce((a: number, b: any) => a + (Number(b) || 0), 0);
            const scoreY = answers.slice(25, 40).reduce((a: number, b: any) => a + (Number(b) || 0), 0);

            const getRank = (s: number) => {
                if (s <= 30) return 0;
                if (s <= 45) return 1;
                if (s <= 60) return 2;
                return 3;
            };

            const rankX = getRank(scoreX);
            const rankY = getRank(scoreY);

            const animalOrder = [
                'lion', 'owl', 'fox', 'chimpanzee',
                'elephant', 'panda', 'dolphin', 'barn_owl',
                'kangaroo', 'cheetah', 'tiger', 'peacock',
                'cat', 'wolf', 'beaver', 'golden_retriever'
            ];
            const animalId = animalOrder[rankX * 4 + rankY];

            // 判定キーの生成
            const finalKey = `${animalId}_${userType}`;

            // 1. 動物のテキストデータを取得
            const foundData = (resultData as Record<string, any>)[finalKey];
            if (!foundData) {
                setError(`判定データ（${finalKey}）が見つかりません。`);
                return;
            }
            setResult(foundData as AnimalResult);

            // 2. 広告URLを ad_links.json から取得
            const link = (adLinks as Record<string, string>)[finalKey];
            if (link) {
                setAdUrl(link);
            }

        } catch (e) {
            console.error(e);
            setError('予期せぬエラーが発生しました。');
        }
    }, []);

    if (error) {
        return (
            <div className="p-10 text-center flex flex-col items-center">
                <p className="text-red-500 mb-4 font-bold">{error}</p>
                <button onClick={() => window.location.href = '/'} className="text-indigo-600 underline">
                    トップに戻ってやり直す
                </button>
            </div>
        );
    }

    if (!result) return <div className="p-10 text-center text-slate-400">結果を分析中...</div>;

    const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shareText = `【AI動物診断結果】私の本質は「${result.animal_name}」タイプでした！\n${result.base_description}\n#AI動物診断`;

    return (
        <div className="max-w-md mx-auto min-h-screen p-6 bg-slate-50 flex flex-col items-center">
            {/* 結果カード */}
            <div className="w-full bg-white rounded-3xl shadow-xl overflow-hidden mb-6 border border-gray-100">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-500 p-8 text-center text-white">
                    <p className="text-sm opacity-90 mb-2 font-medium tracking-widest uppercase">Result</p>
                    <h1 className="text-3xl font-black leading-tight">{result.animal_name}タイプ</h1>
                </div>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <p className="text-gray-600 italic font-medium leading-relaxed">
                            "{result.base_description}"
                        </p>
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-100">
                        <h3 className="font-bold text-blue-900 mb-3 flex items-center text-lg">
                            <span className="mr-2">💡</span>アドバイス
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                            {result.result_text}
                        </p>
                    </div>

                    <div className="bg-orange-50 border-2 border-orange-100 rounded-2xl p-6 mb-2 text-center">
                        <h3 className="font-bold text-orange-700 mb-2 text-sm uppercase tracking-wider">Next Step</h3>
                        <p className="text-xs text-orange-600 mb-4 font-bold">{result.ad_title}</p>
                        <a
                            href={adUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-orange-500 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-orange-600 active:scale-95 transition-all text-center"
                        >
                            今すぐ詳細を見る
                        </a>
                    </div>
                </div>
            </div>

            {/* シェアボタン */}
            <div className="w-full grid grid-cols-2 gap-3 mb-8">
                <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-black text-white py-4 rounded-2xl font-bold shadow-md hover:opacity-80 transition-all text-sm"
                >
                    Xでシェア
                </a>
                <a
                    href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#06C755] text-white py-4 rounded-2xl font-bold shadow-md hover:opacity-80 transition-all text-sm"
                >
                    LINEで送る
                </a>
            </div>

            <button
                onClick={() => window.location.href = '/'}
                className="text-gray-400 text-sm underline pb-10"
            >
                診断をやり直す
            </button>
        </div>
    );
}