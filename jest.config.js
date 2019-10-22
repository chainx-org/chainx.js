module.exports = {
  rootDir: 'packages',
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    '~(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['mjs', 'js', 'node', 'json'],
  transform: {
    '^.+\\.(js)$': 'babel-jest',
  },
  testRegex: ['(/__tests__/.*|(\\.|/)(test|spec))\\.js?$'],
};
