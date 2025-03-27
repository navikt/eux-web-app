module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: [
    '<rootDir>'
  ],
  modulePaths: [
    '<rootDir>/src'
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx)',
    '**/?(*.)+(spec|test).+(ts|tsx)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.svg(\\?react)?$': 'jest-transformer-svg'
  },
  moduleDirectories: [
    'node_modules'
  ],
  moduleNameMapper: {
    '^.+\\.(jpg|jpeg|png|gif|css|less)$': "<rootDir>/__mocks__/fileMock.js",
    '^(.*).svg\\?react$': '$1.svg'
  },
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.ts'
  ],
  coverageThreshold: {
    'global': {
      'branches': 90,
      'functions': 90,
      'lines': 90,
      'statements': 90
    },
    'src/actions': {
      'branches': 100,
      'functions': 100,
      'lines': 100,
      'statements': 100
    }
  },
  collectCoverageFrom: [
    "src/actions/*.{ts,tsx}",
    "src/applications/**/*.{ts,tsx}",
    "src/components/**/*.{ts,tsx}",
    "src/pages/**/*.{ts,tsx}",
    "src/reducers/*.{ts,tsx}",
    "src/utils/*.{ts,tsx}"
  ]
}
