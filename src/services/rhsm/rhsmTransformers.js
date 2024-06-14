import moment from 'moment';
import {
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_PATH_METRIC_TYPES,
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INSTANCES_DATA_TYPES,
  RHSM_API_RESPONSE_INSTANCES_META_TYPES as INSTANCES_META_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES as SUBSCRIPTIONS_DATA_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTIONS_META_TYPES as SUBSCRIPTIONS_META_TYPES,
  RHSM_API_RESPONSE_TALLY_CAPACITY_DATA_TYPES as TALLY_CAPACITY_DATA_TYPES,
  RHSM_API_RESPONSE_TALLY_CAPACITY_META_TYPES as TALLY_CAPACITY_META_TYPES,
  rhsmConstants
} from './rhsmConstants';
import { dateHelpers } from '../../common';

/**
 * Transform RHSM responses. Replaces selector usage.
 *
 * @memberof Rhsm
 * @module RhsmTransformers
 */

/**
 * Parse RHSM instances response for caching.
 *
 * @param {object} response
 * @returns {object}
 */
const rhsmInstances = response => {
  const updatedResponse = {};
  const { [rhsmConstants.RHSM_API_RESPONSE_DATA]: data = [], [rhsmConstants.RHSM_API_RESPONSE_META]: meta = {} } =
    response || {};
  const metaMeasurements = meta[INSTANCES_META_TYPES.MEASUREMENTS];

  updatedResponse.data = data.map(
    ({
      [INSTANCES_DATA_TYPES.MEASUREMENTS]: measurements,
      [INSTANCES_DATA_TYPES.NUMBER_OF_GUESTS]: numberOfGuests,
      ...dataResponse
    }) => {
      const updatedData = {
        [INSTANCES_DATA_TYPES.NUMBER_OF_GUESTS]: numberOfGuests,
        numberOfGuests,
        ...dataResponse
      };

      metaMeasurements?.forEach((measurement, index) => {
        updatedData[measurement] = measurements[index];
      });

      return updatedData;
    }
  );

  updatedResponse.meta = {
    count: meta[INSTANCES_META_TYPES.COUNT],
    productId: meta[INSTANCES_META_TYPES.PRODUCT]
  };

  return updatedResponse;
};

/**
 * Temporary guests response cache.
 *
 * @type {{}}
 */
const rhsmInstancesGuestsCache = {};

/**
 * Parse RHSM guests instances response. Return an infinite list at the transformer level.
 *
 * @param {object} response
 * @param {object} config
 * @param {object} config.params
 * @param {object} config._id
 * @returns {object}
 */
const rhsmInstancesGuests = (response, { params, _id } = {}) => {
  const updatedResponse = {};
  const { [rhsmConstants.RHSM_API_RESPONSE_DATA]: data = [], [rhsmConstants.RHSM_API_RESPONSE_META]: meta = {} } =
    response || {};

  updatedResponse.data = data;
  updatedResponse.meta = meta;

  if (_id) {
    let cacheIndex =
      Number.parseInt(params?.[RHSM_API_QUERY_SET_TYPES.OFFSET], 10) /
      Number.parseInt(params?.[RHSM_API_QUERY_SET_TYPES.LIMIT], 10);

    // Note: null is considered "finite"
    cacheIndex = (!Number.isNaN(cacheIndex) && Number.isFinite(cacheIndex) && cacheIndex) || 0;

    if (cacheIndex <= 0) {
      rhsmInstancesGuestsCache[_id] = [];
    }

    rhsmInstancesGuestsCache[_id][cacheIndex] = data;

    updatedResponse.data = rhsmInstancesGuestsCache[_id].flat();
  }

  return updatedResponse;
};

/**
 * Parse RHSM subscriptions response for caching.
 * Attempt to align Instances and Subscriptions responses.
 *
 * @param {object} response
 * @returns {object}
 */
const rhsmSubscriptions = response => {
  const updatedResponse = {};
  const { [rhsmConstants.RHSM_API_RESPONSE_DATA]: data = [], [rhsmConstants.RHSM_API_RESPONSE_META]: meta = {} } =
    response || {};

  updatedResponse.data = data.map(
    ({
      [SUBSCRIPTIONS_DATA_TYPES.METRIC_ID]: metricId,
      [SUBSCRIPTIONS_DATA_TYPES.TOTAL_CAPACITY]: totalCapacity,
      [SUBSCRIPTIONS_DATA_TYPES.HAS_INFINITE_QUANTITY]: hasInfiniteQuantity,
      ...dataResponse
    }) => {
      const updatedData = {
        [SUBSCRIPTIONS_DATA_TYPES.TOTAL_CAPACITY]: totalCapacity,
        [SUBSCRIPTIONS_DATA_TYPES.HAS_INFINITE_QUANTITY]: hasInfiniteQuantity,
        ...dataResponse
      };

      const normalizedMetricId = Object.values(RHSM_API_PATH_METRIC_TYPES).find(value =>
        new RegExp(value, 'i').test(metricId)
      );
      updatedData[normalizedMetricId] = totalCapacity;
      updatedData[SUBSCRIPTIONS_DATA_TYPES.METRIC_ID] = normalizedMetricId;
      updatedData[`hasInfinite${normalizedMetricId}`] = hasInfiniteQuantity;

      return updatedData;
    }
  );

  updatedResponse.meta = {
    count: meta[SUBSCRIPTIONS_META_TYPES.COUNT],
    productId: meta[SUBSCRIPTIONS_META_TYPES.PRODUCT]
  };

  return updatedResponse;
};

