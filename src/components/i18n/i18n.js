import React, { useState, useEffect } from 'react';
import i18next from 'i18next';
import XHR from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { useMount } from 'react-use';
import { helpers } from '../../common/helpers';
import { EMPTY_CONTEXT, translate, translateComponent } from './i18nHelpers';

/**
 * Populate, load, remote locale strings.
 *
 * @memberof Components
 * @module i18n
 * @property {module} i18nHelpers
 */

/**
 * Load I18n.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.fallbackLng=process.env.REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG]
 * @param {string} [props.loadPath=process.env.REACT_APP_CONFIG_SERVICE_LOCALES_PATH]
 * @param {string} [props.locale]
 * @returns {JSX.Element}
 */
const I18n = ({
  children,
  fallbackLng = process.env.REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG,
  loadPath = process.env.REACT_APP_CONFIG_SERVICE_LOCALES_PATH,
  locale
}) => {
  const [initialized, setInitialized] = useState(false);

  /**
   * Initialize i18next
   */
  useMount(async () => {
    try {
      await i18next
        .use(XHR)
        .use(initReactI18next)
        .init({
          backend: {
            loadPath
          },
          fallbackLng,
          lng: undefined,
          debug: !helpers.PROD_MODE,
          ns: ['default'],
          defaultNS: 'default',
          react: {
            useSuspense: false
          }
        });
    } catch (e) {
      //
    }

    setInitialized(true);
  });

  /**
   * Update locale.
   */
  useEffect(() => {
    if (initialized && locale) {
      try {
        i18next.changeLanguage(locale);
      } catch (e) {
        //
      }
    }
  }, [initialized, locale]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return (initialized && children) || <React.Fragment />;
};

export { I18n as default, I18n, i18next, translate, translateComponent, EMPTY_CONTEXT };
