import { reduxTypes } from '../types';
import { reduxHelpers } from '../common/reduxHelpers';

/**
 * Toolbar related user state reducer.
 *
 * @memberof Reducers
 * @module ToolbarReducer
 */

/**
 * Initial state.
 *
 * @private
 * @type {{filters: {}}}
 */
const initialState = {
  filters: {}
};

/**
 * Apply user observer/reducer logic for toolbar to state, against actions.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object|{}}
 */
const toolbarReducer = (state = initialState, action) => {
  switch (action.type) {
    case reduxTypes.toolbar.SET_ACTIVE_FILTERS:
      return reduxHelpers.setStateProp(
        'filters',
        {
          [action.viewId]: {
            ...state.filters[action.viewId],
            activeFilters: action.activeFilters
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.toolbar.SET_FILTER_TYPE:
      return reduxHelpers.setStateProp(
        'filters',
        {
          [action.viewId]: {
            ...state.filters[action.viewId],
            currentFilter: action.currentFilter
          }
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

toolbarReducer.initialState = initialState;

export { toolbarReducer as default, initialState, toolbarReducer };
