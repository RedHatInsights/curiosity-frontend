import { join } from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import babelParser from '@babel/eslint-parser';
import globals from 'globals';
import stylisticJsPlugin from '@stylistic/eslint-plugin';
import commentLengthPlugin from 'eslint-plugin-comment-length';
import jestPlugin from 'eslint-plugin-jest';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import nodePlugin from 'eslint-plugin-n';
import importPlugin from 'eslint-plugin-import';
import eslintPluginJs from '@eslint/js';
import jsonPlugin from 'eslint-plugin-json';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import airbnbConfig from './config/eslint.config.airbnb.mjs';

export default [
  includeIgnoreFile(join(process.cwd(), '.gitignore')),
  stylisticJsPlugin.configs.all,
  jestPlugin.configs['flat/recommended'],
  jsdocPlugin.configs['flat/recommended'],
  jsxA11yPlugin.flatConfigs.recommended,
  nodePlugin.configs['flat/recommended'],
  importPlugin.flatConfigs.recommended,
  eslintPluginJs.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactHooksPlugin.configs['recommended-latest'],
  ...airbnbConfig,
  prettierPlugin,
  jsonPlugin.configs.recommended,
  {
    plugins: {
      'comment-length': commentLengthPlugin
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        ecmaFeatures: {
          jsx: true
        },
        sourceType: 'module'
      },
      ...reactPlugin.configs.flat.recommended.languageOptions,
      parser: babelParser,
      globals: {
        ...globals.browser,
        ...globals.node,
        mockObjectProperty: 'readonly',
        mockWindowLocation: 'readonly',
        renderHook: 'readonly',
        renderComponent: 'readonly',
        shallowComponent: 'readonly',
        skipIt: 'readonly'
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      '@stylistic/multiline-comment-style': ['warn', 'starred-block'],
      'arrow-parens': ['error', 'as-needed'],
      'comma-dangle': 0,
      'comment-length/limit-single-line-comments': [
        'warn',
        {
          maxLength: 120,
          logicalWrap: true
        }
      ],
      'comment-length/limit-multi-line-comments': [
        'warn',
        {
          maxLength: 120,
          logicalWrap: true
        }
      ],
      // Override Airbnb's error level to warning - allows more flexibility with function returns
      'consistent-return': 1,
      'import/extensions': [
        'error',
        {
          json: 'always'
        }
      ],
      'import/first': 0,
      'import/newline-after-import': 0,
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true
        }
      ],
      // Disable Airbnb's error for importing default and named exports - simplifies imports
      'import/no-named-as-default': 0,
      // Disable Airbnb's error for using named exports from modules with a default export
      'import/no-named-as-default-member': 0,
      'jest/no-done-callback': 0,
      'jest/no-standalone-expect': [2, { additionalTestBlockFunctions: ['skipIt'] }],
      'jest/prefer-to-have-length': 0,
      'jsdoc/check-tag-names': [
        2,
        {
          definedTags: [
            'api',
            'apiDescription',
            'apiSuccess',
            'apiSuccessExample',
            'apiError',
            'apiErrorExample',
            'apiMock',
            'apiParam'
          ]
        }
      ],
      'jsdoc/no-defaults': 0,
      'jsdoc/no-undefined-types': 0,
      'jsdoc/require-jsdoc': 2,
      'jsdoc/require-param': 2,
      'jsdoc/require-param-description': 0,
      'jsdoc/require-param-name': 2,
      'jsdoc/require-param-type': 2,
      'jsdoc/require-property': 2,
      'jsdoc/require-property-description': 0,
      'jsdoc/require-property-name': 2,
      'jsdoc/require-property-type': 2,
      'jsdoc/require-returns': 2,
      'jsdoc/require-returns-description': 0,
      'jsdoc/require-returns-type': 2,
      'jsdoc/tag-lines': [
        'warn',
        'always',
        {
          count: 0,
          applyToEndTag: false,
          startLines: 1
        }
      ],
      'max-len': [
        'error',
        {
          code: 240,
          comments: 120,
          ignoreComments: false,
          ignoreUrls: true
        }
      ],
      'n/no-missing-import': [
        'error',
        {
          allowModules: [],
          resolverConfig: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            mainFiles: ['index']
          }
        }
      ],
      'n/no-unsupported-features/node-builtins': 0,
      'no-case-declarations': 0,
      // Disable Airbnb's warning for console statements - useful for development and debugging
      'no-console': 0,
      'no-continue': 0,
      'no-debugger': 1,
      'no-lonely-if': 1,
      'no-plusplus': 0,
      'no-promise-executor-return': 1,
      'no-restricted-exports': [1, { restrictedNamedExports: [] }],
      'no-restricted-properties': [0, { object: 'Math', property: 'pow' }],
      // Disable Airbnb's error for underscore-prefixed variables - allows for private variables and common patterns
      'no-underscore-dangle': 0,
      'no-unsafe-optional-chaining': 1,
      'prefer-exponentiation-operator': 0,
      'prefer-promise-reject-errors': 1,
      'prefer-regex-literals': 0,
      'prettier/prettier': [
        'error',
        {
          arrowParens: 'avoid',
          singleQuote: true,
          trailingComma: 'none',
          printWidth: 120
        }
      ],
      'react/forbid-prop-types': 0,
      'react/function-component-definition': [
        2,
        { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' }
      ],
      'react/jsx-curly-newline': 0,
      // Disable Airbnb's error that restricts JSX to .jsx files - allows JSX in .js files
      'react/jsx-filename-extension': 0,
      'react/jsx-fragments': [1, 'element'],
      'react/jsx-props-no-spreading': 0,
      'react/jsx-one-expression-per-line': 0,
      'react/jsx-no-constructed-context-values': 1,
      'react/jsx-no-useless-fragment': 1,
      'react/no-unused-prop-types': 1,
      'react/no-unstable-nested-components': 0,
      'react/prop-types': 0,
      'react/state-in-constructor': [1, 'never'],
      'space-before-function-paren': 0,
      'jsx-a11y/anchor-is-valid': 1,
      'jsx-a11y/label-has-associated-control': [
        2,
        {
          labelComponents: ['CustomInputLabel'],
          labelAttributes: ['label'],
          controlComponents: ['CustomInput'],
          depth: 3
        }
      ],
      'jsx-a11y/label-has-for': [
        2,
        {
          components: ['Label'],
          required: {
            some: ['nesting', 'id']
          }
        }
      ]
    }
  }
];
