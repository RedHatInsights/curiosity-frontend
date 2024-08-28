import { helpers } from '../../common/helpers';

/**
 * @memberof Middleware
 * @module PromiseMiddleware
 */

/**
 * Redux default action types for promiseMiddleware
 *
 * @type {{Fulfilled: string, Rejected: string, Pending: string}}
 */
const ActionType = {
  Pending: 'PENDING',
  Fulfilled: 'FULFILLED',
  Rejected: 'REJECTED'
};

/**
 * Function: createPromise
 * Description: The main createPromise accepts a configuration
 * object and returns the middleware.
 *
 * @param {object} config
 * @param {boolean} config.isCatchRejection
 * @param {string} config.promiseTypeDelimiter
 * @param {string} config.promiseTypeSuffixPending
 * @param {string} config.promiseTypeSuffixFulfilled
 * @param {string} config.promiseTypeSuffixRejected
 * @returns {Function}
 */
const createPromise = ({
  promiseTypeDelimiter: PROMISE_TYPE_DELIMITER = '_',
  promiseTypeSuffixPending = ActionType.Pending,
  promiseTypeSuffixFulfilled = ActionType.Fulfilled,
  promiseTypeSuffixRejected = ActionType.Rejected,
  isCatchRejection = false
} = {}) => {
  const PROMISE_TYPE_SUFFIXES = [promiseTypeSuffixPending, promiseTypeSuffixFulfilled, promiseTypeSuffixRejected];
  return ref => {
    const { dispatch } = ref;

    return next => action => {
      /**
       * Instantiate variables to hold:
       * (1) the promise
       * (2) the data for optimistic updates
       */
      let promise;
      let data;

      /**
       * There are multiple ways to dispatch a promise. The first step is to
       * determine if the promise is defined:
       * (a) explicitly (action.payload.promise is the promise)
       * (b) implicitly (action.payload is the promise)
       * (c) as an async function (returns a promise when called)
       *
       * If the promise is not defined in one of these three ways, we don't do
       * anything and move on to the next middleware in the middleware chain.
       */

      // Step 1a: Is there a payload?
      if (action.payload) {
        const PAYLOAD = action.payload;

        // Step 1.1: Is the promise implicitly defined?
        if (helpers.isPromise(PAYLOAD)) {
          promise = PAYLOAD;
        }

        // Step 1.2: Is the promise explicitly defined?
        else if (helpers.isPromise(PAYLOAD.promise)) {
          promise = PAYLOAD.promise;
          data = PAYLOAD.data;
        }

        // Step 1.3: Is the promise returned by an async function?
        else if (typeof PAYLOAD === 'function' || typeof PAYLOAD.promise === 'function') {
          promise = PAYLOAD.promise ? PAYLOAD.promise() : PAYLOAD();
          data = PAYLOAD.promise ? PAYLOAD.data : undefined;

          // Step 1.3.1: Is the return of action.payload a promise?
          if (!helpers.isPromise(promise)) {
            // If not, move on to the next middleware.
            return next({
              ...action,
              payload: promise
            });
          }
        }

        // Step 1.4: If there's no promise, move on to the next middleware.
        else {
          return next(action);
        }

        // Step 1b: If there's no payload, move on to the next middleware.
      } else {
        return next(action);
      }

      /**
       * Instantiate and define constants for:
       * (1) the action type
       * (2) the action meta
       */
      const TYPE = action.type;
      const META = action.meta;

      /**
       * Instantiate and define constants for the action type suffixes.
       * These are appended to the end of the action type.
       */
      const [PENDING, FULFILLED, REJECTED] = PROMISE_TYPE_SUFFIXES;

      /**
       * Function: getAction
       * Description: This function constructs and returns a rejected
       * or fulfilled action object. The action object is based off the Flux
       * Standard Action (FSA).
       *
       * Given an original action with the type FOO:
       *
       * The rejected object model will be:
       * {
       * error: true,
       * type: 'FOO_REJECTED',
       * payload: ...,
       * meta: ... (optional)
       * }
       *
       * The fulfilled object model will be:
       * {
       * type: 'FOO_FULFILLED',
       * payload: ...,
       * meta: ... (optional)
       * }
       *
       * @param {unknown} newPayload
       * @param {boolean} isRejected
       * @returns {{payload: any, meta: any, type: string, error: any}}
       */
      const getAction = (newPayload, isRejected) => ({
        // Concatenate the type string property.
        type: [TYPE, isRejected ? REJECTED : FULFILLED].join(PROMISE_TYPE_DELIMITER),

        // Include the payload property.
        ...(newPayload === null || typeof newPayload === 'undefined'
          ? {}
          : {
              payload: newPayload
            }),

        // If the original action includes a meta property, include it.
        ...(META !== undefined ? { meta: META } : {}),

        // If the action is rejected, include an error property.
        ...(isRejected
          ? {
              error: true
            }
          : {})
      });

      const handleReject = reason => {
        const rejectedAction = getAction(reason, true);
        dispatch(rejectedAction);

        if (isCatchRejection === false) {
          throw reason;
        }
      };

      const handleFulfill = (value = null) => {
        const resolvedAction = getAction(value, false);
        dispatch(resolvedAction);

        return { value, action: resolvedAction };
      };

      /**
       * First, dispatch the pending action:
       * This object describes the pending state of a promise and will include
       * any data (for optimistic updates) and/or meta from the original action.
       */
      next({
        // Concatenate the type string.
        type: [TYPE, PENDING].join(PROMISE_TYPE_DELIMITER),

        // Include payload (for optimistic updates) if it is defined.
        ...(data !== undefined ? { payload: data } : {}),

        // Include meta data if it is defined.
        ...(META !== undefined ? { meta: META } : {})
      });

      /**
       * Second, dispatch a rejected or fulfilled action and move on to the
       * next middleware.
       */
      return promise.then(handleFulfill, handleReject);
    };
  };
};

/**
 * Promise middleware
 * Base code, https://github.com/pburtchaell/redux-promise-middleware
 * Modified to allow configuration and "isCatchRejection".
 *
 * @param {object} config
 * @param {boolean} config.isCatchRejection Catch the returned promise. Helps avoid the "[uncaught in promise]" error
 * @param {string} config.promiseTypeDelimiter
 * @param {string} config.promiseTypeSuffixPending
 * @param {string} config.promiseTypeSuffixFulfilled
 * @param {string} config.promiseTypeSuffixRejected
 * @returns {Function}
 */
const promiseMiddleware =
  config =>
  ({ dispatch } = {}) => {
    if (typeof dispatch === 'function') {
      return createPromise(config)({ dispatch });
    }

    return null;
  };

export { promiseMiddleware as default, promiseMiddleware, createPromise, ActionType };
