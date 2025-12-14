import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist', 'coverage'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react': react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'arrow-parens': ['error', 'as-needed', { 'requireForBlockBody': true }],
      'comma-dangle': ['error', 'always-multiline'],
      'curly': ['error', 'all'],
      'no-console': 'error',
      'quotes': ['error', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': false }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/jsx-max-props-per-line': ['error', { 'maximum': 3 }],
      'react/jsx-one-expression-per-line': ['error', { allow: "non-jsx" }],
      'semi': ['error', 'always'],
    },
  },
]
