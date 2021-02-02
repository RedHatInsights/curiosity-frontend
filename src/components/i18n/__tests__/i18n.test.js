import { readFileSync } from 'fs';
import glob from 'glob';
import React from 'react';
import PropTypes from 'prop-types';
import { mount, shallow } from 'enzyme';
import _get from 'lodash/get';
import { I18n, translate, translateComponent } from '../i18n';
import enLocales from '../../../../public/locales/en-US';

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
  const updatedFiles = glob.sync(files);

  updatedFiles.forEach(file => {
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

  it('should render a basic component', () => {
    const props = {
      locale: 'es'
    };

    const component = mount(
      <I18n {...props}>
        <React.Fragment>lorem ipsum</React.Fragment>
      </I18n>
    );

    expect(component).toMatchSnapshot('basic');
  });

  it('should pass children', () => {
    const component = shallow(
      <I18n>
        <React.Fragment>lorem ipsum</React.Fragment>
      </I18n>
    );

    expect(component.html()).toMatchSnapshot('children');
  });

  it('should attempt to perform translate with a node', () => {
    const ExampleComponent = () => <div>{translate('lorem.ipsum', { hello: 'world' }, [<span id="test" />])}</div>;

    ExampleComponent.propTypes = {};
    ExampleComponent.defaultProps = {};

    const component = shallow(<ExampleComponent />);

    expect(component.html()).toMatchSnapshot('translated node');
  });

  it('should attempt to perform a component translate', () => {
    const ExampleComponent = ({ t }) => <div>{t('lorem.ipsum', 'hello world')}</div>;

    ExampleComponent.propTypes = {
      t: PropTypes.func
    };

    ExampleComponent.defaultProps = {
      t: translate
    };

    const TranslatedComponent = translateComponent(ExampleComponent);
    const component = shallow(<TranslatedComponent />);

    expect(component.html()).toMatchSnapshot('translated component');
  });

  it('should attempt to perform a string replace', () => {
    const localeKey = translate('lorem.ipsum');
    const placeholder = translate('lorem.ipsum', 'hello world');

    expect({
      localeKey,
      placeholder
    }).toMatchSnapshot('translate');
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
