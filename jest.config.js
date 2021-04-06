module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  "moduleDirectories": [
    "node_modules",
    "src"
  ],
  setupFilesAfterEnv: ['./jest.setup.js']
};