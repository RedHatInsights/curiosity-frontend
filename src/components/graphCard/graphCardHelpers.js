import moment from 'moment';
import numbro from 'numbro';
import { translate } from '../i18n/i18n';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../../types/rhsmApiTypes';
import { dateHelpers } from '../../common/dateHelpers';

/**
 * Returns x axis ticks/intervals array for the xAxisTickInterval
 *
 * @param {string} granularity, see enum of RHSM_API_QUERY_GRANULARITY_TYPES
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
 * @param {Date} date
 * @param {string} granularity, see enum of RHSM_API_QUERY_GRANULARITY_TYPES
 * @returns {string}
 */
const getTooltipDate = ({ date, granularity }) => {
  const momentDate = moment.utc(date);
  let formattedDateTooltip;

  switch (granularity) {
    case GRANULARITY_TYPES.QUARTERLY:
      formattedDateTooltip = dateHelpers.timestampQuarterFormats.yearLong;
      break;
    case GRANULARITY_TYPES.MONTHLY:
      formattedDateTooltip = dateHelpers.timestampMonthFormats.yearLong;
      break;
    case GRANULARITY_TYPES.WEEKLY:
    case GRANULARITY_TYPES.DAILY:
    default:
      formattedDateTooltip = dateHelpers.timestampDayFormats.long;
      break;
  }

  return momentDate.format(formattedDateTooltip);
};

/**
 * Get tooltips for x axis while displaying y axis values.
 *
 * @param {Object} itemsByKey
 * @param {string} granularity, see enum of RHSM_API_QUERY_GRANULARITY_TYPES
 * @param {string} product, apply the product to locale strings
 * @returns {string | *}
 */
/**
 * ToDo: we have access to the datasets and index which gives us access to the previous date.
 * Consider adding back in the year on tooltip cross year displays
 */
const getTooltips = ({ itemsByKey, granularity, product = '' }) => {
  let dateString = '';
  let thresholdString = '';
  const dataFacets = [];

  Object.keys(itemsByKey).forEach((key, index) => {
    if (index === 0) {
      dateString = `${translate('curiosity-graph.dateLabel')}: ${getTooltipDate({
        date: itemsByKey[key].date,
        granularity
      })}`;
    }

    if (itemsByKey[key].y) {
      if (/^threshold/.test(key)) {
        thresholdString = `${translate(`curiosity-graph.thresholdLabel`)}: ${itemsByKey[key].y}\n`;
      } else {
        dataFacets.push(`${translate(`curiosity-graph.${key}Label`, { product })}: ${itemsByKey[key].y}\n`);
      }
    }
  });

  return (
    ((thresholdString || dataFacets.length) && `${thresholdString}${dataFacets.join('')}${dateString}`.trim()) ||
    translate('curiosity-graph.noDataLabel')
  );
};

/**
 * Format x axis ticks.
 *
 * @param {Date} date
 * @param {string} granularity, see enum of RHSM_API_QUERY_GRANULARITY_TYPES
 * @param {number|string} tick
 * @param {Date} previousDate
 * @returns {string|undefined}
 */
const xAxisTickFormat = ({ date, granularity, tick, previousDate }) => {
  if (!date || !granularity) {
    return undefined;
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
 * @param {number|string} tick
 * @returns {string}
 */
const yAxisTickFormat = ({ tick }) => numbro(tick).format({ average: true, mantissa: 1, optionalMantissa: true });

const graphCardHelpers = {
  getChartXAxisLabelIncrement,
  getTooltipDate,
  getTooltips,
  xAxisTickFormat,
  yAxisTickFormat
};

export {
  graphCardHelpers as default,
  graphCardHelpers,
  getChartXAxisLabelIncrement,
  getTooltipDate,
  getTooltips,
  xAxisTickFormat,
  yAxisTickFormat
};
