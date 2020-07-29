module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
    jest: true,
  },
  extends: ['airbnb-base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json', // TS config
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'max-len': ['error', { code: 120 }],
    'object-curly-newline': 0,
    'no-use-before-define': 0,
    'lines-between-class-members': 0,
    'comma-dangle': 0,
    'no-plusplus': 0,
    'import/prefer-default-export': 0,
    'implicit-arrow-linebreak': 0,
    'function-paren-newline': 0,
    'no-restricted-syntax': 0,
    'no-await-in-loop': 0,
    'no-unused-vars': 0,
    'import/no-extraneous-dependencies': 0,
  },
};
