/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
