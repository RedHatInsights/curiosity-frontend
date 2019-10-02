import { combineReducers } from 'redux';
import { notifications } from '@redhat-cloud-services/frontend-components-notifications';
import rhelGraphReducer from './rhelGraphReducer';
import rhelViewReducer from './rhelViewReducer';
import userReducer from './userReducer';

const reducers = {
  notifications,
  rhelGraph: rhelGraphReducer,
  rhelView: rhelViewReducer,
  user: userReducer
};

const reduxReducers = combineReducers(reducers);

export { reduxReducers as default, reduxReducers, rhelGraphReducer, rhelViewReducer, userReducer };
