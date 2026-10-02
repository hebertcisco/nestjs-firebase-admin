import eslint from '@eslint/js';
import jest from 'eslint-plugin-jest';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', 'src/**/*.test.ts', 'src/**/files/**', 'test/**'],
  },
  eslint.configs.recommended,
  {
    files: ['lib/**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: jest.environments.globals.globals,
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    files: ['lib/**/*.spec.ts'],
    ...jest.configs['flat/recommended'],
    rules: {
      'jest/no-export': 'off',
      'jest/no-disabled-tests': 'off',
      'jest/expect-expect': 'off',
      'jest/valid-title': 'off',
    },
  },
];
