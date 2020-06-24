import { combineReducers } from 'redux';
import { notifications } from '@redhat-cloud-services/frontend-components-notifications/cjs';
import graphReducer from './graphReducer';
import inventoryReducer from './inventoryReducer';
import viewReducer from './viewReducer';
import userReducer from './userReducer';

const reducers = {
  notifications,
  graph: graphReducer,
  inventory: inventoryReducer,
  user: userReducer,
  view: viewReducer
};

const reduxReducers = combineReducers(reducers);

export { reduxReducers as default, reduxReducers, graphReducer, inventoryReducer, userReducer, viewReducer };
