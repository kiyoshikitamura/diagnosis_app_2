const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'diagnosis_links.csv');
const jsonPath = path.join(__dirname, 'data', 'result_data.json');

console.log('--- HTML対応・最終スクリプト ---');

try {
    const csvRaw = fs.readFileSync(csvPath, 'utf-8');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const lines = csvRaw.split(/\r?\n/).filter(line => line.trim() !== "");

    let updatedCount = 0;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];

        // CSVの構造: id, attribute, ad_title, ad_text, ad_link_text, a8_html
        // HTMLコードの中にカンマが含まれていても壊れないように「最初の5つのカンマ」で分割
        // または、Excelのタブ区切りを考慮
        let parts = line.split('\t'); // まずタブを試す
        if (parts.length < 5) parts = line.split(','); // ダメならカンマ

        if (parts.length >= 6) {
            const type = parts[0].replace(/^"|"$/g, '').trim().toLowerCase();
            const attr = parts[1].replace(/^"|"$/g, '').trim().toLowerCase();

            // a8_html は 6列目以降のすべて（途中にカンマがあっても結合する）
            let html = parts.slice(5).join(',');
            html = html.replace(/^"|"$/g, '').trim(); // 前後の引用符を削除

            if (jsonData[type]) {
                jsonData[type].monetization = jsonData[type].monetization || {};
                jsonData[type].monetization[attr] = {
                    ad_title: "",
                    ad_text: "",
                    ad_link_text: "",
                    a8_html: html
                };

                if (updatedCount < 1) {
                    console.log(`[CHECK] Type: ${type}, Attr: ${attr}`);
                    console.log(`[CHECK] HTML Preview: ${html.substring(0, 50)}...`);
                }
                updatedCount++;
            }
        }
    }

    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf-8');
    console.log('---------------------------------');
    console.log(`✅ Success: ${updatedCount} 件を反映しました！`);

} catch (e) {
    console.error('❌ Error:', e.message);
}