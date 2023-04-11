import { reduxTypes } from '../types';
import { reduxHelpers } from '../common/reduxHelpers';

/**
 * Banner messages related API state reducer.
 *
 * @memberof Reducers
 * @module MessagesReducer
 */

/**
 * Initial state.
 *
 * @private
 * @type {{report: {}}}
 */
const initialState = {
  bannerMessages: {}
};

/**
 * Generated daily observer/reducer for messages to state,
 * against actions.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object|{}}
 */
const messagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case reduxTypes.message.SET_BANNER_MESSAGES:
      return reduxHelpers.setStateProp(
        'bannerMessages',
        {
          [action.viewId]: action.bannerMessages
        },
        {
          state,
          reset: false
        }
      );
    default:
      return state;
  }
};

messagesReducer.initialState = initialState;

export { messagesReducer as default, initialState, messagesReducer };
