// eslint.config.js (CommonJS, Flat Config)
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettier = require('eslint-config-prettier');

module.exports = [
  // 0) Ignore generated stuff + this config
  { ignores: ['dist/**', 'coverage/**', '.angular/**', 'node_modules/**', 'eslint.config.js'] },

  // 1) TypeScript base + typed rules — apply ONLY to .ts
  //    Use the TS "Project Service" to auto-detect tsconfigs (typed linting).
  ...tseslint.configs.recommended.map((c) => ({ ...c, files: ['**/*.ts'] })),
  ...tseslint.configs.recommendedTypeChecked.map((c) => ({
    ...c,
    files: ['**/*.ts'],
    languageOptions: {
      ...(c.languageOptions ?? {}),
      parser: tseslint.parser,
      parserOptions: {
        ...(c.languageOptions?.parserOptions ?? {}),
        projectService: true,
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
  })),

  // 2) Angular TS rules (scoped to .ts) + inline template linting
  ...angular.configs.tsRecommended.map((c) => ({ ...c, files: ['**/*.ts'] })),
  {
    files: ['**/*.ts'],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],
    },
  },

  // 3) Angular HTML templates — apply ONLY to .html
  ...angular.configs.templateRecommended.map((c) => ({ ...c, files: ['**/*.html'] })),
  ...angular.configs.templateAccessibility.map((c) => ({ ...c, files: ['**/*.html'] })),

  // 4) Let Prettier win on formatting (must be last)
  prettier,
];
