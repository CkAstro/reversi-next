import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
   dir: './',
});

const config: Config = {
   coverageProvider: 'v8',
   testEnvironment: 'jsdom',
   clearMocks: true,
   restoreMocks: true,
   collectCoverage: true,
   collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
   coverageDirectory: 'coverage',
   coverageReporters: ['text-summary', 'lcov'],
   coverageThreshold: {
      global: {
         branches: 0,
         functions: 0,
         lines: 0,
         statements: 0,
      },
   },
   errorOnDeprecated: true,
   moduleNameMapper: {
      '\\.(jpg|jpeg|png|gif|webp|svg|bmp|woff|woff2|ttf)$':
         '<rootDir>/test/mocks/fileMock.js',
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '@/(.*)$': '<rootDir>/src/$1',
   },
   // setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
   // globalTeardown: '<rootDir>/test/teardown.ts',
   fakeTimers: {
      enableGlobally: true,
   },
   verbose: true,
};

export default createJestConfig(config);
