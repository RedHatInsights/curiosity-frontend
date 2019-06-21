import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import { helpers } from '../../common/helpers';

/**
 * ToDo: reevaluate the "I18nextProvider" on package update.
 * Appears to have timing issues, and subsequent firings of the
 * ajax/xhr setup. Reverting it to just a function call that populates behind
 * the scenes appears more predictable.
 */
class I18n extends React.Component {
  componentDidMount() {
    this.i18nInit();
  }

  componentDidUpdate(prevProps) {
    const { locale } = this.props;

    if (locale !== prevProps.locale) {
      this.i18nInit();
    }
  }

  i18nInit() {
    const { fallbackLng, loadPath, locale } = this.props;

    i18n
      .use(XHR)
      .use(initReactI18next)
      .init({
        backend: {
          loadPath
        },
        fallbackLng,
        lng: locale,
        debug: !helpers.PROD_MODE,
        ns: ['default'],
        defaultNS: 'default',
        react: {
          useSuspense: false
        }
      });
  }

  render() {
    const { children } = this.props;

    return <React.Fragment>{children}</React.Fragment>;
  }
}

I18n.propTypes = {
  children: PropTypes.node.isRequired,
  fallbackLng: PropTypes.string,
  loadPath: PropTypes.string,
  locale: PropTypes.string
};

I18n.defaultProps = {
  fallbackLng: process.env.REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG,
  loadPath: process.env.REACT_APP_CONFIG_SERVICE_LOCALES_PATH,
  locale: null
};

export { I18n as default, I18n };
