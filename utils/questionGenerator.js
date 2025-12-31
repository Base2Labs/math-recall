const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Generates a set of math questions based on the provided configuration.
 * @param {string} type - 'addition', 'subtraction', or 'multiplication'
 * @param {number} number - The selected number to practice with
 * @param {number} count - The number of questions to generate
 * @returns {Array<{operand1: number, operand2: number, operator: string, answer: number}>}
 */
export const generateQuestions = (type, number, count) => {
    const newQuestions = [];
    for (let i = 0; i < count; i++) {
        // Determine operands
        // One operand is the selected 'number'. The other is random 0-9.
        const other = randomInt(0, 9);
        const isFirst = Math.random() < 0.5;

        let question = {};

        if (type === 'addition') {
            question = {
                operand1: isFirst ? number : other,
                operand2: isFirst ? other : number,
                operator: '+',
                answer: number + other
            };
        } else if (type === 'multiplication') {
            question = {
                operand1: isFirst ? number : other,
                operand2: isFirst ? other : number,
                operator: '×',
                answer: number * other
            };
        } else if (type === 'subtraction') {
            // For subtraction, logic ensures valid non-negative results and meaningful drills
            const subtractFromSelected = Math.random() < 0.3; // 30% chance to do number - x

            if (subtractFromSelected) {
                const subtrahend = randomInt(0, number);
                question = {
                    operand1: number,
                    operand2: subtrahend,
                    operator: '-',
                    answer: number - subtrahend
                };
            } else {
                // Subtract selected number from something larger
                const total = number + randomInt(0, 9);
                question = {
                    operand1: total,
                    operand2: number,
                    operator: '-',
                    answer: total - number
                };
            }
        }

        newQuestions.push(question);
    }
    return newQuestions;
};
