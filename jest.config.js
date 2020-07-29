module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  globalSetup: '<rootDir>/src/testSetup.ts',
  globalTeardown: '<rootDir>/src/testTeardown.ts',
};
