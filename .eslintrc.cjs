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
        'plugin:vue/vue3-recommended',
        'prettier'
      ],
      parserOptions: {
        parser: '@typescript-eslint/parser'
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
        'prettier'
      ],
      rules: {
        'no-empty': ['error', { allowEmptyCatch: true }],
        '@typescript-eslint/no-unused-vars': 'off'
      }
    }
  ],
  reportUnusedDisableDirectives: true
}
