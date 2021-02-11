import React from 'react';
import PropTypes from 'prop-types';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import { connectRouter, reduxActions } from '../redux';
import { helpers } from '../common/helpers';
import { I18n } from './i18n/i18n';
import { Router } from './router/router';
import Authentication from './authentication/authentication';

/**
 * Application
 *
 * @augments React.Component
 */
class App extends React.Component {
  componentDidMount() {
    const { getLocale } = this.props;
    getLocale();
  }

  /**
   * Render application.
   *
   * @returns {Node}
   */
  render() {
    const { locale } = this.props;

    return (
      <I18n locale={(locale && locale.value) || null}>
        <NotificationsPortal />
        <Authentication>
          <Router />
        </Authentication>
      </I18n>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{locale: object, getLocale: Function}}
 */
App.propTypes = {
  getLocale: PropTypes.func,
  locale: PropTypes.shape({
    value: PropTypes.string
  })
};

/**
 * Default props.
 *
 * @type {{locale: {}, getLocale: Function}}
 */
App.defaultProps = {
  getLocale: helpers.noop,
  locale: {}
};

/**
 * Apply actions to props.
 *
 * @param {Function} dispatch
 * @returns {object}
 */
const mapDispatchToProps = dispatch => ({
  getLocale: () => dispatch(reduxActions.user.getLocale())
});

/**
 * Apply state to props.
 *
 * @param {object} state
 * @returns {object}
 */
const mapStateToProps = state => ({ locale: state.user.session.locale });

const ConnectedApp = connectRouter(mapStateToProps, mapDispatchToProps)(App);

export { ConnectedApp as default, ConnectedApp, App };
