import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BanIcon, BinocularsIcon } from '@patternfly/react-icons';
import { connectRouterTranslate, reduxActions } from '../../redux';
import { helpers } from '../../common';
import { Redirect, routerHelpers, routerTypes } from '../router/router';
import MessageView from '../messageView/messageView';

/**
 * An authentication pass-through component.
 *
 * @augments React.Component
 */
class Authentication extends Component {
  appName = routerTypes.appName;

  removeListeners = helpers.noop;

  componentDidMount() {
    const { authorizeUser, history, initializeChrome, onNavigation, setAppName, session } = this.props;

    if (helpers.PROD_MODE || helpers.REVIEW_MODE) {
      initializeChrome();
      setAppName(this.appName);

      const appNav = onNavigation(event => {
        const { path } = routerHelpers.getNavRouteDetail({ id: event.navId, returnDefault: true });
        history.push(path);
      });

      this.removeListeners = () => {
        appNav();
      };
    }

    if (!session.authorized) {
      authorizeUser();
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

    if (session.authorized) {
      return <React.Fragment>{children}</React.Fragment>;
    }

    if (session.pending) {
      return <MessageView title="&nbsp;" message={t('curiosity-auth.pending', '...')} icon={BinocularsIcon} />;
    }

    if (session.errorStatus === 403 || session.errorStatus === 418) {
      if (helpers.TEST_MODE) {
        return <React.Fragment>{session.errorStatus} redirect</React.Fragment>;
      }
      return <Redirect isRedirect route={routerHelpers.getErrorRoute.to} />;
    }

    return (
      <MessageView
        title={t('curiosity-auth.authorizedTitle', '...')}
        message={t('curiosity-auth.authorizedCopy', '...')}
        icon={BanIcon}
      />
    );
  }
}

/**
 * Prop types.
 *
 * @type {{authorizeUser: Function, onNavigation: Function, setAppName: Function, navigation: Array,
 *     t: Function, children: Node, initializeChrome: Function, session: object, history: object,
 *     setNavigation: Function}}
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
    errorMessage: PropTypes.string,
    errorStatus: PropTypes.number,
    pending: PropTypes.bool
  }),
  t: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{authorizeUser: Function, onNavigation: Function, setAppName: Function, navigation: Array,
 *     t: Function, initializeChrome: Function, session: {authorized: boolean, pending: boolean,
 *     errorMessage: string, errorStatus: null, error: boolean}, setNavigation: Function}}
 */
Authentication.defaultProps = {
  authorizeUser: helpers.noop,
  initializeChrome: helpers.noop,
  onNavigation: helpers.noop,
  setAppName: helpers.noop,
  session: {
    authorized: false,
    error: false,
    errorMessage: '',
    errorStatus: null,
    pending: false
  },
  t: helpers.noopTranslate
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
 * Apply state to props.
 *
 * @param {object} state
 * @returns {object}
 */
const mapStateToProps = state => ({ session: state.user.session });

const ConnectedAuthentication = connectRouterTranslate(mapStateToProps, mapDispatchToProps)(Authentication);

export { ConnectedAuthentication as default, ConnectedAuthentication, Authentication };
