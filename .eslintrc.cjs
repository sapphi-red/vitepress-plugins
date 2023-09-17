module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest'
  },
  env: {
    node: true
  },
  overrides: [
    {
      files: ['**/*.cjs'],
      parserOptions: {
        sourceType: 'script'
      }
    },
    {
      files: ['**/*.vue'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/stylistic',
        'plugin:vue/vue3-recommended',
        'prettier'
      ],
      parserOptions: {
        parser: '@typescript-eslint/parser'
      },
      rules: {
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/consistent-type-definitions': ['error', 'type']
      }
    },
    {
      files: ['**/*.{js,mjs,cjs}'],
      extends: ['eslint:recommended', 'prettier'],
      rules: {
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'no-empty': ['error', { allowEmptyCatch: true }]
      }
    },
    {
      files: ['**/*.{ts,mts,cts}'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/stylistic',
        'prettier'
      ],
      rules: {
        'no-empty': ['error', { allowEmptyCatch: true }],
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
        '@typescript-eslint/array-type': ['error', { default: 'array-simple' }]
      }
    }
  ],
  reportUnusedDisableDirectives: true
}
