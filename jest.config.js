
module.exports = {
  preset: 'ts-jest',
  roots: [
    '<rootDir>/src'
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx)',
    '**/?(*.)+(spec|test).+(ts|tsx)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleDirectories: [
    'node_modules'
  ],
  moduleNameMapper: {
    '^.+\\.(jpg|jpeg|png|gif|svg|css|less)$': 'identity-obj-proxy'
  }
}
