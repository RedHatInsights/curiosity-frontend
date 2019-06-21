import React from 'react';
import PropTypes from 'prop-types';
import { connectRouter, reduxActions } from '../redux';
import { helpers } from '../common/helpers';
import { I18n } from './i18n/i18n';
import { Router } from './router/router';
import Authentication from './authentication/authentication';
import PageLayout from './pageLayout/pageLayout';

class App extends React.Component {
  componentDidMount() {
    const { getLocale } = this.props;

    getLocale();
  }

  render() {
    const { locale } = this.props;

    return (
      <I18n locale={(locale && locale.value) || null}>
        <Authentication>
          <PageLayout>
            <Router />
          </PageLayout>
        </Authentication>
      </I18n>
    );
  }
}

App.propTypes = {
  getLocale: PropTypes.func,
  locale: PropTypes.shape({
    value: PropTypes.string
  })
};

App.defaultProps = {
  getLocale: helpers.noop,
  locale: {}
};

const mapDispatchToProps = dispatch => ({
  getLocale: () => dispatch(reduxActions.user.getLocale())
});

const mapStateToProps = state => ({ locale: state.user.session.locale });

const ConnectedApp = connectRouter(mapStateToProps, mapDispatchToProps)(App);

export { ConnectedApp as default, ConnectedApp, App };