/**
 * ToDo: Confirm category meta response for Capacity
 * We're temporarily applying category from submitted params. API docs indicate
 * category only comes through on metric capacity?
 */
/**
 * Parse RHSM tally response for caching.
 *
 * @param {object} response
 * @param {object} config
 * @param {boolean} config._isCapacity
 * @param {object} config.params
 * @returns {object}
 */
const rhsmTallyCapacity = (response, { _isCapacity, params } = {}) => {
  const updatedResponse = {};
  const { [rhsmConstants.RHSM_API_RESPONSE_DATA]: data = [], [rhsmConstants.RHSM_API_RESPONSE_META]: meta = {} } =
    response || {};
  const currentDate = moment.utc(dateHelpers.getCurrentDate());
  const currentDateStr = moment.utc(dateHelpers.getCurrentDate()).format('MM-D-YYYY');
  let futureDateCount = 0;

  updatedResponse.data = data.map(
    (
      {
        [TALLY_CAPACITY_DATA_TYPES.DATE]: date,
        [TALLY_CAPACITY_DATA_TYPES.VALUE]: value,
        [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: hasData,
        [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: hasInfiniteQuantity
      },
      index
    ) => {
      const updatedDate = moment.utc(date);
      const isCurrentDate = updatedDate.format('MM-D-YYYY') === currentDateStr;
      const isFutureDate = updatedDate.diff(currentDate) > 0;

      if (isFutureDate && !isCurrentDate) {
        futureDateCount += 1;
      }

      return {
        x: index,
        y:
          (_isCapacity === true && isFutureDate) ||
          (_isCapacity === true && hasInfiniteQuantity === true) ||
          (!_isCapacity && hasData === false && isFutureDate) ||
          (!_isCapacity && hasData === false && isCurrentDate)
            ? null
            : value,
        date,
        hasData,
        hasInfiniteQuantity,
        isCurrentDate,
        isFutureDate
      };
    }
  );

  /**
   * Add an extra date to the first entry of the range to help Victory charts display.
   */
  if (futureDateCount === updatedResponse.data.length - 1) {
    updatedResponse.data = [
      {
        ...updatedResponse.data[0],
        x: 0,
        isCurrentDate: false
      },
      ...updatedResponse.data
    ].map((props, index) => ({ ...props, x: index }));
  }

  updatedResponse.meta = {
    category: params?.[RHSM_API_QUERY_SET_TYPES.CATEGORY],
    count: meta[TALLY_CAPACITY_META_TYPES.COUNT],
    cloudigradeHasMismatch: meta?.[TALLY_CAPACITY_META_TYPES.HAS_CLOUDIGRADE_MISMATCH],
    metricId: meta[TALLY_CAPACITY_META_TYPES.METRIC_ID],
    productId: meta[TALLY_CAPACITY_META_TYPES.PRODUCT],
    totalMonthlyDate: meta?.[TALLY_CAPACITY_META_TYPES.TOTAL_MONTHLY]?.[TALLY_CAPACITY_META_TYPES.DATE],
    totalMonthlyHasData: meta?.[TALLY_CAPACITY_META_TYPES.TOTAL_MONTHLY]?.[TALLY_CAPACITY_META_TYPES.HAS_DATA],
    totalMonthlyValue: meta?.[TALLY_CAPACITY_META_TYPES.TOTAL_MONTHLY]?.[TALLY_CAPACITY_META_TYPES.VALUE]
  };

  return updatedResponse;
};

const rhsmTransformers = {
  guests: rhsmInstancesGuests,
  instances: rhsmInstances,
  subscriptions: rhsmSubscriptions,
  tallyCapacity: rhsmTallyCapacity
};

export {
  rhsmTransformers as default,
  rhsmTransformers,
  rhsmInstances,
  rhsmInstancesGuests,
  rhsmSubscriptions,
  rhsmTallyCapacity
};
