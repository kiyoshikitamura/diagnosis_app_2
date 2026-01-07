export type ResultData = {
  title: string;
  description: string;
  strength: string;
  weakness: string;
  advice: string;
};

export type ResultPattern = ResultData & { id: string };

export const resultMap: Record<string, ResultData> = {
  // Sample: 3333 (All High)
  "3333": {
    title: "究極のバランス型",
    description: "あなたは全ての要素を高いレベルで兼ね備えた万能タイプです。",
    strength: "情熱と冷静さ、直感と論理を使い分ける柔軟性。リーダーシップとサポート力の両立。",
    weakness: "器用貧乏になりがちで、一つに絞ることが苦手な一面も。",
    advice: "全てを自分でこなそうとせず、得意な領域にリソースを集中させることで、さらに大きな成果が得られます。"
  },
  // Sample: 3111 (Male_A Dominant - Casual/High score on Male_A)
  "3111": {
    title: "野心的な開拓者",
    description: "上昇志向と独立心が強く、自らの力で未来を切り開くパイオニアです。",
    strength: "圧倒的な行動力、リスクを恐れないチャレンジ精神、人を惹きつけるカリスマ性。",
    weakness: "協調性に欠ける場面や、細部をおろそかにしてしまう傾向があります。",
    advice: "周囲のサポートに感謝し、チームビルディングを意識すると、あなたのビジョンはより強固なものになるでしょう。"
  },
  // Sample: 3211 (Male_A 3, Male_B 2)
  "3211": {
    title: "戦略的リーダー",
    description: "情熱を持ちつつも、冷静な計算と戦略で物事を進める実力派です。",
    strength: "ビジョンを現実的な計画に落とし込む能力、バランスの取れた判断力。",
    weakness: "考えすぎて行動が遅れることや、感情論を軽視しがちな点。",
    advice: "時には理屈抜きで熱意を伝えることこそが、人を動かす鍵になります。"
  },
  // Sample: 1111 (All Low)
  "1111": {
    title: "眠れる才能型",
    description: "まだ本気を出していない、あるいは慎重になりすぎている大器晩成タイプ。",
    strength: "物事を深く慎重に考える力、リスク回避能力。",
    weakness: "自信不足によるチャンスの喪失、消極的な姿勢。",
    advice: "まずは「失敗してもいい」と割り切り、小さな一歩を踏み出すことから始めましょう。"
  }
  // Add other patterns as needed
};

export function getResult(id: string): ResultPattern {
  const data = resultMap[id];
  if (data) {
    return { ...data, id };
  }

  // Fallback
  return {
    id,
    title: "診断完了",
    description: "あなたの診断結果IDは " + id + " です。",
    strength: "分析中...",
    weakness: "分析中...",
    advice: "より詳細な結果については、カウンセラーにご相談ください。"
  };
}
