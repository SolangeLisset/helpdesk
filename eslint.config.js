import js from '@eslint/js';
import react from 'eslint-plugin-react';

export default [
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}', 'server/**/*.js'],
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
        Blob: 'readonly',
        btoa: 'readonly',
        console: 'readonly',
        crypto: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        process: 'readonly',
        React: 'readonly',
        URL: 'readonly',
        window: 'readonly'
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
