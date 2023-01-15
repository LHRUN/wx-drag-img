module.exports = {
  bail: 1,
  verbose: true,
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,ts}',
    '!<rootDir>/src/weui-wxss/**',
    '!**/__test__/**'
  ]
}