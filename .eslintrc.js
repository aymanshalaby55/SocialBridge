module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // Your custom rules

    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    '@typescript-eslint/interface-name-prefix': 'off', // Disable interface name prefix rule
    '@typescript-eslint/explicit-function-return-type': 'off', // Disable explicit return types for functions
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Disable explicit module boundary types
    '@typescript-eslint/no-explicit-any': 'off', // Allow the use of `any` type
    'spaced-comment': 'off', // Disable spaced comment rule
    'no-console': 'warn', // Warn on console.log usage
    'consistent-return': 'off', // Disable consistent return rule
    'func-names': 'off', // Disable function name requirement
    'require-await': 'warn', // Warn on missing async/await
    'promise/always-return': 'off', // Disable promise always return rule
    'promise/catch-or-return': 'off', // Disable promise catch-or-return rule
    'object-shorthand': 'off', // Disable object shorthand rule
    'no-process-exit': 'off', // Disable no-process-exit rule
    'no-param-reassign': 'off', // Disable no-param-reassign rule
    'no-return-await': 'off', // Disable no-return-await rule
    'no-underscore-dangle': 'off', // Disable no-underscore-dangle rule
    'class-methods-use-this': 'off', // Disable class-methods-use-this rule
    'prefer-destructuring': ['error', { object: true, array: false }], // Prefer destructuring for objects only
    'no-unused-vars': 'off', // Disable no-unused-vars (use TypeScript's version instead)
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: 'req|res|next|val|err' },
    ], // TypeScript unused vars rule
    'import/order': 'off', // Disable import order rule
    'import/no-extraneous-dependencies': 'off', // Disable no-extraneous-dependencies rule
    'node/no-extraneous-import': 'off', // Disable no-extraneous-import rule
    'node/no-unpublished-import': 'off', // Disable no-unpublished-import rule
    'import/extensions': 'off',
    camelcase: 'off', // Disable camelcase rule
    'import/prefer-default-export': 'off', // Disable prefer-default-export rule
  },
  settings: {
    'import/resolver': {
      typescript: {}, // Use TypeScript for module resolution
    },
  },
};
