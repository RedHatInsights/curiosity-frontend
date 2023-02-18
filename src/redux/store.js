import { createStore, applyMiddleware } from 'redux';
import { reduxMiddleware } from './middleware';
import { reduxReducers } from './reducers';

/**
 * Redux store setup.
 *
 * @memberof Redux State
 * @module Store
 */

/**
 * Create a Redux store.
 *
 * @type {{graph: object, notifications: Array, toolbar: object, inventory: object, user: object, view: object,
 *     messages: object}}
 */
const store = createStore(reduxReducers, applyMiddleware(...reduxMiddleware));

export { store as default, store };
