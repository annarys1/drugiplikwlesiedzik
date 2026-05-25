import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import jsxA11y from 'eslint-plugin-jsx-a11y' // Importujemy wtyczkę WCAG
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended, // Włączamy automatyczne sprawdzanie WCAG
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Dodatkowe, rygorystyczne reguły dostępności dla zespołu:
      'jsx-a11y/alt-text': 'error',       // Każdy obrazek musi mieć opis dla czytników
      'jsx-a11y/aria-props': 'error',     // Atrybuty ARIA muszą być poprawne technicznie
      'jsx-a11y/aria-proptypes': 'error', // Wartości w atrybutach ARIA muszą mieć odpowiedni typ
    },
  },
])