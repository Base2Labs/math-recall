/**
 * Configuration class for the Test Screen.
 * Enforces that all required properties are present and valid upon instantiation.
 */
export class TestScreenConfig {
    /**
     * @param {string} type - The practice type (addition, subtraction, multiplication)
     * @param {number} number - The number selected for practice
     * @param {number} count - Total number of questions
     */
    constructor(type, number, count) {
        if (!type) {
            throw new Error("TestScreenConfig: 'type' is required");
        }
        if (number === undefined || number === null) {
            throw new Error("TestScreenConfig: 'number' is required");
        }
        if (!count || count <= 0) {
            throw new Error("TestScreenConfig: 'count' must be a positive number");
        }

        this.type = type;
        this.number = number;
        this.count = count;
    }
}
