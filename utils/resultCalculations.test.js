const { calculateTotalTime, calculateAverageTime, calculatePercentage, formatTime } = require('./resultCalculations');

describe('Result Calculations', () => {
    describe('calculateTotalTime', () => {
        it('should correctly sum array of times', () => {
            const times = [1000, 2000, 3000];
            expect(calculateTotalTime(times)).toBe(6000);
        });

        it('should return 0 for empty array', () => {
            expect(calculateTotalTime([])).toBe(0);
        });

        it('should return 0 for null/undefined', () => {
            expect(calculateTotalTime(null)).toBe(0);
            expect(calculateTotalTime(undefined)).toBe(0);
        });
    });

    describe('calculateAverageTime', () => {
        it('should correctly calculate average', () => {
            expect(calculateAverageTime(10000, 5)).toBe(2000);
        });

        it('should handle decimals correctly (float result)', () => {
            expect(calculateAverageTime(10000, 3)).toBeCloseTo(3333.333, 2);
        });

        it('should return 0 if count is 0', () => {
            expect(calculateAverageTime(10000, 0)).toBe(0);
        });
    });

    describe('calculatePercentage', () => {
        it('should correctly calculate percentage', () => {
            expect(calculatePercentage(5, 10)).toBe(50);
            expect(calculatePercentage(3, 4)).toBe(75);
        });

        it('should round to nearest integer', () => {
            expect(calculatePercentage(1, 3)).toBe(33); // 33.33
            expect(calculatePercentage(2, 3)).toBe(67); // 66.66
        });

        it('should return 0 if total is 0', () => {
            expect(calculatePercentage(5, 0)).toBe(0);
        });
    });

    describe('formatTime', () => {
        it('should format seconds only', () => {
            expect(formatTime(45000)).toBe('45s');
        });

        it('should format minutes and seconds', () => {
            expect(formatTime(90000)).toBe('1m 30s'); // 1.5 min
        });

        it('should handle exact minutes', () => {
            expect(formatTime(60000)).toBe('1m 0s');
        });

        it('should handle 0', () => {
            expect(formatTime(0)).toBe('0s');
        });
    });
});
