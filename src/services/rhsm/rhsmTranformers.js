import {
  RHSM_API_RESPONSE_TALLY_DATA_TYPES as TALLY_DATA_TYPES,
  RHSM_API_RESPONSE_TALLY_META_TYPES as TALLY_META_TYPES,
  rhsmConstants
} from './rhsmConstants';

const rhsmTally = response => {
  const updatedResponse = {};
  const { [rhsmConstants.RHSM_API_RESPONSE_DATA]: data = [], [rhsmConstants.RHSM_API_RESPONSE_META]: meta = {} } =
    response || {};

  updatedResponse.data = data.map(
    (
      { [TALLY_DATA_TYPES.DATE]: date, [TALLY_DATA_TYPES.VALUE]: value, [TALLY_DATA_TYPES.HAS_DATA]: hasData },
      index
    ) => ({
      x: index,
      y: value,
      date,
      hasData
    })
  );

  updatedResponse.meta = {
    count: meta[TALLY_META_TYPES.COUNT],
    metricId: meta[TALLY_META_TYPES.METRIC_ID],
    productId: meta[TALLY_META_TYPES.PRODUCT],
    totalMonthlyDate: meta[TALLY_META_TYPES.TOTAL_MONTHLY]?.[TALLY_META_TYPES.DATE],
    totalMonthlyHasData: meta[TALLY_META_TYPES.TOTAL_MONTHLY]?.[TALLY_META_TYPES.HAS_DATA],
    totalMonthlyValue: meta[TALLY_META_TYPES.TOTAL_MONTHLY]?.[TALLY_META_TYPES.VALUE]
  };

  return updatedResponse;
};

const rhsmTranformers = {
  tally: rhsmTally
};

export { rhsmTranformers as default, rhsmTranformers, rhsmTally };
