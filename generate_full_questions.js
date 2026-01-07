import fs from 'fs';

const csvData1 = `1,最新のガジェットやテクノロジーの情報は、常にいち早くチェックしたい。,common
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

const csvData2 = `71,SNSで素敵なライフスタイルを見つけると、自分も取り入れたいと強く思う。,female_casual
72,直感や「ときめき」を信じて、思い切った買い物や決断をすることが多い。,female_casual
73,自分の好きなことや得意なことを通じて、誰かを笑顔にすることに幸せを感じる。,female_casual
74,流行りのカフェや話題のスポットには、並んででも一度は行ってみたい。,female_casual
75,言葉にしなくても、相手の表情や雰囲気から気持ちを察するのが得意だ。,female_casual
76,自分のセンスを活かして、身の回りのものを可愛く・美しく整えるのが好きだ。,female_casual
77,新しい自分に出会うために、自分磨きや美容への投資は惜しまない。,female_casual
78,ロジカルな正論よりも、まずは気持ちに寄り添ってほしいと思うことが多い。,female_casual
79,憧れの人やインフルエンサーがお勧めしているものは、信頼してチェックする。,female_casual
80,自分の選んだものや行動に対して、周囲からポジティブな反応をもらうと嬉しい。,female_casual
81,何気ない日常の中に、写真に撮りたくなるような美しさを見つけるのが得意だ。,female_casual
82,クリエイティブな活動（表現・料理・装飾など）をしている時は時間を忘れる。,female_casual
83,人と競い合って勝つよりも、お互いを高め合える関係性を築きたい。,female_casual
84,新しいトレンドを誰よりも早くキャッチし、周りに教えるのが好きだ。,female_casual
85,旅先での体験や新しい出会いは、自分の価値観を大きく変えてくれると思う。,female_casual
86,計画通りに動くよりも、その時の気分やインスピレーションを大切にしたい。,female_casual
87,小さな変化や気遣いに気づいてくれる人に対して、深い信頼を寄せる。,female_casual
88,自分の個性を活かせる場所なら、少しくらい忙しくても輝ける自信がある。,female_casual
89,香りや音、手触りなど、五感を刺激されるものに囲まれて暮らしたい。,female_casual
90,「世界観」や「ストーリー」のあるブランドや商品に強く惹かれる。,female_casual
91,自分のコミュニティの中で、ムードメーカーや橋渡し役になることが多い。,female_casual
92,憧れの未来を実現するために、ビジョンボードを作ったり目標を書いたりする。,female_casual
93,苦手なことを克服するより、好きなことを伸ばして生きていきたい。,female_casual
94,心の通い合う友人と、深い話をしながら過ごす時間は何物にも代えがたい。,female_casual
95,誰かの真似ではなく、自分だけの「オリジナルな魅力」を追求したい。,female_casual
96,感情の起伏をエネルギーに変えて、表現や仕事に活かすことができる。,female_casual
97,周囲の期待に応えることより、自分の心が納得できるかどうかを重視する。,female_casual
98,整理された空間よりも、好きなものに囲まれた少し賑やかな空間が落ち着く。,female_casual
99,将来的には、自分の名前がブランドになるような活動をしてみたい。,female_casual
100,愛と感謝に溢れた、調和の取れた世界を作ることが自分の究極の願いだ。,female_casual
101,家計や資産の管理は、先を見通してコツコツと丁寧に行いたい。,female_highclass
102,変化の激しい環境よりも、ルーチンが確立された安定した環境を好む。,female_highclass
103,周囲の人が波風立てず、穏やかに過ごせている状態が一番安心する。,female_highclass
104,物を買う時は、流行よりも「長く使えるか」「コスパが良いか」を重視する。,female_highclass
105,突飛なアイデアよりも、地に足の着いた現実的な解決策を信頼する。,female_highclass
106,派手な生活よりも、慎ましいけれど質の高い、丁寧な暮らしを理想とする。,female_highclass
107,自分の意見を押し通すより、周囲の意見を調整してまとめる方が得意だ。,female_highclass
108,健康管理や食生活には気を配り、規則正しい生活を送るよう意識している。,female_highclass
109,困った時に頼れるのは、新しい知人より長く付き合ってきた古い友人だ。,female_highclass
110,誰かの役に立っているという実感が、自分の生きがいや自信に繋がる。,female_highclass
111,リスクの高い投資や挑戦よりも、着実な貯蓄や守りの姿勢を大切にしたい。,female_highclass
112,目立つ場所でリーダーをやるより、裏方でサポートする方が実力を発揮できる。,female_highclass
113,整理整頓や掃除をすることで、心が整い、前向きな気持ちになれる。,female_highclass
114,物事のルールやマナーを重んじ、礼儀正しい振る舞いを心がけている。,female_highclass
115,予期せぬトラブルにも動じないよう、常に最善の準備をしておきたい。,female_highclass
116,家族や身近な人との時間を何より優先し、大切に守り抜きたい。,female_highclass
117,専門的な難しい話より、生活に密着した役立つ情報を知るのが好きだ。,female_highclass
118,謙虚であることを美徳とし、常に感謝の気持ちを忘れないようにしている。,female_highclass
119,決まった時間に寝起きし、安定したリズムで毎日を過ごすことに幸せを感じる。,female_highclass
120,自分が納得したものであれば、周りにどう思われても長く愛用し続ける。,female_highclass
121,コミュニティの中では、聞き役に回り、安心感を与える存在でありたい。,female_highclass
122,新しいことを始める時は、経験者の意見や口コミを十分に調べてからにする。,female_highclass
123,植物を育てたり、季節の行事を大切にしたりする、穏やかな時間が好きだ。,female_highclass
124,「足るを知る」という考え方を大切にし、現状の幸せに感謝している。,female_highclass
125,責任感が強く、一度引き受けた役割は最後まで完璧にこなしたい。,female_highclass
126,多忙な日々よりも、心にゆとりのある「余白」のある生活を望んでいる。,female_highclass
127,他人のプライベートに干渉せず、適度な距離感を保つことが礼儀だと思う。,female_highclass
128,教科書や伝統的なやり方に倣うことで、安心感と確実性を得られる。,female_highclass
129,派手なキャリアアップより、自分にできることをコツコツ続ける人生を歩みたい。,female_highclass
130,自分がいることで、周囲に安心感と笑顔が広がるような存在になりたい。,female_highclass`;

const fullCsv = csvData1.trim() + '\n' + csvData2.trim();
const lines = fullCsv.split('\n');

const questions = lines.map(line => {
    // Simple split by comma, assuming no internal commas in question text for now,
    // (though real CSV parsing is better, the provided data looks clean enough or simple logic suffices)
    // The previous prompt's data had commas inside the question text! 
    // e.g. "最新のガジェットやテクノロジーの情報は、常にいち早くチェックしたい。"
    // So simple split(',') will fail.

    // I should use the regex method I wrote before.
    // Format: id,question,groupId
    // The regex /^(\d+),(.+),([a-zA-Z_]+)$/ works because groupId is at the end and id at start.
    const match = line.match(/^(\d+),(.+),([a-zA-Z_]+)$/);
    if (match) {
        // Also assign category logic for fallback compatibility if needed
        let cat = 'Male_A'; // default
        const gid = match[3];
        const id = parseInt(match[1]);

        if (gid === 'common') {
            const cats = ['Male_A', 'Male_B', 'Female_A', 'Female_B'];
            cat = cats[(id - 1) % 4];
        } else if (gid === 'male_casual') cat = 'Male_A';
        else if (gid === 'male_highclass') cat = 'Male_B';
        else if (gid === 'female_casual') cat = 'Female_A';
        else if (gid === 'female_highclass') cat = 'Female_B';

        return {
            id: id,
            question: match[2],
            groupId: gid,
            category: cat // Adding category for safety with existing logic
        };
    }
    return null;
}).filter(q => q !== null);

fs.writeFileSync('data/questions.json', JSON.stringify(questions, null, 2));
console.log(`Generated ${questions.length} questions.`);
