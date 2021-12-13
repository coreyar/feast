// Jest configuration
// https://facebook.github.io/jest/docs/en/configuration.html

module.exports = {
  // Modules can be explicitly auto-mocked using jest.mock(moduleName).
  // https://facebook.github.io/jest/docs/en/configuration.html#automock-boolean
  automock: false, // [boolean]

  // This config option can be used here to have Jest stop running tests after the first failure.
  // https://facebook.github.io/jest/docs/en/configuration.html#bail-boolean
  bail: false, // [boolean]

  // The directory where Jest should store its cached dependency information.
  // https://facebook.github.io/jest/docs/en/configuration.html#cachedirectory-string
  // cacheDirectory: '/tmp/<path>', // [string]

  // Indicates whether the coverage information should be collected while executing the test.
  // Because this retrofits all executed files with coverage collection statements,
  // it may significantly slow down your tests.
  // https://facebook.github.io/jest/docs/en/configuration.html#collectcoverage-boolean
  collectCoverage: true, // [boolean]

  // https://facebook.github.io/jest/docs/en/configuration.html#collectcoveragefrom-array
  collectCoverageFrom: ['**/src/**/*.{js,jsx,ts,tsx}', '!**/node_modules/**', '!**/vendor/**'],

  // https://facebook.github.io/jest/docs/en/configuration.html#coveragedirectory-string
  coverageDirectory: '<rootDir>/coverage', // [string]

  // coveragePathIgnorePatterns: // [array<string>]
  coverageReporters: ['json', "lcov", 'text'], // [array<string>]
  // coverageThreshold: {}, // [object]

  globals: {
    __DEV__: true,
  },

  // https://facebook.github.io/jest/docs/en/configuration.html#mapcoverage-boolean
  // mapCoverage: false, // [boolean]

  // The default extensions Jest will look for.
  // https://facebook.github.io/jest/docs/en/configuration.html#modulefileextensions-array-string
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node'],

  // moduleDirectories: // [array<string>]

  // A map from regular expressions to module names that allow to stub out resources,
  // like images or styles with a single module.
  moduleNameMapper: {
  },

  modulePathIgnorePatterns: ['dist'],
  // modulePaths: // [array<string>]
  // notify: false, // [boolean]
  // preset: // [string]
  // projects: // [array<string>]
  // clearMocks: // [boolean]
  // reporters: // [array<moduleName | [moduleName, options]>]
  // resetMocks: // [boolean]
  // resetModules: // [boolean]
  // resolver: // [string]
  // rootDir: // [string]
  // roots: // [array<string>]
  // setupFiles: // [array<string>]
  // setupTestFrameworkScriptFile: <string>
  // snapshotSerializers: // [array<string>]
  // testEnvironment: // [string]
  // testMatch: // [array<string>]
  // testPathIgnorePatterns: // [array<string>]
  // testRegex: // [string]
  // testResultsProcessor: // [string]
  // testRunner: // [string]
  // testURL: // [string]
  // timers: // [string]

  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '\\.(js|jsx)$': 'babel-jest',
  },

  // transformIgnorePatterns: // [array<string>]
  // unmockedModulePathPatterns: // [array<string>]

  verbose: true, // [boolean]
}
