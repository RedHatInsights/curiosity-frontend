import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import XHR from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { useMount } from 'react-use';
import { helpers } from '../../common/helpers';
import { EMPTY_CONTEXT, translate, translateComponent } from './i18nHelpers';

/**
 * Load I18n.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.fallbackLng
 * @param {string} props.loadPath
 * @param {string} props.locale
 * @returns {React.ReactNode}
 */
const I18n = ({ children, fallbackLng, loadPath, locale }) => {
  const [initialized, setInitialized] = useState(false);

  /**
   * Initialize i18next
   */
  useMount(async () => {
    console.log('>>> mount i18n');
    if (!initialized) {
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
    }
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

  return (initialized && children) || <React.Fragment />;
};

/**
 * Prop types.
 *
 * @type {{loadPath: string, children: React.ReactNode, locale: string, fallbackLng: string}}
 */
I18n.propTypes = {
  children: PropTypes.node.isRequired,
  fallbackLng: PropTypes.string,
  loadPath: PropTypes.string,
  locale: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{loadPath: string, locale: null, fallbackLng: string}}
 */
I18n.defaultProps = {
  fallbackLng: process.env.REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG,
  loadPath: process.env.REACT_APP_CONFIG_SERVICE_LOCALES_PATH,
  locale: null
};

export { I18n as default, I18n, i18next, translate, translateComponent, EMPTY_CONTEXT };
