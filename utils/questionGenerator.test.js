import { generateQuestions } from './questionGenerator';

describe('questionGenerator', () => {
    describe('addition', () => {
        it('generates correct number of questions', () => {
            const questions = generateQuestions('addition', 5, 10);
            expect(questions).toHaveLength(10);
        });

        it('includes the selected number in operands', () => {
            const selectedNumber = 5;
            const questions = generateQuestions('addition', selectedNumber, 5);

            questions.forEach(q => {
                const hasSelectedNumber = q.operand1 === selectedNumber || q.operand2 === selectedNumber;
                expect(hasSelectedNumber).toBe(true);
            });
        });

        it('calculates correct answers', () => {
            const questions = generateQuestions('addition', 5, 5);
            questions.forEach(q => {
                expect(q.operand1 + q.operand2).toBe(q.answer);
                expect(q.operator).toBe('+');
            });
        });
    });

    describe('multiplication', () => {
        it('calculates correct answers', () => {
            const selectedNumber = 3;
            const questions = generateQuestions('multiplication', selectedNumber, 5);
            questions.forEach(q => {
                expect(q.operand1 * q.operand2).toBe(q.answer);
                expect(q.operator).toBe('×');

                const hasSelectedNumber = q.operand1 === selectedNumber || q.operand2 === selectedNumber;
                expect(hasSelectedNumber).toBe(true);
            });
        });
    });

    describe('subtraction', () => {
        it('calculates correct answers', () => {
            const selectedNumber = 4;
            const questions = generateQuestions('subtraction', selectedNumber, 20); // Higher count to hit both logic paths
            questions.forEach(q => {
                expect(q.operand1 - q.operand2).toBe(q.answer);
                expect(q.operator).toBe('-');
                expect(q.answer).toBeGreaterThan(-1); // No negative answers normally expected based on logic
            });
        });

        it('uses selected number correctly', () => {
            const selectedNumber = 4;
            const questions = generateQuestions('subtraction', selectedNumber, 10);
            questions.forEach(q => {
                // Logic: either number - x OR total - number
                const isUsed = q.operand1 === selectedNumber || q.operand2 === selectedNumber;
                // Note: In logic "total = number + x", operand1 is total. operand2 is number. 
                // In "number - subtrahend", operand1 is number.
                expect(isUsed).toBe(true);
            });
        });
    });
});
