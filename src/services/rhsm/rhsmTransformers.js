import moment from 'moment';
import {
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_RESPONSE_CAPACITY_DATA_TYPES as CAPACITY_DATA_TYPES,
  RHSM_API_RESPONSE_CAPACITY_META_TYPES as CAPACITY_META_TYPES,
  RHSM_API_RESPONSE_HOSTS_DATA_TYPES as HOSTS_DATA_TYPES,
  RHSM_API_RESPONSE_HOSTS_META_TYPES as HOSTS_META_TYPES,
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INSTANCES_DATA_TYPES,
  RHSM_API_RESPONSE_INSTANCES_META_TYPES as INSTANCES_META_TYPES,
  RHSM_API_RESPONSE_TALLY_DATA_TYPES as TALLY_DATA_TYPES,
  RHSM_API_RESPONSE_TALLY_META_TYPES as TALLY_META_TYPES,
  rhsmConstants
} from './rhsmConstants';
import { dateHelpers } from '../../common';

/**
 * FixMe: The capacity transformer is emulating metric identifier behavior to provide a consistent component update path.
 * The _metricId passed via configuration should be removed in favor of the transformer pattern used by "rhsmTally".
 * Review using the same transformer for both Tally and Capacity once Capacity is fully aligned with Tally.
 */
/**
 * Parse RHSM capacity response for caching.
 *
 * @param {object} response
 * @param {object} config
 * @param {string} config._metricId
 * @param {string} config.params
 * @returns {object}
 */
const rhsmCapacity = (response, { _metricId, params } = {}) => {
  const updatedResponse = {};
  const { [rhsmConstants.RHSM_API_RESPONSE_DATA]: data = [], [rhsmConstants.RHSM_API_RESPONSE_META]: meta = {} } =
    response || {};
  const currentDate = moment.utc(dateHelpers.getCurrentDate());
  const currentDateStr = moment.utc(dateHelpers.getCurrentDate()).format('MM-D-YYYY');
  let futureDateCount = 0;

  updatedResponse.data = data.map(
    (
      {
        [CAPACITY_DATA_TYPES.DATE]: date,
        [_metricId?.toLowerCase()]: value,
        [CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: hasInfiniteQuantity
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
        y: isFutureDate || hasInfiniteQuantity === true ? null : value,
        date,
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
    count: meta[CAPACITY_META_TYPES.COUNT],
    metricId: _metricId,
    productId: meta[CAPACITY_META_TYPES.PRODUCT]
  };

  return updatedResponse;
};

/**
 * Parse RHSM hosts response for caching.
 *
 * @param {object} response
 * @returns {object}
 */
const rhsmHosts = response => {
  const updatedResponse = {};
  const { [rhsmConstants.RHSM_API_RESPONSE_DATA]: data = [], [rhsmConstants.RHSM_API_RESPONSE_META]: meta = {} } =
    response || {};

  updatedResponse.data = data.map(
    ({
      [HOSTS_DATA_TYPES.NUMBER_OF_GUESTS]: numberOfGuests,
      [HOSTS_DATA_TYPES.SUBSCRIPTION_MANAGER_ID]: subscriptionManagerId,
      ...dataResponse
    }) => ({
      [HOSTS_DATA_TYPES.NUMBER_OF_GUESTS]: numberOfGuests,
      [HOSTS_DATA_TYPES.SUBSCRIPTION_MANAGER_ID]: subscriptionManagerId,
      numberOfGuests,
      subscriptionManagerId,
      ...dataResponse
    })
  );

  updatedResponse.meta = {
    count: meta[HOSTS_META_TYPES.COUNT],
    productId: meta[HOSTS_META_TYPES.PRODUCT]
  };

  return updatedResponse;
};

/**
 * FixMe: If RHSM Instances is deprecating Hosts we're missing a property, number_of_guests
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
      [INSTANCES_DATA_TYPES.SUBSCRIPTION_MANAGER_ID]: subscriptionManagerId,
      [INSTANCES_DATA_TYPES.NUMBER_OF_GUESTS]: numberOfGuests,
      ...dataResponse
    }) => {
      const updatedData = {
        numberOfGuests,
        subscriptionManagerId,
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
 * ToDo: Evaluate granularity alterations, transform logic is targeted at daily granularity
 * Specifically, the "isCurrentDate" condition is targeted at daily. Weekly, monthly, and
 * quarterly have not been tested, and may need logic adjustments for "isCurrentLikeDate".
 */
/**
 * Parse RHSM tally response for caching.
 *
 * @param {object} response
 * @param {object} config
 * @param {string} config.params
 * @returns {object}
 */
const rhsmTally = (response, { params } = {}) => {
  const updatedResponse = {};
  const { [rhsmConstants.RHSM_API_RESPONSE_DATA]: data = [], [rhsmConstants.RHSM_API_RESPONSE_META]: meta = {} } =
    response || {};
  const currentDate = moment.utc(dateHelpers.getCurrentDate());
  const currentDateStr = moment.utc(dateHelpers.getCurrentDate()).format('MM-D-YYYY');
  let futureDateCount = 0;

  updatedResponse.data = data.map(
    (
      { [TALLY_DATA_TYPES.DATE]: date, [TALLY_DATA_TYPES.VALUE]: value, [TALLY_DATA_TYPES.HAS_DATA]: hasData },
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
        y: (hasData === false && isFutureDate) || (hasData === false && isCurrentDate) ? null : value,
        date,
        hasData,
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
    count: meta[TALLY_META_TYPES.COUNT],
    cloudigradeHasMismatch: meta?.[TALLY_META_TYPES.HAS_CLOUDIGRADE_MISMATCH],
    metricId: meta[TALLY_META_TYPES.METRIC_ID],
    productId: meta[TALLY_META_TYPES.PRODUCT],
    totalMonthlyDate: meta?.[TALLY_META_TYPES.TOTAL_MONTHLY]?.[TALLY_META_TYPES.DATE],
    totalMonthlyHasData: meta?.[TALLY_META_TYPES.TOTAL_MONTHLY]?.[TALLY_META_TYPES.HAS_DATA],
    totalMonthlyValue: meta?.[TALLY_META_TYPES.TOTAL_MONTHLY]?.[TALLY_META_TYPES.VALUE]
  };

  return updatedResponse;
};

const rhsmTransformers = {
  capacity: rhsmCapacity,
  hosts: rhsmHosts,
  instances: rhsmInstances,
  tally: rhsmTally
};

export { rhsmTransformers as default, rhsmTransformers, rhsmCapacity, rhsmHosts, rhsmInstances, rhsmTally };
