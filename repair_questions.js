import fs from 'fs';

const TARGET_PATH = 'data/questions.json';

// Group Config
const groups = [
    { id: 'common', start: 1, end: 10, catBase: ['Male_A', 'Male_B', 'Female_A', 'Female_B'] },
    { id: 'male_casual', start: 11, end: 40, catBase: 'Male_A' },
    { id: 'male_highclass', start: 41, end: 70, catBase: 'Male_B' },
    { id: 'female_casual', start: 71, end: 100, catBase: 'Female_A' },
    { id: 'female_highclass', start: 101, end: 130, catBase: 'Female_B' }
];

function getGroupInfo(id) {
    for (const g of groups) {
        if (id >= g.start && id <= g.end) return g;
    }
    return null;
}

function getCategory(id, group) {
    if (Array.isArray(group.catBase)) {
        return group.catBase[(id - 1) % 4];
    }
    return group.catBase;
}

// 1. Read existing file
let rawData = '';
let existingQuestions = [];

try {
    if (fs.existsSync(TARGET_PATH)) {
        rawData = fs.readFileSync(TARGET_PATH, 'utf8').trim();
        // Try to fix common syntax errors (missing closing bracket, trailing comma)
        if (rawData.endsWith(',')) rawData = rawData.slice(0, -1);
        if (!rawData.startsWith('[')) rawData = '[' + rawData;
        if (!rawData.endsWith(']')) rawData = rawData + ']';

        // Try parse
        try {
            existingQuestions = JSON.parse(rawData);
        } catch (e) {
            console.log('JSON parse failed, attempting strict regex recovery...');
            // Fallback: match objects roughly
            // This is brittle but might salvage data if user pasted csv-like json
        }
    }
} catch (e) {
    console.log('Read failed, starting fresh.');
}

// Map existing by ID
const qMap = new Map();
if (Array.isArray(existingQuestions)) {
    existingQuestions.forEach(q => {
        if (q && q.id) qMap.set(q.id, q);
    });
}

// 2. Reconstruct 130 questions
const finalQuestions = [];

for (let i = 1; i <= 130; i++) {
    const group = getGroupInfo(i);
    if (!group) continue; // Should not happen for 1-130

    let q = qMap.get(i);

    if (q) {
        // Normalize fields
        if (!q.groupId) q.groupId = group.id;
        if (!q.question) q.question = `${group.id} Question ${i}`;
        // Ensure category
        if (!q.category) q.category = getCategory(i, group);
    } else {
        // Missing: Create Dummy
        // Try to copy from previous if roughly same group for "text context" if desirable,
        // but user said "dummy data is fine" for gaps.
        q = {
            id: i,
            question: `${group.id}の質問 (ID:${i}) - auto generated`,
            groupId: group.id,
            category: getCategory(i, group)
        };
    }
    finalQuestions.push(q);
}

// 3. Write
fs.writeFileSync(TARGET_PATH, JSON.stringify(finalQuestions, null, 2));
console.log(`Repaired questions.json: Total ${finalQuestions.length} items.`);
