import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import importHelpers from 'eslint-plugin-import-helpers';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'import-helpers': importHelpers,
    },
   rules: {
      'import-helpers/order-imports': [
        'warn',
        {
          newlinesBetween: 'always',
          groups: [
            'module',
            ['parent', 'sibling', 'index'],
          ],
          alphabetize: { order: 'asc', ignoreCase: true },
        },
      ],
    },
  },
])
