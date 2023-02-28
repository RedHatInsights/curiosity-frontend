import moment from 'moment';
import { chart_color_green_300 as chartColorGreenDark } from '@patternfly/react-tokens';
import { ChartTypeVariant } from '../chart/chart';
import {
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_SET_TYPES
} from '../../services/rhsm/rhsmConstants';
import { dateHelpers, helpers } from '../../common';

/**
 * @memberof GraphCard
 * @module GraphCardHelpers
 */

/**
 * Generate a consistent chart identifier from API.
 *
 * @param {object} params
 * @param {boolean} params.isCapacity
 * @param {string} params.metric
 * @param {string} params.productId
 * @param {object} params.query
 * @returns {string}
 */
const generateChartIds = ({ isCapacity, metric, productId, query = {} } = {}) => {
  const metricCategory = query?.[RHSM_API_QUERY_SET_TYPES.CATEGORY] || undefined;
  return `${(isCapacity && 'threshold_') || ''}${metric}${(metricCategory && `_${metricCategory}`) || ''}${
    (productId && `_${productId}`) || ''
  }`;
};

/**
 * Is metric associated with a toolbar filter
 *
 * @param {object} params
 * @param {object} params.query
 * @returns {boolean}
 */
const generateIsToolbarFilter = ({ query = {} } = {}) => (query?.[RHSM_API_QUERY_SET_TYPES.CATEGORY] && true) || false;

/**
 * Update chart/graph filters with core settings and styling.
 *
 * @param {object} params
 * @param {Array} params.filters
 * @param {object} params.settings
 * @param {string} params.productId
 * @returns {{standaloneFilters: Array, groupedFilters: object}}
 */
const generateChartSettings = ({ filters = [], settings: graphCardSettings = {}, productId } = {}) => {
  const standaloneFiltersSettings = [];
  const groupedFiltersSettings = [];

  filters.forEach(({ metric, isStandalone = false, actions, ...filterSettings }) => {
    if (!metric) {
      return;
    }
    const updatedChartType = filterSettings?.chartType || ChartTypeVariant.area;
    const isThreshold = filterSettings?.chartType === ChartTypeVariant.threshold;
    const baseFilterSettings = {
      chartType: updatedChartType,
      id: generateChartIds({ isCapacity: isThreshold, metric, productId, query: filterSettings?.query }),
      isStacked: !isThreshold,
      isStandalone,
      isThreshold,
      isCapacity: isThreshold,
      metric,
      strokeWidth: 2,
      isToolbarFilter: generateIsToolbarFilter({ query: filterSettings?.query })
    };

    if (isThreshold) {
      baseFilterSettings.stroke = chartColorGreenDark.value;
      baseFilterSettings.strokeDasharray = '4,3';
      baseFilterSettings.strokeWidth = 3;
    }

    if (isStandalone) {
      standaloneFiltersSettings.push({
        settings: {
          padding: {
            bottom: 75,
            left: 75,
            right: 45,
            top: 45
          },
          ...graphCardSettings,
          actions,
          isStandalone: true,
          metric: {
            ...baseFilterSettings,
            ...filterSettings
          },
          metrics: [
            {
              ...baseFilterSettings,
              ...filterSettings
            }
          ]
        }
      });
    } else {
      groupedFiltersSettings.push({
        ...baseFilterSettings,
        ...filterSettings
      });
    }
  });

  const updatedGroupedFiltersSettings =
    (groupedFiltersSettings.length && {
      settings: {
        ...graphCardSettings,
        isStandalone: false,
        metric: undefined,
        metrics: groupedFiltersSettings
      }
    }) ||
    undefined;

  return {
    standaloneFiltersSettings,
    groupedFiltersSettings: updatedGroupedFiltersSettings
  };
};

/**
 * Returns x axis ticks/intervals array for the xAxisTickInterval
 *
 * @param {string} granularity See enum of RHSM_API_QUERY_GRANULARITY_TYPES
 * @returns {number}
 */
const getChartXAxisLabelIncrement = granularity => {
  switch (granularity) {
    case GRANULARITY_TYPES.DAILY:
      return 5;
    case GRANULARITY_TYPES.WEEKLY:
    case GRANULARITY_TYPES.MONTHLY:
      return 2;
    case GRANULARITY_TYPES.QUARTERLY:
    default:
      return 1;
  }
};

/**
 * Return a formatted date string.
 *
 * @param {object} params
 * @param {Date} params.date
 * @param {string} params.granularity See enum of RHSM_API_QUERY_GRANULARITY_TYPES
 * @returns {string}
 */
