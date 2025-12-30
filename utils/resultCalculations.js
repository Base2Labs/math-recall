/**
 * Calculates the total time spent across all questions.
 * @param {number[]} times - Array of times in milliseconds.
 * @returns {number} Total time in milliseconds.
 */
const calculateTotalTime = (times) => {
    if (!times || times.length === 0) return 0;
    return times.reduce((acc, curr) => acc + curr, 0);
};

/**
 * Calculates the average time per question.
 * @param {number} totalTime - Total time in milliseconds.
 * @param {number} count - Total number of questions.
 * @returns {number} Average time in milliseconds. Returns 0 if count is 0.
 */
const calculateAverageTime = (totalTime, count) => {
    if (!count || count <= 0) return 0;
    return totalTime / count;
};

/**
 * Calculates the percentage of correct answers.
 * @param {number} correct - Number of correct answers.
 * @param {number} total - Total number of questions.
 * @returns {number} Percentage (0-100), rounded to nearest integer.
 */
const calculatePercentage = (correct, total) => {
    if (!total || total <= 0) return 0;
    return Math.round((correct / total) * 100);
};

/**
 * Formats milliseconds into a readable string (e.g., "1m 30s" or "45s").
 * @param {number} ms - Time in milliseconds.
 * @returns {string} Formatted time string.
 */
const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
};

module.exports = {
    calculateTotalTime,
    calculateAverageTime,
    calculatePercentage,
    formatTime
};
