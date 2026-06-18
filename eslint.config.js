import js from '@eslint/js';
import react from 'eslint-plugin-react';

export default [
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        atob: 'readonly',
        btoa: 'readonly',
        console: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        React: 'readonly'
      }
    },
    plugins: {
      react
    },
    rules: {
      'react/jsx-uses-vars': 'error'
    }
  }
];
