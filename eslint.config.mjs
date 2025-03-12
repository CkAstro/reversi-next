import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import tsParser from '@typescript-eslint/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
   baseDirectory: __dirname,
});

const eslintConfig = [
   ...compat.extends('next/core-web-vitals', 'next/typescript'),

   {
      languageOptions: {
         parser: tsParser,
         parserOptions: {
            projectService: true,
            tsconfigRootDir: import.meta.dirname,
         },
      },
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
         '@typescript-eslint/no-unused-vars': [
            'warn',
            {
               argsIgnorePattern: '^_',
               destructuredArrayIgnorePattern: '^_',
            },
         ],
         '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'warn',
         '@typescript-eslint/no-unnecessary-condition': 'warn',
         '@typescript-eslint/no-unnecessary-qualifier': 'warn',
         '@typescript-eslint/no-unnecessary-type-assertion': 'error',
         '@typescript-eslint/no-unnecessary-type-constraint': 'warn',
         '@typescript-eslint/consistent-generic-constructors': [
            'warn',
            'constructor',
         ],
         '@typescript-eslint/consistent-type-assertions': [
            'warn',
            {
               assertionStyle: 'as',
               objectLiteralTypeAssertions: 'allow-as-parameter',
            },
         ],
         '@typescript-eslint/consistent-type-definitions': [
            'warn',
            'interface',
         ],
         '@typescript-eslint/consistent-type-imports': 'warn',
      },
   },
   {
      rules: {
         'react-hooks/rules-of-hooks': 'error',
         'react-hooks/exhaustive-deps': 'error',
      },
   },
];

export default eslintConfig;
