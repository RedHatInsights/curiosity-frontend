import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { store } from './store';
import { reduxActions } from './actions';
import { reduxHelpers, apiQueries } from './common';
import { storeHooks } from './hooks';
import { reduxReducers } from './reducers';
import { reduxSelectors } from './selectors';
import { reduxTypes } from './types';

/**
 * Wrapper for applying Router Dom withRouter and Redux connect.
 *
 * @param {Function} mapStateToProps
 * @param {Function} mapDispatchToProps
 * @returns {Function}
 */
const connectRouter = (mapStateToProps, mapDispatchToProps) => component =>
  withRouter(connect(mapStateToProps, mapDispatchToProps)(component));

export {
  apiQueries,
  connect,
  connectRouter,
  reduxActions,
  reduxHelpers,
  reduxReducers,
  reduxSelectors,
  reduxTypes,
  store,
  storeHooks
};
