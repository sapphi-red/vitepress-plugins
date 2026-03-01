// @ts-check
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import vue from 'eslint-plugin-vue'

export default tseslint.config(
  {
    languageOptions: {
      sourceType: 'module',
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  eslint.configs.recommended,
  ...[...tseslint.configs.recommended, ...tseslint.configs.stylistic].map((c) => {
    if (c.name === 'typescript-eslint/eslint-recommended') {
      // apply to `<script lang='ts'>` in `.vue` files
      c.files = ['**/*.{c|m|}ts', '**/*.vue']
    }
    return c
  }),
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  },
  {
    files: ['**/*.{c|m|}{jt}s', '**/*.vue'],
    rules: {
      'no-empty': ['error', { allowEmptyCatch: true }],
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    },
  },
  eslintConfigPrettier,
  {
    ignores: ['**/dist/**', '**/.vitepress/cache/**'],
  },
)
