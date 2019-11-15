import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant } from '@patternfly/react-core';
import { BanIcon, BinocularsIcon } from '@patternfly/react-icons';
import { connectRouter, reduxActions } from '../../redux';
import { helpers } from '../../common/helpers';
import { navigation as appNavigation } from '../router/router';
import PageLayout from '../pageLayout/pageLayout';

class Authentication extends Component {
  appNav = helpers.noop;

  buildNav = helpers.noop;

  componentDidMount() {
    const { appName, authorizeUser, history, insights, session } = this.props;

    try {
      if (helpers.PROD_MODE || helpers.REVIEW_MODE) {
        insights.chrome.init();
      }

      if (helpers.PROD_MODE) {
        insights.chrome.identifyApp(appName);
        insights.chrome.navigation(this.buildNavigation());

        this.appNav = insights.chrome.on('APP_NAVIGATION', event => history.push(`/${event.navId}`));
        this.buildNav = history.listen(() => insights.chrome.navigation(this.buildNavigation()));
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

  buildNavigation = () => {
    const { navigation } = this.props;
    const currentPath = window.location.pathname.split('/').slice(-1)[0];

    return navigation.map(item => ({
      ...item,
      active: item.id === currentPath
    }));
  };

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
  navigation: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string
    })
  ),
  session: PropTypes.shape({
    authorized: PropTypes.bool,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    pending: PropTypes.bool
  })
};

Authentication.defaultProps = {
  appName: helpers.UI_NAME,
  authorizeUser: helpers.noop,
  insights: window.insights,
  navigation: appNavigation,
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
