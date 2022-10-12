import React from 'react';
import PropTypes from 'prop-types';
import { i18nHelpers, EMPTY_CONTEXT, translate, translateComponent } from '../i18nHelpers';

describe('I18nHelpers', () => {
  it('should have specific functions', () => {
    expect(i18nHelpers).toMatchSnapshot('i18nHelpers');
  });

  it('should attempt to perform translate with a node', async () => {
    const ExampleComponent = () => <div>{translate('lorem.ipsum', { hello: 'world' }, [<span id="test" />])}</div>;
    ExampleComponent.propTypes = {};
    ExampleComponent.defaultProps = {};

    const component = await shallowHookComponent(<ExampleComponent />);
    expect(component.html()).toMatchSnapshot('translated node');
  });

  it('should attempt to perform a component translate', async () => {
    const ExampleComponent = ({ t }) => <div>{t('lorem.ipsum', 'hello world')}</div>;
    ExampleComponent.propTypes = {
      t: PropTypes.func
    };

    ExampleComponent.defaultProps = {
      t: translate
    };

    const TranslatedComponent = translateComponent(ExampleComponent);
    const component = await shallowHookComponent(<TranslatedComponent />);
    expect(component.html()).toMatchSnapshot('translated component');
  });

  it('should attempt to perform a string replace', () => {
    const emptyContext = translate('lorem.ipsum', { context: EMPTY_CONTEXT });
    const emptyPartialContext = translate('lorem.ipsum', { context: ['hello', EMPTY_CONTEXT] });
    const localeKey = translate('lorem.ipsum');
    const placeholder = translate('lorem.ipsum', 'hello world');
    const multiContext = translate('lorem.ipsum', { context: ['hello', 'world'] });
    const multiContextWithEmptyValue = translate('lorem.ipsum', { context: ['hello', undefined, null, '', 'world'] });
    const multiKey = translate(['lorem.ipsum', undefined, null, '', 'lorem.fallback']);

    expect({
      emptyContext,
      emptyPartialContext,
      localeKey,
      placeholder,
      multiContext,
      multiContextWithEmptyValue,
      multiKey
    }).toMatchSnapshot('translate');
  });
});
