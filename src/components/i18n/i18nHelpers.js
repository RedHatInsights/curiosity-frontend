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
 * Apply a string towards a key. Optional replacement values and component/nodes.
 * See, https://react.i18next.com/
 *
 * @param {string|Array} translateKey A key reference, or an array of a primary key with fallback keys.
 * @param {string|object|Array} values A default string if the key can't be found. An object with i18next settings. Or an array of objects (key/value) pairs used to replace string tokes. i.e. "[{ hello: 'world' }]"
 * @param {Array} components An array of HTML/React nodes used to replace string tokens. i.e. "[<span />, <React.Fragment />]"
 * @param {object} options
 * @param {string} options.emptyContextValue Check to allow an empty context value.
 * @returns {string|React.ReactNode}
 */
const translate = (translateKey, values = null, components, { emptyContextValue = EMPTY_CONTEXT } = {}) => {
  const updatedValues = values || {};
  let updatedTranslateKey = translateKey;
  const splitContext = value => {
    if (typeof value === 'string' && value !== emptyContextValue && /_/.test(value)) {
      return value.split('_');
    }
    return value;
  };

  if (Array.isArray(updatedTranslateKey)) {
    updatedTranslateKey = updatedTranslateKey.filter(value => typeof value === 'string' && value.length > 0);
  }

  if (updatedValues?.context) {
    updatedValues.context = splitContext(updatedValues.context);
  }

  if (Array.isArray(updatedValues?.context)) {
    const updatedContext = updatedValues.context
      .map(value => (value === emptyContextValue && ' ') || splitContext(value))
      .flat()
      .filter(value => typeof value === 'string' && value.length > 0);

    if (updatedContext?.length > 1) {
      const lastContext = updatedContext.pop();

      if (Array.isArray(updatedTranslateKey)) {
        updatedTranslateKey[0] = `${updatedTranslateKey[0]}_${updatedContext.join('_')}`;
      } else {
        updatedTranslateKey = `${updatedTranslateKey}_${updatedContext.join('_')}`;
      }

      updatedValues.context = lastContext;
    } else {
      updatedValues.context = updatedContext.join('_');
    }
  } else if (updatedValues?.context === emptyContextValue) {
    updatedValues.context = ' ';
  }

  if (helpers.TEST_MODE) {
    return helpers.noopTranslate(updatedTranslateKey, updatedValues, components);
  }

  if (components) {
    return (
      (i18next.store && <Trans i18nKey={updatedTranslateKey} values={updatedValues} components={components} />) || (
        <React.Fragment>t({updatedTranslateKey})</React.Fragment>
      )
    );
  }

  return (i18next.store && i18next.t(updatedTranslateKey, updatedValues)) || `t([${updatedTranslateKey}])`;
};

/**
 * Apply string replacements against a component, HOC.
 *
 * @param {React.ReactNode} Component
 * @returns {React.ReactNode}
 */
const translateComponent = Component => {
  const withTranslation = ({ ...props }) => (
    <Component
      {...props}
      t={(i18next.store && translate) || helpers.noopTranslate}
      i18n={(i18next.store && i18next) || helpers.noop}
    />
  );

  withTranslation.displayName = 'withTranslation';
  return withTranslation;
};

const i18nHelpers = {
  EMPTY_CONTEXT,
  translate,
  translateComponent
};

export { i18nHelpers as default, i18nHelpers, EMPTY_CONTEXT, translate, translateComponent };
