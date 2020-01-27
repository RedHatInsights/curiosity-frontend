import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant } from '@patternfly/react-core';
import { BanIcon, BinocularsIcon } from '@patternfly/react-icons';
import { connectRouterTranslate, reduxActions } from '../../redux';
import { helpers } from '../../common';
import { Redirect, routerTypes } from '../router/router';
import PageLayout from '../pageLayout/pageLayout';

class Authentication extends Component {
  removeListeners = helpers.noop;

  componentDidMount() {
    const {
      appName,
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
      setAppName(appName);

      const appNav = onNavigation(event => history.push(`${event.navId}`));
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
      return (
        <PageLayout>
          <PageHeader>
            <PageHeaderTitle title="&nbsp;" />
          </PageHeader>
          <EmptyState variant={EmptyStateVariant.full} className="fadein">
            <EmptyStateIcon icon={BinocularsIcon} />
            <EmptyStateBody>{t('curiosity-auth.pending', '...')}</EmptyStateBody>
          </EmptyState>
        </PageLayout>
      );
    }

    if (session.errorStatus === 418) {
      return <Redirect isRedirect isReplace url={redirectUrl} />;
    }

    if (session.errorStatus === 403) {
      return (
        <React.Fragment>
          {children}
          <Redirect isRedirect />
        </React.Fragment>
      );
    }

    return (
      <PageLayout>
        <PageHeader>
          <PageHeaderTitle title={t('curiosity-auth.authorizedTitle', '...')} />
        </PageHeader>
        <EmptyState variant={EmptyStateVariant.full} className="fadein">
          <EmptyStateIcon icon={BanIcon} />
          <EmptyStateBody>{t('curiosity-auth.authorizedCopy', '...')}</EmptyStateBody>
        </EmptyState>
      </PageLayout>
    );
  }
}

Authentication.propTypes = {
  appName: PropTypes.string,
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
  appName: helpers.UI_NAME,
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
