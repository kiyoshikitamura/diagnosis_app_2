const fs = require('fs');
const { parse } = require('csv-parse/sync');

const CSV_PATH = './data/diagnosis_results_master.csv';
const JSON_PATH = './data/result_data.json';

try {
    const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const resultData = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));

    const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    });

    records.forEach(record => {
        const { id, animal_name, emoji, catchphrase, base_description, result_text } = record;
        if (resultData[id]) {
            resultData[id].animal_name = animal_name;
            resultData[id].emoji = emoji;
            resultData[id].catchphrase = catchphrase;
            resultData[id].base_description = base_description;
            // CSV内の \n を実際の改行に戻す処理
            resultData[id].result_text = result_text.replace(/\\n/g, '\n');
        }
    });

    fs.writeFileSync(JSON_PATH, JSON.stringify(resultData, null, 4), 'utf-8');
    console.log('✨ 成功: 偉人の診断テキストを更新しました！');
} catch (error) {
    console.error('❌ エラー:', error.message);
}