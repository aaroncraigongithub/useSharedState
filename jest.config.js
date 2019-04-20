module.exports = {
  bail: 1,
  // collectCoverage: true,
  // collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  // coverageDirectory: 'coverage',
  // coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/__tests__'],

  // A list of reporter names that Jest uses when writing coverage reports
  // coverageReporters: [
  //   "json",
  //   "text",
  //   "lcov",
  //   "clover"
  // ],

  // preset: null,
  testEnvironment: 'enzyme',
  testRegex: '.+?/__tests__/.+?.spec.tsx?$',
  setupFilesAfterEnv: ['jest-enzyme'],
};
