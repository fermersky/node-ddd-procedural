import { pathsToModuleNameMapper } from 'ts-jest';

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  // collectCoverage: true,
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.ts?$',
  // testRegex: '^/tests/.*(toest|spec)\\.ts$',
  testPathIgnorePatterns: ['/node_modules/', '/src/tests/common.ts'],
  moduleNameMapper: pathsToModuleNameMapper({
    '@domain/*': ['<rootDir>/src/domain/*'],
    '@infrastructure/*': ['<rootDir>/src/infrastructure/*'],
    '@api/*': ['<rootDir>/src/api/*'],
  }),
};
