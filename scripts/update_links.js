const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

// パス設定
const csvPath = path.join(process.cwd(), 'diagnosis_links.csv');
const jsonPath = path.join(process.cwd(), 'data/result_data.json');

function updateLinks() {
    // 1. CSVとJSONの読み込み
    const csvRaw = fs.readFileSync(csvPath, 'utf-8');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    // 2. CSVのパース
    const records = parse(csvRaw, {
        columns: true,
        skip_empty_lines: true
    });

    // 3. データの紐付け
    records.forEach(record => {
        const type = record.personality_type; // 例: entj
        const attr = record.user_attribute;   // 例: high_male

        if (jsonData[type]) {
            // monetizationオブジェクトがなければ作成
            if (!jsonData[type].monetization) {
                jsonData[type].monetization = {};
            }

            // 属性ごとの広告データを格納
            jsonData[type].monetization[attr] = {
                ad_title: record.ad_title || "",
                ad_text: record.ad_text || "",
                ad_link_text: record.ad_link_text || "",
                a8_html: record.a8_html || ""
            };
        }
    });

    // 4. JSONの書き出し
    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
    console.log('✅ Success: diagnosis_links.csv has been merged into result_data.json');
}

updateLinks();