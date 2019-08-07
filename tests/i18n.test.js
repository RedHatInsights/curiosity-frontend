const get = require('lodash/get');
const { GettextExtractor, JsExtractors } = require('gettext-extractor');
const enLocales = require('../public/locales/en-US');

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

describe('i18n locale', () => {
  const getText = textExtractor();

  it('should generate a predictable pot output snapshot', () => {
    expect(getText.getPotString()).toMatchSnapshot('pot output');
  });

  it('should have locale keys that exist in the default language JSON', () => {
    const messages = (getText.getMessages && getText.getMessages()) || [];
    const missingKeys = [];

    messages.forEach(value => {
      const keyCheck = (value && value.text) || '';

      if (keyCheck && !get(enLocales, keyCheck, null)) {
        missingKeys.push(keyCheck);
      }
    });

    expect(missingKeys).toMatchSnapshot('missing locale keys');
  });
});
