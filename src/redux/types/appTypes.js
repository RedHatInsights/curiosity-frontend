/**
 * @memberof Types
 * @module AppTypes
 */

const STATUS_4XX = '4XX';
const STATUS_5XX = '5XX';
const SET_PRODUCT = 'SET_PRODUCT';
const SET_PRODUCT_VARIANT = 'SET_PRODUCT_VARIANT';
const SET_PRODUCT_VARIANT_QUERY_RESET_ALL = 'SET_PRODUCT_VARIANT_QUERY_RESET_ALL';

/**
 * Application action, reducer types.
 *
 * @type {{STATUS_4XX: string, SET_PRODUCT_VARIANT: string, SET_PRODUCT_VARIANT_QUERY_RESET_ALL: string,
 *     SET_PRODUCT: string, STATUS_5XX: string}}
 */
const appTypes = {
  STATUS_4XX,
  STATUS_5XX,
  SET_PRODUCT,
  SET_PRODUCT_VARIANT,
  SET_PRODUCT_VARIANT_QUERY_RESET_ALL
};

export {
  appTypes as default,
  appTypes,
  STATUS_4XX,
  STATUS_5XX,
  SET_PRODUCT,
  SET_PRODUCT_VARIANT,
  SET_PRODUCT_VARIANT_QUERY_RESET_ALL
};
