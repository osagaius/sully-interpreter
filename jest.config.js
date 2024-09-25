module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/backend/tests'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    maxWorkers: 1,
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
