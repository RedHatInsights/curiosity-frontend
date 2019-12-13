import { combineReducers } from 'redux';
import { notifications } from '@redhat-cloud-services/frontend-components-notifications';
import graphReducer from './graphReducer';
import viewReducer from './viewReducer';
import userReducer from './userReducer';

const reducers = {
  notifications,
  graph: graphReducer,
  view: viewReducer,
  user: userReducer
};

const reduxReducers = combineReducers(reducers);

export { reduxReducers as default, reduxReducers, graphReducer, viewReducer, userReducer };
