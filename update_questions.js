const fs = require('fs');

const csvData = `1,最新のガジェットやテクノロジーの情報は、常にいち早くチェックしたい。,common
2,周囲との調和を何より大切にし、グループの和を乱さないよう意識している。,common
3,多少のリスクがあっても、自分の力で大きな成果や報酬を得たいという野心がある。,common
4,困っている人がいると放っておけず、親身になってサポートすることに喜びを感じる。,common
5,物事を進める際は、直感よりも過去のデータや論理的な根拠を重視する。,common
6,自分のセンスや感性を活かして、新しいトレンドやスタイルを世の中に広めたい。,common
7,組織のルールや規律を守ることは、自由に行動することよりも重要だと思う。,common
8,自分の知らない世界や新しい体験に対して、強い好奇心と行動力を持っている。,common
9,競争社会で勝ち抜くことよりも、安定した環境で長く働き続けることを望んでいる。,common
10,自分のこだわりや専門性を追求し、一目置かれるスペシャリストを目指したい。,common
11,最新の投資ニュースや経済動向は、毎日欠かさずチェックしている。,male_casual
12,多少のリスクがあっても、リターンが大きいなら迷わず勝負に出る。,male_casual
13,自分のビジネスやスキルが、将来的に世界規模で通用するかを常に考えている。,male_casual
14,成功者の自伝や、最新のビジネス理論を学ぶことに時間と金を惜しまない。,male_casual
15,SNSでの発信やパーソナルブランディングは、現代の必須スキルだと思う。,male_casual
16,既存の古いルールを破壊し、新しい価値を創造することにワクワクする。,male_casual
17,周囲から「普通じゃない」「変わっている」と言われることは褒め言葉だ。,male_casual
18,直感的に「これだ！」と思ったものは、論理的な説明ができなくても信じる。,male_casual
19,効率化よりも、まずは圧倒的な行動量で市場を圧倒すべきだ。,male_casual
20,尊敬できるメンターや、意識の高いコミュニティに属することが重要だ。,male_casual
21,AIやブロックチェーンなどの最先端技術は、自分の人生を劇的に変えると信じている。,male_casual
22,将来的には組織に属さず、自分の名前一つで稼げる力を身につけたい。,male_casual
23,人がやっていないニッチな市場を見つけると、すぐに独占したくなる。,male_casual
24,会議や話し合いよりも、まずはプロトタイプを作って動かす方が合理的だ。,male_casual
25,自分の年収や社会的地位を、同世代と比較して高い位置に保ちたい。,male_casual
26,複雑な課題に直面した時ほど、アドレナリンが出て燃えるタイプだ。,male_casual
27,高級車や時計などのステータスシンボルは、自分のモチベーション維持に必要だ。,male_casual
28,常に複数のプロジェクトを同時並行で進める方が、集中力が高まる。,male_casual
29,失敗はデータの一部であり、立ち止まる理由にはならない。,male_casual
30,プレゼンやスピーチなど、大勢の前で自分のビジョンを語るのが得意だ。,male_casual
31,都会的で洗練された環境で働くことが、クリエイティビティに直結する。,male_casual
32,新しいアプリやツールが出たら、とりあえずインストールして触ってみる。,male_casual
33,市場のトレンドが右と言えば、あえて左にチャンスがないか探す。,male_casual
34,自分のアイデアを形にするためなら、睡眠時間を削っても苦にならない。,male_casual
35,強力なライバルがいる環境の方が、自分の実力が最大限に発揮される。,male_casual
36,抽象的な議論よりも、具体的な「稼げる仕組み」の話に興味がある。,male_casual
37,センスの良さとロジックの強さ、どちらか選ぶならセンスを重視したい。,male_casual
38,決断までのスピードが、ビジネスの成否を分ける一番の要因だと思う。,male_casual
39,常に「自分をアップデートできているか」という不安と戦っている。,male_casual
40,歴史に名を残すような、大きなインパクトを社会に与えたい。,male_casual
41,自分の専門分野において、誰にも負けない知識量を持っている自信がある。,male_highclass
42,感情に流されず、常にエビデンス（証拠）に基づいて判断を下したい。,male_highclass
43,仕事の進め方は、型化・マニュアル化されている方が心地よい。,male_highclass
44,予測不可能なサプライズよりも、計画通りに進む安定した日常を好む。,male_highclass
45,読書をするなら、実用書や学術書など知識が増えるものを選びたい。,male_highclass
46,他人の意見に左右されず、自分の分析結果を最後まで信じ抜く。,male_highclass
47,無駄な会議や飲み会は、自分の時間を奪う最大の敵だと思う。,male_highclass
48,数字やグラフを見て、裏にある本質的な課題を見抜くのが得意だ。,male_highclass
49,目先の利益よりも、長期的に積み上がるキャリアや資産を重視する。,male_highclass
50,道具やガジェットは「多機能」よりも「耐久性と本質的性能」で選ぶ。,male_highclass
51,一つのことを極める「職人気質」な生き方に強く憧れる。,male_highclass
52,リスク管理を徹底し、プランBやCまで用意してから行動に移す。,male_highclass
53,人脈を広げることよりも、信頼できる数少ないパートナーを大切にしたい。,male_highclass
54,新しい流行には懐疑的で、それが本物かどうかを見極めるまで手を出さない。,male_highclass
55,自分の思考を整理するために、一人で静かに過ごす時間が不可欠だ。,male_highclass
56,手際よく作業を進めることよりも、正確でミスのない仕事を高く評価する。,male_highclass
57,プログラミングや数学的な思考回路に親しみを感じる。,male_highclass
58,派手な成功よりも、着実に資産を形成していく方が賢い生き方だと思う。,male_highclass
59,周囲がパニックになっている時ほど、冷静に状況を俯瞰できる。,male_highclass
60,結論から話さない、要領を得ない説明を聞くのが苦手だ。,male_highclass
61,歴史や哲学など、物事の根本にある原理原則を学ぶのが好きだ。,male_highclass
62,世の中の仕組みや「勝ち筋」をロジカルに解明することに快感を覚える。,male_highclass
63,必要以上に目立ったり、表舞台で注目を浴びたりすることに興味はない。,male_highclass
64,複雑な問題をシンプルに分解して、他人に説明するのが得意だ。,male_highclass
65,「なんとなく」という理由で物事を決定することは、プロ失格だと思う。,male_highclass
66,定年退職後も、自分の専門知識を活かして社会に関わり続けたい。,male_highclass
67,人間関係も一つのシステムとして捉え、合理的に対処しようとする。,male_highclass
68,整理整頓されたデスクや環境が、思考の明快さに直結する。,male_highclass
69,権威や肩書きよりも、その人が「何を成し遂げたか」という事実を重視する。,male_highclass
70,自分が去った後も残るような、完璧なシステムや仕組みを構築したい。,male_highclass`;

const lines = csvData.trim().split('\n');
const questions = lines.map(line => {
    // Split by first 2 commas only, in case question has commas (though logic here assumes simple CSV)
    // The given data doesn't seem to have valid questions containing commas that would break this simple split,
    // assuming format "id,question,groupId".
    // Better regex for CSV:
    const match = line.match(/^(\d+),(.+),([a-zA-Z_]+)$/);
    if (match) {
        return {
            id: parseInt(match[1]),
            question: match[2],
            groupId: match[3]
        };
    }
    return null;
}).filter(q => q !== null);

// Add dummies for 71-130
const groups = [
    { start: 71, end: 100, id: 'female_casual', name: 'カジュアル女性' },
    { start: 101, end: 130, id: 'female_highclass', name: 'ハイクラス女性' }
];

groups.forEach(g => {
    for (let i = g.start; i <= g.end; i++) {
        questions.push({
            id: i,
            question: `${g.name}の質問 (ID:${i})`,
            groupId: g.id
        });
    }
});

fs.writeFileSync('data/questions.json', JSON.stringify(questions, null, 2));
console.log(`Generated ${questions.length} questions.`);
