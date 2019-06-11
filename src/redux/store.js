import { createStore, applyMiddleware } from 'redux';
import { reduxMiddleware } from './middleware';
import { reduxReducers } from './reducers';

const store = createStore(reduxReducers, applyMiddleware(...reduxMiddleware));

export { store as default, store };
