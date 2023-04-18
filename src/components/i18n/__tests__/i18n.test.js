import { readFileSync } from 'fs';
import { globSync } from 'glob';
import React from 'react';
import _get from 'lodash/get';
import enLocales from '../../../../public/locales/en-US.json';
import { I18n } from '../i18n';

/**
 * Get translation keys.
 *
 * @param {object} params
 * @param {string} params.files
 * @param {Array} params.list
 * @returns {Array}
 */
const getTranslationKeys = ({ files = './src/**/!(*.test|*.spec).@(js|jsx)', list = ['t', 'translate'] }) => {
  const keys = [];
  const updatedFiles = globSync(files);

  updatedFiles.sort().forEach(file => {
    const fileContent = readFileSync(file, 'utf-8');
    const generateRegExp = list.map(f => `\\b${f}\\([\\d\\D]+?\\)`).join('|');
    const matches = fileContent.match(new RegExp(generateRegExp, 'g'));

    if (matches && matches.length) {
      const filterKeys = matches
        .map(match => {
          const key = match.match(/['`"]([\d\D]+?)['`"][,)]/);

          if (key) {
            return {
              key: (!/\${/.test(key) && key[1]) || '',
              match: match.replace(/\n/g, '').replace(/\s+/g, ' ').trim()
            };
          }

          return null;
        })
        .filter(key => key !== null);

      if (filterKeys.length) {
        keys.push({ file, keys: filterKeys });
      }
    }
  });

  return keys;
};

describe('I18n Component', () => {
  const getKeys = getTranslationKeys({});

  it('should render a basic component', async () => {
    const props = {
      locale: 'es'
    };

    const component = await mountHookComponent(<I18n {...props}>lorem ipsum</I18n>);

    expect(component).toMatchSnapshot('basic');
  });

  it('should pass children', async () => {
    const component = await mountHookComponent(<I18n>lorem ipsum</I18n>);

    expect(component.html()).toMatchSnapshot('children');
  });

  it('should generate a predictable locale key output snapshot', () => {
    expect(getKeys).toMatchSnapshot('key output');
  });

  it('should have locale keys that exist in the default language JSON', () => {
    const keys = getKeys;
    const missingKeys = [];

    keys.forEach(value => {
      value.keys.forEach(subValue => {
        if (subValue.key && !_get(enLocales, subValue.key, null)) {
          missingKeys.push({ file: value.file, key: subValue.key });
        }
      });
    });

    expect(missingKeys).toMatchSnapshot('missing locale keys');
  });
});
