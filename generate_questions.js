const fs = require('fs');

const questions = [];

// Helper
function addGroup(groupId, start, end, prefix, categoryBase) {
    for (let i = start; i <= end; i++) {
        // Cycle categories for common if needed, or fix them for groups
        let cat = categoryBase;
        if (groupId === 'common') {
            const cats = ['Male_A', 'Male_B', 'Female_A', 'Female_B'];
            cat = cats[(i - 1) % 4];
        }

        questions.push({
            id: i,
            question: `${prefix} (ID:${i})`,
            groupId: groupId,
            category: cat
        });
    }
}

// Generate 130 questions
addGroup('common', 1, 10, 'Common Question', '');
addGroup('male_casual', 11, 40, 'Male Casual Question', 'Male_A');
addGroup('male_highclass', 41, 70, 'Male Highclass Question', 'Male_B');
addGroup('female_casual', 71, 100, 'Female Casual Question', 'Female_A');
addGroup('female_highclass', 101, 130, 'Female Highclass Question', 'Female_B');

// Write
fs.writeFileSync('data/questions.json', JSON.stringify(questions, null, 2));
console.log(`Generated ${questions.length} questions.`);
