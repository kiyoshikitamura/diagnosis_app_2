const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'diagnosis_links.csv');
const jsonPath = path.join(__dirname, 'data', 'result_data.json');
const publicJsonPath = path.join(__dirname, 'public', 'result_data.json');

/**
 * 広告コードの徹底的な掃除と属性の引用符補完
 */
function cleanA8Html(html) {
    if (!html) return "";
    let clean = html.trim();

    // 1. CSV特有の外側の引用符を剥ぎ取る
    if (clean.startsWith('"')) clean = clean.substring(1);
    if (clean.endsWith('"')) clean = clean.substring(0, clean.length - 1);

    // 2. エスケープや重複引用符を一度リセット
    clean = clean.replace(/\\"/g, '"');
    clean = clean.replace(/""/g, '"');
    clean = clean.replace(/\\/g, '');

    // 3. 【最重要】属性値に引用符がない場合に強制的に付ける
    // src=/ads/test.jpg  ->  src="/ads/test.jpg"
    // width=300          ->  width="300"
    // 正規表現で属性の値をキャプチャし、引用符で囲み直す
    clean = clean.replace(/(src|width|height|href|alt|rel)=([^"'\s>]+)/g, '$1="$2"');

    return clean;
}

/**
 * CSVパース関数（カンマ対応）
 */
function parseCsvLine(line) {
    const result = [];
    let cur = '';
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
            result.push(cur);
            cur = '';
        } else {
            cur += char;
        }
    }
    result.push(cur);
    return result;
}

async function updateJson() {
    try {
        if (!fs.existsSync(jsonPath)) {
            console.error('❌ JSONが見つかりません:', jsonPath);
            return;
        }

        const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        const csvData = fs.readFileSync(csvPath, 'utf8');
        const rows = csvData.split(/\r?\n/);

        for (let i = 1; i < rows.length; i++) {
            if (!rows[i].trim()) continue;

            const cols = parseCsvLine(rows[i]);
            if (cols.length < 6) continue;

            const [type, attr, title, text, linkText, a8HtmlRaw] = cols;
            const t = type.trim().toLowerCase();
            const a = attr.trim().toLowerCase();

            if (jsonData[t]) {
                if (!jsonData[t].monetization) jsonData[t].monetization = {};
                jsonData[t].monetization[a] = {
                    ad_title: title,
                    ad_text: text,
                    ad_link_text: linkText,
                    a8_html: cleanA8Html(a8HtmlRaw)
                };
            }
        }

        const output = JSON.stringify(jsonData, null, 2);

        // 物理ファイルへの書き込み
        fs.writeFileSync(jsonPath, output, 'utf8');

        if (!fs.existsSync(path.dirname(publicJsonPath))) {
            fs.mkdirSync(path.dirname(publicJsonPath), { recursive: true });
        }
        fs.writeFileSync(publicJsonPath, output, 'utf8');

        console.log('✅ Success: JSON has been cleaned and synced.');

        // デバッグ確認
        const check = jsonData['entj']?.monetization['high_male']?.a8_html;
        console.log('--- Final Check Output ---');
        console.log(check);

    } catch (e) {
        console.error('❌ Error:', e);
    }
}

updateJson();