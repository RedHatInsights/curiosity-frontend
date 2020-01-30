import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BanIcon, BinocularsIcon } from '@patternfly/react-icons';
import { connectRouterTranslate, reduxActions } from '../../redux';
import { helpers } from '../../common';
import { Redirect, routerHelpers, routerTypes } from '../router/router';
import MessageView from '../messageView/messageView';

class Authentication extends Component {
  appName = routerTypes.appName;

  removeListeners = helpers.noop;

  componentDidMount() {
    const {
      authorizeUser,
      history,
      initializeChrome,
      onNavigation,
      navigation,
      setAppName,
      setNavigation,
      session
    } = this.props;

    if (helpers.PROD_MODE || helpers.REVIEW_MODE) {
      initializeChrome();
      setAppName(this.appName);

      const appNav = onNavigation(event => {
        const { path } = routerHelpers.getNavRouteDetail({ id: event.navId, returnDefault: true });
        history.push(path);
      });
      const buildNav = history.listen(() => setNavigation(navigation));

      this.removeListeners = () => {
        appNav();
        buildNav();
      };
    }

    if (!session.authorized) {
      authorizeUser();
    }
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  render() {
    const { children, redirectUrl, session, t } = this.props;

    if (session.authorized) {
      return <React.Fragment>{children}</React.Fragment>;
    }

    if (session.pending) {
      return <MessageView title="&nbsp;" message={t('curiosity-auth.pending', '...')} icon={BinocularsIcon} />;
    }

    if (session.errorStatus === 418) {
      return <Redirect isRedirect isReplace url={redirectUrl} />;
    }

    if (session.errorStatus === 403) {
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
  setNavigation: PropTypes.func,
  navigation: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string
    })
  ),
  redirectUrl: PropTypes.string,
  session: PropTypes.shape({
    authorized: PropTypes.bool,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    errorStatus: PropTypes.number,
    pending: PropTypes.bool
  }),
  t: PropTypes.func
};

Authentication.defaultProps = {
  authorizeUser: helpers.noop,
  initializeChrome: helpers.noop,
  onNavigation: helpers.noop,
  setAppName: helpers.noop,
  setNavigation: helpers.noop,
  navigation: routerTypes.navigation,
  redirectUrl: routerTypes.platformRedirect,
  session: {
    authorized: false,
    error: false,
    errorMessage: '',
    errorStatus: null,
    pending: false
  },
  t: helpers.noopTranslate
};

const mapDispatchToProps = dispatch => ({
  authorizeUser: () => dispatch(reduxActions.user.authorizeUser()),
  initializeChrome: () => dispatch(reduxActions.platform.initializeChrome()),
  onNavigation: callback => dispatch(reduxActions.platform.onNavigation(callback)),
  setAppName: name => dispatch(reduxActions.platform.setAppName(name)),
  setNavigation: data => dispatch(reduxActions.platform.setNavigation(data))
});

const mapStateToProps = state => ({ session: state.user.session });

const ConnectedAuthentication = connectRouterTranslate(mapStateToProps, mapDispatchToProps)(Authentication);

export { ConnectedAuthentication as default, ConnectedAuthentication, Authentication };
