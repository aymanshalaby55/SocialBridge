const commitlint = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build', // Changes related to build processes or dependencies
        'chore', // General tasks or updates not directly related to code
        'ci', // Changes to Continuous Integration setup like GitHub Actions or Travis
        'docs', // Documentation updates
        'feat', // Adding a new feature
        'fix', // Fixing bugs
        'perf', // Performance improvements
        'refactor', // Code restructuring without changing functionality
        'revert', // Reverting a previous commit
        'style', // Code style changes (formatting, white-space, etc.)
        'test', // Adding or modifying tests
      ],
    ],
    'type-case': [2, 'always', 'lower-case'], // Commit type must be in lower-case
    'type-empty': [2, 'never'], // Commit type cannot be empty
    'subject-empty': [2, 'never'], // Commit subject cannot be empty
    'subject-full-stop': [2, 'never', '.'], // Subject cannot end with a period
    'subject-case': [0, 'always', 'sentence-case'], // No restriction on subject case
    'header-max-length': [2, 'always', 72], // Maximum header length is 72 characters
  },
};

export default commitlint;
