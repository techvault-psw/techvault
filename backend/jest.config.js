module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/routes/**/*.test.ts'],
  collectCoverageFrom: ['src/routes/**/*.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
};
