/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    moduleFileExtensions: ["js", "json","ts"],
    testEnvironment: 'node',
    testEnvironmentOptions: {
        NODE_ENV: 'test',
    },
    rootDir: 'test',
    coverageDirectory: '../coverage',
    coveragePathIgnorePatterns: ['node_modules', 'index.js', 'test'],
    coverageReporters: ['text', 'lcov', 'clover', 'html'],
};
