import moment from 'moment';
import {
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INSTANCES_DATA_TYPES,
  RHSM_API_RESPONSE_INSTANCES_META_TYPES as INSTANCES_META_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES as SUBSCRIPTIONS_DATA_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTIONS_META_TYPES as SUBSCRIPTIONS_META_TYPES,
  RHSM_API_RESPONSE_TALLY_CAPACITY_DATA_TYPES as TALLY_CAPACITY_DATA_TYPES,
  RHSM_API_RESPONSE_TALLY_CAPACITY_META_TYPES as TALLY_CAPACITY_META_TYPES,
  RHSM_API_RESPONSE_BILLING_ACCOUNT_ID_TYPES as BILLING_ACCOUNT_ID_TYPES,
  rhsmConstants
} from './rhsmConstants';
import { dateHelpers, helpers } from '../../common';
import { rhsmHelpers } from './rhsmHelpers';

/**
 * Transform RHSM responses. Replaces selector usage.
 *
 * @memberof Rhsm
 * @module RhsmTransformers
 */

/**
 * Parse RHSM billing account id responses.
 *
 * @param {object} response
 * @returns {object}
 */
const rhsmBillingAccounts = (response = []) => {
  const accountResponseSizes = new Set();
  const successResponse = response
    .filter(({ status }) => status === 200)
    .map(({ data = {}, config }) => {
      const accountIdData = data?.[rhsmConstants.RHSM_API_RESPONSE_ID] || [];
      accountResponseSizes.add(accountIdData.length);

      return accountIdData.map(
        ({
          [BILLING_ACCOUNT_ID_TYPES.BILLING_ACCOUNT_ID]: id,
          [BILLING_ACCOUNT_ID_TYPES.BILLING_PROVIDER]: provider
        }) => ({
          id,
          type: config?._accountType || 'unknown',
          provider
        })
      );
    })
    .flat()
    .filter(res => typeof res?.provider === 'string' && typeof res?.id === 'string');

  const isBillingCountDiffBetweenServiceTypes = accountResponseSizes.size > 1;
  const accountsByProvider = {};
  const defaultAccountByProvider = {};
  const baseMetrics = {};

  /**
   * Finish processing service responses
   */
  successResponse.forEach(({ id, provider, type }) => {
    baseMetrics[type] ??= [];

    if (
      !baseMetrics[type].find(
        ({ id: existingId, provider: existingProvider }) => id === existingId && provider === existingProvider
      )
    ) {
      baseMetrics[type].push({ id, provider, type });
    }

    accountsByProvider[provider] ??= new Set();
    accountsByProvider[provider].add(id);
  });

  /**
   * Breakdown accounts by provider, defaults for convenient display
   */
  const billingProviders = [...Object.keys(accountsByProvider)].sort();

  billingProviders.forEach(provider => {
    accountsByProvider[provider] = Array.from(accountsByProvider[provider]).sort();
    defaultAccountByProvider[provider] = accountsByProvider[provider]?.[0];
  });

  const defaultProvider = billingProviders?.[0];
  const defaultAccount = defaultAccountByProvider[defaultProvider];

  /**
   * Apply metrics, determine unique providers, accounts by service type.
   */
  const serviceTypeProviderAccountIdMetrics = rhsmHelpers.billingMetrics(baseMetrics);

  return {
    accountsByProvider,
    billingProviders,
    defaultProvider,
    defaultAccount,
    defaultAccountByProvider,
    isBillingActive: defaultAccount !== undefined && defaultProvider !== undefined,
    isBillingCountDiffBetweenServiceTypes,
    isUsageError:
      serviceTypeProviderAccountIdMetrics?.instances?.hasUniqueAccounts ||
      serviceTypeProviderAccountIdMetrics?.instances?.hasUniqueProviders ||
      false,
    serviceTypeProviderAccountIdMetrics,
    usageMetrics: serviceTypeProviderAccountIdMetrics?.instances || {}
  };
};

/**
 * A memoized response for the rhsmBillingAccounts function. Assigned to a property for testing function.
 *
 * @type {Function}
 */
rhsmBillingAccounts.memo = helpers.memo(rhsmBillingAccounts, { cacheLimit: 25 });

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
 * Note: The "has_infinite_quantity" bool response property applies to ALL measurements!
 */
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
  const metaMeasurements = meta[INSTANCES_META_TYPES.MEASUREMENTS];

  updatedResponse.data = data.map(({ [SUBSCRIPTIONS_DATA_TYPES.MEASUREMENTS]: measurements, ...dataResponse }) => {
    const updatedData = {
      ...dataResponse
    };

    metaMeasurements?.forEach((measurement, index) => {
      updatedData[measurement] = measurements[index];
    });

    return updatedData;
  });

  updatedResponse.meta = {
    ...meta,
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
  billingAccounts: rhsmBillingAccounts,
  guests: rhsmInstancesGuests,
  instances: rhsmInstances,
  subscriptions: rhsmSubscriptions,
  tallyCapacity: rhsmTallyCapacity
};

export {
  rhsmTransformers as default,
  rhsmTransformers,
  rhsmBillingAccounts,
  rhsmInstances,
  rhsmInstancesGuests,
  rhsmSubscriptions,
  rhsmTallyCapacity
};
