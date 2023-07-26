import React from 'react';
import PropTypes from 'prop-types';
import { i18nHelpers, EMPTY_CONTEXT, translate, translateComponent } from '../i18nHelpers';

describe('I18nHelpers', () => {
  it('should have specific functions', () => {
    expect(i18nHelpers).toMatchSnapshot('i18nHelpers');
  });

  it('should attempt to perform translate with a node', () => {
    const ExampleComponent = () => <div>{translate('lorem.ipsum', { hello: 'world' }, [<span id="test" />])}</div>;
    ExampleComponent.propTypes = {};
    ExampleComponent.defaultProps = {};

    const component = renderComponent(<ExampleComponent />);
    expect(component).toMatchSnapshot('translated node');
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
    const component = renderComponent(<TranslatedComponent />);
    expect(component).toMatchSnapshot('translated component');
  });

  it('should attempt to perform a string replace', () => {
    const emptyContext = translate('lorem.ipsum', { context: EMPTY_CONTEXT });
    const emptyPartialContext = translate('lorem.ipsum', { context: ['hello', EMPTY_CONTEXT] });
    const localeKey = translate('lorem.ipsum');
    const placeholder = translate('lorem.ipsum', 'hello world');
    const stringContext = translate('lorem.ipsum', { context: 'hello' });
    const stringContextNested = translate('lorem.ipsum', { context: 'hello_world_lorem_ipsum_dolor_sit' });
    const multiContext = translate('lorem.ipsum', { context: ['hello', 'world'] });
    const multiContextNested = translate('lorem.ipsum', { context: ['hello', 'world', 'lorem_ipsum_dolor_sit'] });
    const multiContextWithEmptyValue = translate('lorem.ipsum', { context: ['hello', undefined, null, '', 'world'] });
    const multiKey = translate(['lorem.ipsum', undefined, null, '', 'lorem.fallback']);

    expect({
      emptyContext,
      emptyPartialContext,
      localeKey,
      placeholder,
      stringContext,
      stringContextNested,
      multiContext,
      multiContextNested,
      multiContextWithEmptyValue,
      multiKey
    }).toMatchSnapshot('translate');
  });

  it('should attempt to place a test identifier around copy', () => {
    const mockI18next = { store: jest.fn(), t: jest.fn() };

    const basic = renderComponent(
      translate('lorem.ipsum', { testId: true }, undefined, { i18next: mockI18next, isDebug: false })
    );
    const basicString = renderComponent(
      translate('lorem.ipsum', { testId: 'dolor-sit' }, undefined, {
        i18next: mockI18next,
        isDebug: false
      })
    );
    const basicNode = renderComponent(
      translate('lorem.ipsum', { testId: <dolor-sit data-test="dolor-sit" /> }, undefined, {
        i18next: mockI18next,
        isDebug: false
      })
    );
    const emptyContext = renderComponent(
      translate('lorem.ipsum', { context: EMPTY_CONTEXT, testId: true }, undefined, {
        i18next: mockI18next,
        isDebug: false
      })
    );
    const emptyContextString = renderComponent(
      translate('lorem.ipsum', { context: EMPTY_CONTEXT, testId: 'dolor-sit' }, undefined, {
        i18next: mockI18next,
        isDebug: false
      })
    );
    const emptyContextNode = renderComponent(
      translate('lorem.ipsum', { context: EMPTY_CONTEXT, testId: <dolor-sit data-test="dolor-sit" /> }, undefined, {
        i18next: mockI18next,
        isDebug: false
      })
    );
    const emptyPartialContext = renderComponent(
      translate('lorem.ipsum', { context: ['hello', EMPTY_CONTEXT], testId: true }, undefined, {
        i18next: mockI18next,
        isDebug: false
      })
    );
    const emptyPartialContextString = renderComponent(
      translate('lorem.ipsum', { context: ['hello', EMPTY_CONTEXT], testId: 'dolor-sit' }, undefined, {
        i18next: mockI18next,
        isDebug: false
      })
    );
    const emptyPartialContextNode = renderComponent(
      translate(
        'lorem.ipsum',
        { context: ['hello', EMPTY_CONTEXT], testId: <dolor-sit data-test="dolor-sit" /> },
        undefined,
        {
          i18next: mockI18next,
          isDebug: false
        }
      )
    );
    const stringContextNested = renderComponent(
      translate(
        'lorem.ipsum',
        {
          context: 'hello_world_lorem_ipsum_dolor_sit',
          i18next: mockI18next,
          testId: true
        },
        undefined,
        { i18next: mockI18next, isDebug: false }
      )
    );
    const stringContextNestedString = renderComponent(
      translate(
        'lorem.ipsum',
        {
          context: 'hello_world_lorem_ipsum_dolor_sit',
          i18next: mockI18next,
          testId: 'dolor-sit'
        },
        undefined,
        { i18next: mockI18next, isDebug: false }
      )
    );
    const stringContextNestedNode = renderComponent(
      translate(
        'lorem.ipsum',
        {
          context: 'hello_world_lorem_ipsum_dolor_sit',
          i18next: mockI18next,
          testId: <dolor-sit data-test="dolor-sit" />
        },
        undefined,
        { i18next: mockI18next, isDebug: false }
      )
    );

    expect({
      basic: basic.find('span'),
      basicString: basicString.find('span'),
      basicNode,
      emptyContext: emptyContext.find('span'),
      emptyContextString: emptyContextString.find('span'),
      emptyContextNode,
      emptyPartialContext: emptyPartialContext.find('span'),
      emptyPartialContextString: emptyPartialContextString.find('span'),
      emptyPartialContextNode,
      stringContextNested: stringContextNested.find('span'),
      stringContextNestedString: stringContextNestedString.find('span'),
      stringContextNestedNode
    }).toMatchSnapshot('test id');
  });
});
