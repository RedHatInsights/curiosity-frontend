import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BinocularsIcon } from '@patternfly/react-icons';
import { Maintenance } from '@redhat-cloud-services/frontend-components/components/cjs/Maintenance';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/components/cjs/NotAuthorized';
import { connectRouter, reduxActions, reduxSelectors } from '../../redux';
import { rhsmApiTypes } from '../../types';
import { helpers } from '../../common';
import { Redirect, routerHelpers, routerTypes } from '../router/router';
import MessageView from '../messageView/messageView';
import { translate } from '../i18n/i18n';

/**
 * An authentication pass-through component.
 *
 * @augments React.Component
 */
class Authentication extends Component {
  appName = routerTypes.appName;

  removeListeners = helpers.noop;

  async componentDidMount() {
    const { authorizeUser, history, initializeChrome, onNavigation, setAppName, session } = this.props;

    if (!session.authorized) {
      await authorizeUser();
    }

    if (helpers.PROD_MODE || helpers.REVIEW_MODE) {
      initializeChrome();
      setAppName(this.appName);

      const appNav = onNavigation(event => {
        const { routeHref } = routerHelpers.getNavRouteDetail({ id: event.navId, returnDefault: true });
        history.push(routeHref);
      });

      this.removeListeners = () => {
        appNav();
      };
    }
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  /**
   * Render authenticated children or messaging.
   *
   * @returns {Node}
   */
  render() {
    const { children, session, t } = this.props;

    if (helpers.UI_DISABLED) {
      return (
        <MessageView>
          <Maintenance description={t('curiosity-auth.maintenanceCopy', '...')} />
        </MessageView>
      );
    }

    if (session.authorized) {
      return <React.Fragment>{children}</React.Fragment>;
    }

    if (session.pending) {
      return <MessageView pageTitle="&nbsp;" message={t('curiosity-auth.pending', '...')} icon={BinocularsIcon} />;
    }

    if (
      (session.errorCodes && session.errorCodes.includes(rhsmApiTypes.RHSM_API_RESPONSE_ERROR_DATA_CODE_TYPES.OPTIN)) ||
      session.status === 418
    ) {
      if (helpers.TEST_MODE) {
        return <React.Fragment>{session.status} redirect</React.Fragment>;
      }
      return <Redirect isRedirect route={routerHelpers.getErrorRoute.to} />;
    }

    return (
      <MessageView>
        <NotAuthorized serviceName={helpers.UI_DISPLAY_NAME} />
      </MessageView>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{authorizeUser: Function, onNavigation: Function, setAppName: Function, t: Function,
 *     children: Node, initializeChrome: Function, session: object, history: object}}
 */
Authentication.propTypes = {
  authorizeUser: PropTypes.func,
  children: PropTypes.node.isRequired,
  history: PropTypes.shape({
    listen: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  }).isRequired,
  initializeChrome: PropTypes.func,
  onNavigation: PropTypes.func,
  setAppName: PropTypes.func,
  session: PropTypes.shape({
    authorized: PropTypes.bool,
    error: PropTypes.bool,
    errorCodes: PropTypes.arrayOf(PropTypes.string),
    errorMessage: PropTypes.string,
    pending: PropTypes.bool,
    status: PropTypes.number
  }),
  t: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{authorizeUser: Function, onNavigation: Function, setAppName: Function, t: translate,
 *     initializeChrome: Function, session: {authorized: boolean, errorCodes: Array, pending: boolean,
 *     errorMessage: string, error: boolean, status: null}}}
 */
Authentication.defaultProps = {
  authorizeUser: helpers.noop,
  initializeChrome: helpers.noop,
  onNavigation: helpers.noop,
  setAppName: helpers.noop,
  session: {
    authorized: false,
    error: false,
    errorCodes: [],
    errorMessage: '',
    pending: false,
    status: null
  },
  t: translate
};

/**
 * Apply actions to props.
 *
 * @param {Function} dispatch
 * @returns {object}
 */
const mapDispatchToProps = dispatch => ({
  authorizeUser: () => dispatch(reduxActions.user.authorizeUser()),
  initializeChrome: () => dispatch(reduxActions.platform.initializeChrome()),
  onNavigation: callback => dispatch(reduxActions.platform.onNavigation(callback)),
  setAppName: name => dispatch(reduxActions.platform.setAppName(name))
});

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.user.makeUserSession();

const ConnectedAuthentication = connectRouter(makeMapStateToProps, mapDispatchToProps)(Authentication);

export { ConnectedAuthentication as default, ConnectedAuthentication, Authentication };
