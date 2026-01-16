const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'diagnosis_links.csv');
const jsonPath = path.join(__dirname, 'data', 'result_data.json');
const publicJsonPath = path.join(__dirname, 'public', 'result_data.json');

function cleanA8Html(html) {
    if (!html) return "";

    // CSVから読み込まれた生の文字列を極限まで掃除
    let clean = html.trim();

    // 外側の引用符を剥ぎ取る
    if (clean.startsWith('"')) clean = clean.substring(1);
    if (clean.endsWith('"')) clean = clean.substring(0, clean.length - 1);

    // 連続する引用符 "" を " に、エスケープ \" を " に
    clean = clean.replace(/""/g, '"');
    clean = clean.replace(/\\"/g, '"');

    // バックスラッシュが残るのを防ぐ
    clean = clean.replace(/\\/g, '');

    return clean;
}

function parseCsvRow(row) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        const nextChar = row[i + 1];

        if (char === '"' && inQuotes && nextChar === '"') {
            current += '"';
            i++;
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

async function updateJson() {
    try {
        // 1. ファイルを読み込む（キャッシュ回避のため毎回読み込み）
        if (!fs.existsSync(jsonPath)) {
            console.error('❌ JSON file not found at:', jsonPath);
            return;
        }

        const fileContent = fs.readFileSync(jsonPath, 'utf8');
        const jsonData = JSON.parse(fileContent);

        const csvData = fs.readFileSync(csvPath, 'utf8');
        const rows = csvData.split(/\r?\n/);

        console.log(`Processing ${rows.length - 1} rows from CSV...`);

        for (let i = 1; i < rows.length; i++) {
            if (!rows[i].trim()) continue;

            const columns = parseCsvRow(rows[i]);
            if (columns.length < 6) continue;

            const [type, attribute, ad_title, ad_text, ad_link_text, a8_html] = columns;
            const t = type.trim().toLowerCase();
            const a = attribute.trim().toLowerCase();

            if (jsonData[t]) {
                if (!jsonData[t].monetization) jsonData[t].monetization = {};

                jsonData[t].monetization[a] = {
                    ad_title: ad_title || "",
                    ad_text: ad_text || "",
                    ad_link_text: ad_link_text || "",
                    // クリーンアップを2段階で適用
                    a8_html: cleanA8Html(a8_html)
                };
            }
        }

        // 2. 物理的な保存（インデントを維持して保存）
        const output = JSON.stringify(jsonData, null, 2);

        // dataフォルダとpublicフォルダの両方に上書き
        fs.writeFileSync(jsonPath, output, 'utf8');

        if (!fs.existsSync(path.dirname(publicJsonPath))) {
            fs.mkdirSync(path.dirname(publicJsonPath), { recursive: true });
        }
        fs.writeFileSync(publicJsonPath, output, 'utf8');

        console.log('✅ Update Complete.');

        // 3. 最後に直接ファイルを読み直して中身を確認するデバッグ
        const reRead = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        const finalCheck = reRead['entj']?.monetization['high_male']?.a8_html;
        console.log('--- Final Check ---');
        console.log(finalCheck);

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

updateJson();