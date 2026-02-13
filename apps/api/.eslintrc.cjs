module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'prettier',
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'import/no-named-as-default': 'off',
    'import/no-unresolved': 'off',
    'import/named': 'off',
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
        groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index']],
      },
    ],
  },
};
