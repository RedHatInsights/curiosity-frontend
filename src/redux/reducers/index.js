import { combineReducers } from 'redux';
import { notifications } from '@redhat-cloud-services/frontend-components-notifications';
import appReducer from './appReducer';
import graphReducer from './graphReducer';
import inventoryReducer from './inventoryReducer';
import messagesReducer from './messagesReducer';
import toolbarReducer from './toolbarReducer';
import viewReducer from './viewReducer';

const reducers = {
  app: appReducer,
  notifications,
  graph: graphReducer,
  inventory: inventoryReducer,
  messages: messagesReducer,
  toolbar: toolbarReducer,
  view: viewReducer
};

const reduxReducers = combineReducers(reducers);

export {
  reduxReducers as default,
  reduxReducers,
  appReducer,
  graphReducer,
  inventoryReducer,
  messagesReducer,
  toolbarReducer,
  viewReducer
};
