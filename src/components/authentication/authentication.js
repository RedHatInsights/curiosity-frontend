import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant } from '@patternfly/react-core';
import { BanIcon, BinocularsIcon } from '@patternfly/react-icons';
import { connectRouter, reduxActions } from '../../redux';
import { helpers } from '../../common/helpers';
import PageLayout from '../pageLayout/pageLayout';

class Authentication extends Component {
  componentDidMount() {
    const { appName, authorizeUser, insights, routes, session } = this.props;

    try {
      insights.chrome.init();

      if (helpers.PROD_MODE) {
        insights.chrome.identifyApp(appName);
        insights.chrome.navigation(routes);
      }

      if (!session.authorized) {
        authorizeUser();
      }
    } catch (e) {
      if (!helpers.TEST_MODE) {
        console.warn(`{ init, identifyApp, navigation } = insights.chrome: ${e.message}`);
      }
    }
  }

  componentWillUnmount() {
    this.appNav();
    this.buildNav();
  }

  appNav() {
    const { history, insights } = this.props;

    if (history && insights.chrome) {
      insights.chrome.on('APP_NAVIGATION', event => {
        console.log('test HISTORY', event);
        return history.push(`/${event.navId}`);
      });
    }
  }

  buildNav() {
    const { history, insights, routes } = this.props;

    if (history && insights.chrome) {
      history.listen(() => insights.chrome.navigation(routes));
    }
  }

  render() {
    const { children, session } = this.props;

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
            <EmptyStateBody>Authenticating...</EmptyStateBody>
          </EmptyState>
        </PageLayout>
      );
    }

    return (
      <PageLayout>
        <PageHeader>
          <PageHeaderTitle title="Unauthorized" />
        </PageHeader>
        <EmptyState variant={EmptyStateVariant.full} className="fadein">
          <EmptyStateIcon icon={BanIcon} />
          <EmptyStateBody>You do not have permission to access reporting. Contact your administrator.</EmptyStateBody>
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
  insights: PropTypes.shape({
    chrome: PropTypes.shape({
      init: PropTypes.func,
      identifyApp: PropTypes.func,
      navigation: PropTypes.func,
      on: PropTypes.func
    })
  }),
  routes: PropTypes.array,
  session: PropTypes.shape({
    authorized: PropTypes.bool,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    pending: PropTypes.bool
  })
};

Authentication.defaultProps = {
  appName: process.env.REACT_APP_NAME,
  authorizeUser: helpers.noop,
  insights: window.insights,
  routes: [],
  session: {
    authorized: false,
    error: false,
    errorMessage: '',
    pending: false
  }
};

const mapDispatchToProps = dispatch => ({
  authorizeUser: () => dispatch(reduxActions.user.authorizeUser())
});

const mapStateToProps = state => ({ session: state.user.session });

const ConnectedAuthentication = connectRouter(mapStateToProps, mapDispatchToProps)(Authentication);

export { ConnectedAuthentication as default, ConnectedAuthentication, Authentication };
