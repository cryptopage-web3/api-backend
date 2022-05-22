module.exports = {
    moduleFileExtensions: ["js", "json"],
    testEnvironment: 'node',
    testEnvironmentOptions: {
        NODE_ENV: 'test',
    },
    rootDir: 'test',
    coverageDirectory: '../coverage',
    coveragePathIgnorePatterns: ['node_modules', 'index.js', 'test'],
    coverageReporters: ['text', 'lcov', 'clover', 'html'],
};
