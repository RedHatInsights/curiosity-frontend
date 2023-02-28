import _camelCase from 'lodash/camelCase';
import _isPlainObject from 'lodash/isPlainObject';
import { helpers } from '../../common';

/**
 * @memberof Helpers
 * @module ServiceHelpers
 */

/**
 * Pass through generate hash
 */
const { generateHash } = helpers;

/**
 * A timeout cancel for function calls.
 *
 * @param {Function} func Callback to be executed or cancelled
 * @param {object} options
 * @param {number} options.timeout Function timeout in milliseconds
 * @param {string} options.errorMessage What the error message will read
 * @returns {Promise<*>}
 */
const timeoutFunctionCancel = (func, { timeout = 3000, errorMessage = 'function timeout' } = {}) => {
  let clearTimer;

  const timer = () =>
    new Promise((_, reject) => {
      clearTimer = window.setTimeout(reject, timeout, new Error(errorMessage));
    });

  const updatedFunc = async () => {
    const response = await func();
    window.clearTimeout(clearTimer);
    return response;
  };

  const execFunction = () =>
    Promise.race([timer(), updatedFunc()]).finally(() => {
      window.clearTimeout(clearTimer);
    });

  return execFunction();
};

/**
 * Return objects with the keys camelCased. Normally applied to an array of objects.
 *
 * @param {object|Array|*} obj
 * @returns {object|Array|*}
 */
const camelCase = obj => {
  if (Array.isArray(obj)) {
    return obj.map(camelCase);
  }

  if (_isPlainObject(obj)) {
    const updatedObj = {};

    Object.entries(obj).forEach(([key, val]) => {
      updatedObj[_camelCase(key)] = camelCase(val);
    });

    return updatedObj;
  }

  return obj;
};

/**
 * Apply data to a callback, pass original data on error.
 *
 * @param {Function} callback
 * @param {Array} data
 * @returns {{data: *, error}}
 */
const passDataToCallback = (callback, ...data) => {
  let error;
  let updatedData = data;

  try {
    updatedData = callback(...data);
  } catch (e) {
    error = e;
  }

  return { data: updatedData, error };
};

/**
 * A callback for schema validation, and after-the-fact casing adjustments.
 *
 * @param {object} options
 * @param {string} options.casing
 * @param {boolean} options.convert
 * @param {string} options.id
 * @param {object|Array} options.response
 * @param {*} options.schema
 * @returns {*|{}}
 */
const schemaResponse = ({ casing, convert = true, id = null, response, schema } = {}) => {
  const { value, error = { details: [] } } = schema?.validate(response, { convert }) || {};

  if (error.details.length && !helpers.TEST_MODE) {
    console.error(
      new Error(
        `Passing original API response. Schema validation failed for ${id || '...'}: ${error.details
          .map(({ context = {}, message, type }) => `${message}:${type}, ${JSON.stringify(context)}`)
          .join(', ')}`
      )
    );
  }

  switch (casing) {
    case 'camel':
      return camelCase(value);
    default:
      return value;
  }
};

const serviceHelpers = {
  camelCase,
  generateHash,
  passDataToCallback,
  schemaResponse,
  timeoutFunctionCancel
};

export {
  serviceHelpers as default,
  serviceHelpers,
  camelCase,
  generateHash,
  passDataToCallback,
  schemaResponse,
  timeoutFunctionCancel
};
