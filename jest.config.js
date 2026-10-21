module.exports = {
  preset: 'jest-preset-angular',

  setupFilesAfterEnv: [
    '<rootDir>/setup-jest.ts'
  ],

  testEnvironment: 'jsdom',

  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$|@ionic/core/.*\\.js$|@ionic/angular/.*\\.js$|ionicons/.*\\.js$|@angular/common/locales/.*\\.js$)'
  ],

  moduleNameMapper: {
    '^ionicons/components/ion-icon\\.js$': '<rootDir>/node_modules/ionicons/components/ion-icon.js'
  },

  testMatch: [
    '**/+(*.)+(spec).+(ts)'
  ],

  collectCoverage: true,

  coverageDirectory: 'coverage'
};
