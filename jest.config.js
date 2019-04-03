module.exports = {
  rootDir: '.',
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    '~(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['mjs', 'js', 'json', 'node'],
  transform: {
    '.js': 'babel-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.js?$',
};
