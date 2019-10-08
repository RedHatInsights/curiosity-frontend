import React from 'react';
import { mount, shallow } from 'enzyme';
import _get from 'lodash/get';
import { GettextExtractor, JsExtractors } from 'gettext-extractor';
import { I18n, translate } from '../i18n';
import enLocales from '../../../../public/locales/en-US';

const textExtractor = () => {
  const extractor = new GettextExtractor();
  extractor
    .createJsParser([
      JsExtractors.callExpression(['t', '[this].t', 'translate'], {
        arguments: {
          text: 0,
          context: 1
        }
      })
    ])
    .parseFilesGlob('./src/**/!(*.test|*.spec).@(js|jsx)');

  return extractor;
};

describe('I18n Component', () => {
  const getText = textExtractor();

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

  it('should attempt to perform a string replace', () => {
    const localeKey = translate('lorem.ipsum');
    const placeholder = translate('lorem.ipsum', 'hello world');

    expect({
      localeKey,
      placeholder
    }).toMatchSnapshot('translate');
  });

  it('should generate a predictable pot output snapshot', () => {
    expect(getText.getPotString()).toMatchSnapshot('pot output');
  });

  it('should have locale keys that exist in the default language JSON', () => {
    const messages = (getText.getMessages && getText.getMessages()) || [];
    const missingKeys = [];

    messages.forEach(value => {
      const keyCheck = (value && value.text) || '';

      if (keyCheck && !_get(enLocales, keyCheck, null)) {
        missingKeys.push(keyCheck);
      }
    });

    expect(missingKeys).toMatchSnapshot('missing locale keys');
  });
});
