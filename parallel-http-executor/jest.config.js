module.exports = {
    moduleFileExtensions: ['js', 'ts'],
    transform: {
        '^.+\\.ts?$': 'ts-jest'
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    testMatch: ['**/test/**/*.(test).ts']
};
