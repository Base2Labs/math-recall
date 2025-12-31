import { calculateTotalTime, calculateAverageTime, calculatePercentage, formatTime } from './resultCalculations';

describe('resultCalculations', () => {
    describe('calculateTotalTime', () => {
        it('sums up array of times', () => {
            expect(calculateTotalTime([100, 200, 300])).toBe(600);
        });

        it('returns 0 for empty array', () => {
            expect(calculateTotalTime([])).toBe(0);
        });

        it('returns 0 for null/undefined', () => {
            expect(calculateTotalTime(null)).toBe(0);
            expect(calculateTotalTime(undefined)).toBe(0);
        });
    });

    describe('calculateAverageTime', () => {
        it('calculates correct average', () => {
            expect(calculateAverageTime(1000, 10)).toBe(100);
        });

        it('returns 0 if count is 0', () => {
            expect(calculateAverageTime(1000, 0)).toBe(0);
        });
    });

    describe('calculatePercentage', () => {
        it('calculates correct percentage', () => {
            expect(calculatePercentage(8, 10)).toBe(80);
            expect(calculatePercentage(1, 3)).toBe(33); // 33.333 rounded
        });

        it('returns 0 if total is 0', () => {
            expect(calculatePercentage(5, 0)).toBe(0);
        });
    });

    describe('formatTime', () => {
        it('formats seconds correctly', () => {
            expect(formatTime(45000)).toBe('45s');
        });

        it('formats minutes and seconds correctly', () => {
            expect(formatTime(90000)).toBe('1m 30s'); // 1.5 mins
        });

        it('handles exact minutes', () => {
            expect(formatTime(60000)).toBe('1m 0s');
        });

        it('handles 0', () => {
            expect(formatTime(0)).toBe('0s');
        });
    });
});
