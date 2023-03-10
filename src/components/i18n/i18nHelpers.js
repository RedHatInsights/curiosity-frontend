import React from 'react';
import i18next from 'i18next';
import { Trans } from 'react-i18next';
import { helpers } from '../../common/helpers';

/**
 * @memberof i18n
 * @module i18nHelpers
 */

/**
 * Check to help provide an empty context.
 *
 * @type {string}
 */
const EMPTY_CONTEXT = 'LOCALE_EMPTY_CONTEXT';

/**
 * A placeholder for "t", translation method.
 * Associated with the i18n package, and typically used as a default prop.
 *
 * @param {string|Array} key
 * @param {string|object|Array} value
 * @param {Array} components
 * @returns {string}
 */
const noopTranslate = (key, value, components) => {
  const updatedKey = (Array.isArray(key) && `[${key}]`) || key;
  const updatedValue =
    (typeof value === 'string' && value) ||
    (Array.isArray(value) && `[${value}]`) ||
    (Object.keys(value || '').length && JSON.stringify(value)) ||
    '';
  const updatedComponents = (components && `${components}`) || '';

  return `t(${updatedKey}${(updatedValue && `, ${updatedValue}`) || ''}${
    (updatedComponents && `, ${updatedComponents}`) || ''
  })`;
};

/**
 * Split a string on underscore.
 *
 * @param {string} value
 * @param {object} settings
 * @param {string} settings.emptyContextValue
 * @returns {string|string[]}
 */
const splitContext = (value, { emptyContextValue = EMPTY_CONTEXT } = {}) => {
  if (typeof value === 'string' && value !== emptyContextValue && /_/.test(value)) {
    return value.split('_');
  }
  return value;
};

/**
 * Parse extend context arrays/lists, and apply values to a concatenated translate key.
 *
 * @param {string|Array} translateKey
 * @param {*|string|Array} context
 * @param {object} settings
 * @param {string} settings.emptyContextValue
 * @param {Function} settings.splitContext
 * @returns {{translateKey: string, context: (string|string[])}}
 */
const parseContext = (
  translateKey,
  context,
  { emptyContextValue = EMPTY_CONTEXT, splitContext: aliasSplitContext = splitContext } = {}
) => {
  let updatedTranslateKey = translateKey;
  let updatedContext = context;

  if (updatedContext) {
    updatedContext = aliasSplitContext(updatedContext);
  }

  if (Array.isArray(updatedContext)) {
    const tempContext = updatedContext
      .map(value => (value === emptyContextValue && ' ') || aliasSplitContext(value))
      .flat()
      .filter(value => typeof value === 'string' && value.length > 0);

    if (tempContext?.length > 1) {
      const lastContext = tempContext.pop();

      if (Array.isArray(updatedTranslateKey)) {
        updatedTranslateKey[0] = `${updatedTranslateKey[0]}_${tempContext.join('_')}`;
      } else {
        updatedTranslateKey = `${updatedTranslateKey}_${tempContext.join('_')}`;
      }

      updatedContext = lastContext;
    } else {
      updatedContext = tempContext.join('_');
    }
  } else if (updatedContext === emptyContextValue) {
    updatedContext = ' ';
  }

  return {
    context: updatedContext,
    translateKey: updatedTranslateKey
  };
};

/**
 * Parse a translation key. If an array, filter for defined strings.
 *
 * @param {*|string|Array} translateKey
 * @returns {*}
 */
const parseTranslateKey = translateKey => {
  let updatedTranslateKey = translateKey;

  if (Array.isArray(updatedTranslateKey)) {
    updatedTranslateKey = updatedTranslateKey.filter(value => typeof value === 'string' && value.length > 0);
  }

  return updatedTranslateKey;
};

/**
 * Apply a string towards a key. Optional replacement values and component/nodes.
 * See, https://react.i18next.com/
 *
 * @param {string|Array} translateKey A key reference, or an array of a primary key with fallback keys.
 * @param {string|object|Array} values
 *     - A default string if the key can't be found.
 *     - An object with i18next settings. i.e. "{ context: Array|string, testId: boolean|string }"
 *     - An array of objects (key/value) pairs used to replace string tokens. i.e. "[{ hello: 'world' }]"
 * @param {Array} components An array of HTML/React nodes used to replace string tokens. i.e. "[<span />, <React.Fragment />]"
 * @param {object} settings
 * @param {*} settings.i18next
 * @param {Function} settings.isDebug
 * @param {Function} settings.noopTranslate
 * @param {Function} settings.parseContext
 * @param {Function} settings.parseTranslateKey
 * @returns {string|React.ReactNode}
 */
const translate = (
  translateKey,
  values = null,
  components,
  {
    i18next: aliasI18next = i18next,
    isDebug = helpers.TEST_MODE,
    noopTranslate: aliasNoopTranslate = noopTranslate,
    parseContext: aliasParseContext = parseContext,
    parseTranslateKey: aliasParseTranslateKey = parseTranslateKey
  } = {}
) => {
  const updatedValues = values || {};
  const baseUpdatedTranslateKey = aliasParseTranslateKey(translateKey);
  let updatedTranslateKey = baseUpdatedTranslateKey;

  if (updatedValues?.context) {
    const { context: parsedContext, translateKey: parsedAgainTranslateKey } = aliasParseContext(
      updatedTranslateKey,
      updatedValues.context
    );
    updatedTranslateKey = parsedAgainTranslateKey;
    updatedValues.context = parsedContext;
  }

  if (isDebug) {
    return aliasNoopTranslate(updatedTranslateKey, updatedValues, components);
  }

  if (components) {
    return (
      (aliasI18next.store && (
        <Trans i18nKey={updatedTranslateKey} values={updatedValues} components={components} />
      )) || <React.Fragment>t({updatedTranslateKey})</React.Fragment>
    );
  }

  if (aliasI18next.store) {
    if (updatedValues?.testId) {
      const updatedTestId =
        (typeof updatedValues?.testId === 'string' && updatedValues?.testId.length > 0 && updatedValues?.testId) ||
        baseUpdatedTranslateKey;
      return (
        <span className="curiosity-translate__test-id" data-test={updatedTestId}>
          {aliasI18next.t(updatedTranslateKey, updatedValues)}
        </span>
      );
    }

    return aliasI18next.t(updatedTranslateKey, updatedValues);
  }

  return `t([${updatedTranslateKey}])`;
};

/**
 * Apply string replacements against a component, HOC.
 *
 * @param {React.ReactNode} Component
 * @param {object} settings
 * @param {*} settings.i18next
 * @param {Function} settings.noopTranslate
 * @returns {React.ReactNode}
 */
const translateComponent = (
  Component,
  { i18next: aliasI18next = i18next, noopTranslate: aliasNoopTranslate = noopTranslate } = {}
) => {
  const withTranslation = ({ ...props }) => (
    <Component
      {...props}
      t={(aliasI18next.store && translate) || aliasNoopTranslate}
      i18n={(aliasI18next.store && aliasI18next) || helpers.noop}
    />
  );

  withTranslation.displayName = 'withTranslation';
  return withTranslation;
};

const i18nHelpers = {
  EMPTY_CONTEXT,
  noopTranslate,
  parseContext,
  parseTranslateKey,
  splitContext,
  translate,
  translateComponent
};

export {
  i18nHelpers as default,
  i18nHelpers,
  EMPTY_CONTEXT,
  noopTranslate,
  parseContext,
  parseTranslateKey,
  splitContext,
  translate,
  translateComponent
};
