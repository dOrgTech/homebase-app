/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.spec.ts', '**/__tests__/**/*.spec.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  // Allow absolute imports based on tsconfig baseUrl (src)
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  clearMocks: true,
  testEnvironmentOptions: {},
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json'
    }
  }
}
