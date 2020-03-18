import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';
import { initReactI18next, withTranslation } from 'react-i18next';
import { helpers } from '../../common/helpers';

const translate = (str, placeholder = null) =>
  (!helpers.TEST_MODE && i18next.t(str, placeholder)) || helpers.noopTranslate(str, placeholder);

const translateComponent = component => (!helpers.TEST_MODE && withTranslation()(component)) || component;

/**
 * ToDo: reevaluate the "I18nextProvider" on package update.
 * Appears to have timing issues, and subsequent firings of the
 * ajax/xhr setup. Reverting it to just a function call that populates behind
 * the scenes appears more predictable.
 */
/**
 * Load I18n.
 *
 * @augments React.Component
 */
class I18n extends React.Component {
  state = { isLoaded: false };

  componentDidMount() {
    this.i18nInit();
  }

  componentDidUpdate(prevProps) {
    const { locale } = this.props;

    if (locale !== prevProps.locale) {
      this.i18nInit();
    }
  }

  /**
   * Load i18next.
   *
   * @returns {Promise<void>}
   */
  i18nInit = async () => {
    const { fallbackLng, loadPath, locale } = this.props;

    try {
      await i18next
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
    } catch (e) {
      // ToDo: eval the need for an isError state ref
    }

    this.setState({ isLoaded: true });
  };

  /**
   * Render children after i18next loads.
   *
   * @returns {Node}
   */
  render() {
    const { isLoaded } = this.state;
    const { children } = this.props;

    return (isLoaded && <React.Fragment>{children}</React.Fragment>) || <React.Fragment />;
  }
}

/**
 * Prop types.
 *
 * @type {{loadPath: string, children: Node, locale: string, fallbackLng: string}}
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

export { I18n as default, I18n, i18next, translate, translateComponent };
