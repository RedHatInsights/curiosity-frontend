import moment from 'moment';
import numbro from 'numbro';
import { chart_color_green_300 as chartColorGreenDark } from '@patternfly/react-tokens';
import { translate } from '../i18n/i18n';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../../types/rhsmApiTypes';
import { dateHelpers, helpers } from '../../common';

/**
 * Return a formatted date string.
 *
 * @param {object} params
 * @param {Date} params.date
 * @param {string} params.granularity See enum of RHSM_API_QUERY_GRANULARITY_TYPES
 * @returns {string}
 */
const getTooltipDate = ({ date, granularity }) => {
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
 * @param {Date} params.date
 * @param {string} params.granularity See enum of RHSM_API_QUERY_GRANULARITY_TYPES
 * @param {number|string} params.tick
 * @param {Date} params.previousDate
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
 * @param {object} params
 * @param {number|string} params.tick
 * @returns {string}
 */
const yAxisTickFormat = ({ tick }) => numbro(tick).format({ average: true, mantissa: 1, optionalMantissa: true });

/**
 * Convert data into a C3 configuration object.
 *
 * @param {object} options
 * @param {Array} options.data
 * @param {string} options.granularity
 * @param {string} options.productShortLabel
 * @returns {{configuration: {padding: {top: number, left: number, bottom: number, right: number},
 *     data: {types: {}, names: {}, columns: [], x: string, groups: [[]], colors: {}},
 *     legend: {show: boolean}, grid: {y: {show: boolean}}, tooltip: {format: {title: (function(*): string),
 *     value: (function(*, *, *=, *): *)}, order: (function(*, *): number)}, unloadBeforeLoad: boolean,
 *     spline: {interpolation: {type: string}}, axis: {x: {padding: number,
 *     tick: {format: (function(*=): string)}, type: string}, y: {padding: {bottom: number},
 *     default: number[], min: number, tick: {show: boolean, outer: boolean,
 *     format: (function(*): string)}}}, point: {show: boolean}}, hiddenDataFacets: []}}
 */
const c3Config = ({ data = [], granularity, productShortLabel }) => {
  const hiddenDataFacets = [];
  const converted = {
    x: 'x',
    colors: {},
    columns: [],
    groups: [[]],
    names: {},
    types: {}
  };

  const convertTimeSeriesDate = value => {
    const dateStr = (helpers.TEST_MODE && moment.utc(value)) || moment.utc(value).local();
    return dateStr.format('YYYY-MM-DD');
  };

  data.forEach(value => {
    if (/^threshold/.test(value.id)) {
      converted.colors[value.id] = value.color || chartColorGreenDark.value;
      converted.types[value.id] = 'step';
      converted.names[value.id] = translate(`curiosity-graph.thresholdLabel`);
    } else {
      converted.colors[value.id] = value.color;
      converted.types[value.id] = 'area-spline';
      converted.groups[0].push(value.id);
      converted.names[value.id] = translate(`curiosity-graph.${value.id}Label`, { product: productShortLabel });
    }

    converted.columns[0] = ['x'];
    converted.columns.push([value.id]);

    let totalData = 0;

    value.data.forEach(filteredValue => {
      converted.columns[0].push(convertTimeSeriesDate(filteredValue.date));
      converted.columns[converted.columns.length - 1].push(filteredValue.y);
      totalData += filteredValue.y || 0;
    });

    // ToDo: need to check for infinite threshold, possibly has data
    if (totalData <= 0) {
      converted.columns.pop();
      hiddenDataFacets.push(value.id);
    }
  });

  return {
    hiddenDataFacets,
    configuration: {
      tooltip: {
        order: (a, b) => converted.columns.indexOf(a.id) - converted.columns.indexOf(b.id),
        format: {
          title: date =>
            getTooltipDate({
              date,
              granularity
            }),
          value: (value, ratio, id, index) => {
            const dataItem = data.find(dataValue => id === dataValue.id)?.data[index];
            let updatedValue;

            if (/^threshold/.test(id)) {
              updatedValue =
                (dataItem?.hasInfinite && translate('curiosity-graph.infiniteThresholdLabel')) ||
                (dataItem?.y ?? translate('curiosity-graph.noDataLabel'));
            } else {
              updatedValue =
                (dataItem?.hasData === false && translate('curiosity-graph.noDataLabel')) || dataItem?.y || 0;
            }

            return updatedValue;
          }
        }
      },
      unloadBeforeLoad: true,
      padding: { left: 40, right: 40, top: 10, bottom: 10 },
      legend: { show: false },
      spline: {
        interpolation: {
          type: 'monotone'
        }
      },
      data: {
        ...converted
      },
      point: {
        show: false
      },
      grid: {
        y: {
          show: true
        }
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: tick => {
              const xAxisTicks = converted.columns[0].slice(1);
              const formattedDate = convertTimeSeriesDate(tick);
              const dateIndex = xAxisTicks.indexOf(formattedDate);
              const previousDate = dateIndex > -1 && xAxisTicks[dateIndex - 1];

              return xAxisTickFormat({
                tick: dateIndex,
                date: formattedDate,
                previousDate,
                granularity
              });
            }
          },
          padding: 0
        },
        y: {
          default: [0, 50],
          padding: { bottom: 0 },
          min: 0,
          tick: {
            show: false,
            outer: false,
            format: tick => (tick === 0 ? '' : yAxisTickFormat({ tick }))
          }
        }
      }
    }
  };
};

const c3GraphCardHelpers = {
  c3Config,
  getTooltipDate,
  xAxisTickFormat,
  yAxisTickFormat
};

export {
  c3GraphCardHelpers as default,
  c3GraphCardHelpers,
  c3Config,
  getTooltipDate,
  xAxisTickFormat,
  yAxisTickFormat
};
