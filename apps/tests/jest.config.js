/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
    preset: "ts-jest",
    testEnvironment: "node",
    extensionsToTreatAsEsm: [".ts"],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                useESM: true,
            },
        ],
    },
    // testTimeout: 10000,
    testMatch: ["**/*.test.ts"],
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};