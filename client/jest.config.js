module.exports = {
    // ...other config options
    moduleNameMapper: {
        '\\.css$': '<rootDir>/src/__mocks__/styleMock.js',
    },
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};