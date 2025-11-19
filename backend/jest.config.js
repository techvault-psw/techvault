module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/routes/**/*.test.ts'],
  collectCoverageFrom: ['src/routes/**/*.ts'],
  globalSetup: '<rootDir>/jest-global-setup.js',
  globalTeardown: '<rootDir>/jest-global-teardown.js',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  setupFiles: ['dotenv/config'],
};
