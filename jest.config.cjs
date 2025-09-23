const { transform } = require("lodash");

module.exports = {
  testEnvironment: 'jest-fixed-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}'],
  transformIgnorePatterns: ['/node_modules/'],
};