const getTooltipDate = ({ date, granularity } = {}) => {
  const momentDate = moment.utc(date);

  switch (granularity) {
    case GRANULARITY_TYPES.QUARTERLY:
      return `${momentDate.format(dateHelpers.timestampQuarterFormats.yearShort)} - ${momentDate
        .add(1, 'quarter')
        .format(dateHelpers.timestampQuarterFormats.yearShort)}`;

    case GRANULARITY_TYPES.MONTHLY:
      return momentDate.format(dateHelpers.timestampMonthFormats.yearLong);

    case GRANULARITY_TYPES.WEEKLY:
      return `${momentDate.format(dateHelpers.timestampDayFormats.short)} - ${momentDate
        .add(1, 'week')
        .format(dateHelpers.timestampDayFormats.yearShort)}`;

    case GRANULARITY_TYPES.DAILY:
    default:
      return momentDate.format(dateHelpers.timestampDayFormats.long);
  }
};

/**
 * Format x axis ticks.
 *
 * @param {object} params
 * @param {Function} params.callback
 * @param {Date} params.date
 * @param {string} params.granularity See enum of RHSM_API_QUERY_GRANULARITY_TYPES
 * @param {number|string} params.tick
 * @param {Date} params.previousDate
 * @returns {string|undefined}
 */
const xAxisTickFormat = ({ callback, date, granularity, tick, previousDate } = {}) => {
  if (!date || !granularity) {
    return undefined;
  }

  if (callback) {
    return callback({ callback, date, granularity, tick, previousDate });
  }

  const momentDate = moment.utc(date);
  const isNewYear =
    tick !== 0 && Number.parseInt(momentDate.year(), 10) !== Number.parseInt(moment.utc(previousDate).year(), 10);
  let formattedDate;

  switch (granularity) {
    case GRANULARITY_TYPES.QUARTERLY:
      formattedDate = isNewYear
        ? momentDate.format(dateHelpers.timestampQuarterFormats.yearShort)
        : momentDate.format(dateHelpers.timestampQuarterFormats.short);

      formattedDate = formattedDate.replace(/\s/, '\n');
      break;
    case GRANULARITY_TYPES.MONTHLY:
      formattedDate = isNewYear
        ? momentDate.format(dateHelpers.timestampMonthFormats.yearShort)
        : momentDate.format(dateHelpers.timestampMonthFormats.short);

      formattedDate = formattedDate.replace(/\s/, '\n');
      break;
    case GRANULARITY_TYPES.WEEKLY:
    case GRANULARITY_TYPES.DAILY:
    default:
      formattedDate = isNewYear
        ? momentDate.format(dateHelpers.timestampDayFormats.yearShort)
        : momentDate.format(dateHelpers.timestampDayFormats.short);

      formattedDate = formattedDate.replace(/\s(\d{4})$/, '\n$1');
      break;
  }

  return formattedDate;
};

/**
 * Format y axis ticks.
 *
 * @param {object} params
 * @param {Function} params.callback
 * @param {number|string} params.tick
 * @returns {string}
 */
const yAxisTickFormat = ({ callback, tick } = {}) => {
  if (callback) {
    return callback({ tick });
  }

  return helpers
    .numberDisplay(tick)
    ?.format({
      average: true,
      mantissa: 1,
      trimMantissa: true,
      lowPrecision: false
    })
    ?.toUpperCase();
};

/**
 * Generate base chart component props.
 *
 * @param {object} params
 * @param {object} params.settings
 * @param {string} params.granularity
 * @returns {object}
 */
const generateExtendedChartSettings = ({ settings, granularity } = {}) => ({
  ...settings,
  xAxisLabelIncrement: getChartXAxisLabelIncrement(granularity),
  xAxisTickFormat: ({ item, previousItem, tick }) =>
    xAxisTickFormat({
      callback: settings?.xAxisTickFormat,
      tick,
      date: item.date,
      previousDate: previousItem.date,
      granularity
    }),
  yAxisTickFormat: ({ tick }) =>
    yAxisTickFormat({
      callback: settings?.yAxisTickFormat,
      tick
    })
});

const graphCardHelpers = {
  generateChartIds,
  generateChartSettings,
  generateExtendedChartSettings,
  generateIsToolbarFilter,
  getChartXAxisLabelIncrement,
  getTooltipDate,
  xAxisTickFormat,
  yAxisTickFormat
};

export {
  graphCardHelpers as default,
  graphCardHelpers,
  generateChartIds,
  generateChartSettings,
  generateExtendedChartSettings,
  generateIsToolbarFilter,
  getChartXAxisLabelIncrement,
  getTooltipDate,
  xAxisTickFormat,
  yAxisTickFormat
};
