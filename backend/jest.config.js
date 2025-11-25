module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/routes/**/*.test.ts'],
  collectCoverageFrom: ['src/routes/**/*.ts'],
  globalSetup: '<rootDir>/src/tests/jest-global-setup.ts',
  globalTeardown: '<rootDir>/src/tests/jest-global-teardown.ts',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  setupFiles: ['dotenv/config'],
};
