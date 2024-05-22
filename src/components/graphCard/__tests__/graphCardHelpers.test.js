import moment from 'moment';
import {
  graphCardHelpers,
  generateChartIds,
  generateChartSettings,
  generateExtendedChartSettings,
  generateIsToolbarFilter,
  getChartXAxisLabelIncrement,
  getTooltipDate,
  xAxisTickFormat,
  yAxisTickFormat,
  getDailyMonthlyTotals,
  getRemainingCapacity,
  getRemainingOverage,
  getPrepaidTallyCapacity
} from '../graphCardHelpers';
import { dateHelpers } from '../../../common';
import {
  RHSM_API_QUERY_CATEGORY_TYPES as CATEGORY_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_SET_TYPES
} from '../../../services/rhsm/rhsmConstants';
import { ChartTypeVariant } from '../../chart/chartHelpers';

describe('GraphCardHelpers', () => {
  it('should have specific functions', () => {
    expect(graphCardHelpers).toMatchSnapshot('graphCardHelpers');
  });

  it('getChartXAxisLabelIncrement should return a x axis tick increment based on granularity', () => {
    const daily = getChartXAxisLabelIncrement(GRANULARITY_TYPES.DAILY);
    const weekly = getChartXAxisLabelIncrement(GRANULARITY_TYPES.WEEKLY);
    const monthly = getChartXAxisLabelIncrement(GRANULARITY_TYPES.MONTHLY);
    const quarterly = getChartXAxisLabelIncrement(GRANULARITY_TYPES.QUARTERLY);

    expect({ daily, weekly, monthly, quarterly }).toMatchSnapshot('x axis tick increment');
  });

  it('getTooltipDate should return a formatted date based on granularity', () => {
    const daily = getTooltipDate({ granularity: GRANULARITY_TYPES.DAILY, date: '2019-06-01T00:00:00Z' });
    const weekly = getTooltipDate({ granularity: GRANULARITY_TYPES.WEEKLY, date: '2019-06-01T00:00:00Z' });
    const monthly = getTooltipDate({ granularity: GRANULARITY_TYPES.MONTHLY, date: '2019-06-01T00:00:00Z' });
    const quarterly = getTooltipDate({ granularity: GRANULARITY_TYPES.QUARTERLY, date: '2019-06-01T00:00:00Z' });

    expect({ daily, weekly, monthly, quarterly }).toMatchSnapshot('granularity based date');
  });

  /**
   * Previously we handled the "discreet" filler dates, the API handles this now.
   * Now we emulate an API like response with "generateTicks".
   */
  it('xAxisTickFormat should produce consistent x axis tick values', () => {
    const generateTicks = ({ startDate, endDate, granularity, momentGranularity, chartWidth = 940 }) => {
      const endDateStartDateDiff = moment(endDate).diff(startDate, momentGranularity);
      const generatedTicks = [];

      for (let i = 0; i <= endDateStartDateDiff; i++) {
        const date = moment.utc(startDate).add(i, momentGranularity).startOf(momentGranularity);
        const previousDate = moment(date).subtract(1, momentGranularity).startOf(momentGranularity);
        const nextDate = moment(date).add(1, momentGranularity).startOf(momentGranularity);

        generatedTicks.push(
          xAxisTickFormat({
            chartWidth,
            date: date.toISOString(),
            granularity,
            nextDate: nextDate.toISOString(),
            previousDate: previousDate.toISOString(),
            tick: i
          })
        );
      }

      return generatedTicks;
    };

    const daily = generateTicks({
      ...dateHelpers.defaultDateTime,
      granularity: GRANULARITY_TYPES.DAILY,
      momentGranularity: 'days'
    });
    const weekly = generateTicks({
      ...dateHelpers.weeklyDateTime,
      granularity: GRANULARITY_TYPES.WEEKLY,
      momentGranularity: 'weeks'
    });
    const monthly = generateTicks({
      ...dateHelpers.monthlyDateTime,
      granularity: GRANULARITY_TYPES.MONTHLY,
      momentGranularity: 'months'
    });
    const quarterly = generateTicks({
      ...dateHelpers.quarterlyDateTime,
      granularity: GRANULARITY_TYPES.QUARTERLY,
      momentGranularity: 'quarters'
    });

    const quarterlySmallGraph = generateTicks({
      ...dateHelpers.quarterlyDateTime,
      granularity: GRANULARITY_TYPES.QUARTERLY,
      momentGranularity: 'quarters',
      chartWidth: 900
    });

    expect({ daily, weekly, monthly, quarterly, quarterlySmallGraph }).toMatchSnapshot('x axis tick values');

    expect({
      missingDate: xAxisTickFormat({ granularity: GRANULARITY_TYPES.DAILY, tick: 0 }),
      missingGranularity: xAxisTickFormat({ date: dateHelpers.defaultDateTime.startDate, tick: 0 })
    }).toMatchSnapshot('x axis should be undefined if date or granularity are missing');
  });

  it('yAxisTickFormat should produce consistent y axis tick values', () => {
    const generateTicks = (method = yAxisTickFormat) => {
      const ticks = {};
      for (let i = 0.00001345; i < 13; i++) {
        const multiplier = i < 1 ? i : Math.pow(10, i);
        for (let k = 1; k < 16; k++) {
          const incrementMultiplier = k * multiplier;
          ticks[incrementMultiplier] = method({ tick: incrementMultiplier });
        }
      }
      return ticks;
    };

    expect(generateTicks()).toMatchSnapshot('y axis tick values');
  });

  it('generateChartSettings should return base graph settings', () => {
    expect(generateChartSettings()).toMatchSnapshot('no filters');

    expect(
      generateChartSettings({
        filters: [{ lorem: 'ipsum' }, { metric: 'dolorSit', dolor: 'sit' }],
        productId: 'loremIpsumTest'
      })
    ).toMatchSnapshot('basic filters');
  });

  it('generateExtendedChartSettings should return extended graph settings', () => {
    expect(generateExtendedChartSettings()).toMatchSnapshot('no settings');

    expect(
      generateExtendedChartSettings({ settings: { lorem: 'ipsum' }, granularity: GRANULARITY_TYPES.DAILY })
    ).toMatchSnapshot('basic settings');
  });

  it('generateIsToolbarFilter should return a consistent check', () => {
    expect(generateIsToolbarFilter({ query: {} })).toMatchSnapshot('is NOT a toolbar filter');
    expect(generateIsToolbarFilter({ query: { [RHSM_API_QUERY_SET_TYPES.CATEGORY]: 'lorem' } })).toMatchSnapshot(
      'is toolbar filter'
    );
  });

  it('generateChartIds should return consistent IDs', () => {
    expect(generateChartIds({ metric: 'lorem', productId: 'ipsum' })).toMatchSnapshot('base id');

    expect(generateChartIds({ isCapacity: true, metric: 'lorem', productId: 'ipsum' })).toMatchSnapshot(
      'threshold, capacity id'
    );

    expect(
      generateChartIds({
        metric: 'lorem',
        productId: 'ipsum',
        query: { [RHSM_API_QUERY_SET_TYPES.CATEGORY]: 'dolor-sir' }
      })
    ).toMatchSnapshot('category id');
  });

  it('getDailyMonthlyTotals should return total values', () => {
    expect(
      getDailyMonthlyTotals({
        dataSet: {
          data: [
            {
              date: '2023-06-12T00:00:00.000Z',
              hasData: true,
              y: 100
            },
            {
              date: '2023-06-13T00:00:00.000Z',
              hasData: false,
              y: 0
            }
          ],
          meta: {
            totalMonthlyDate: '2023-06-13T00:00:00.000Z',
            totalMonthlyHasData: true,
            totalMonthlyValue: 100
          }
        }
      })
    ).toMatchSnapshot('base');
  });

  it('getPrepaidTallyCapacity should return tally, capacity dataSets', () => {
    expect(
      getPrepaidTallyCapacity({
        data: [
          {
            chartType: ChartTypeVariant.threshold,
            data: 'mock threshold data'
          },
          {
            chartType: ChartTypeVariant.area,
            id: `lorem-ipsum-${CATEGORY_TYPES.PREPAID}`,
            data: 'mock area chart data'
          },
          {
            chartType: ChartTypeVariant.line
          }
        ]
      })
    ).toMatchSnapshot('base');
  });

  it('getRemainingCapacity should return capacity values', () => {
    expect(
      getRemainingCapacity({
        capacityData: [
          {
            date: '2023-06-12T00:00:00.000Z',
            hasData: true,
            isCurrentDate: true,
            y: 100
          },
          {
            date: '2023-06-13T00:00:00.000Z',
            hasData: false,
            y: 0
          }
        ],
        tallyData: [
          {
            date: '2023-06-12T00:00:00.000Z',
            hasData: true,
            isCurrentDate: true,
            y: 50
          },
          {
            date: '2023-06-13T00:00:00.000Z',
            hasData: false,
            y: 0
          }
        ],
        isCurrent: true
      })
    ).toMatchSnapshot('base');

    expect(
      getRemainingCapacity({
        capacityData: [
          {
            date: '2023-06-12T00:00:00.000Z',
            hasData: true,
            isCurrentDate: true,
            y: 50
          },
          {
            date: '2023-06-13T00:00:00.000Z',
            hasData: false,
            y: 0
          }
        ],
        tallyData: [
          {
            date: '2023-06-12T00:00:00.000Z',
            hasData: true,
            isCurrentDate: true,
            y: 100
          },
          {
            date: '2023-06-13T00:00:00.000Z',
            hasData: false,
            y: 0
          }
        ],
        isCurrent: true
      })
    ).toMatchSnapshot('fallback');
  });

  it('getRemainingOverage should return overage values', () => {
    expect(
      getRemainingOverage({
        capacityData: [
          {
            date: '2023-06-12T00:00:00.000Z',
            hasData: true,
            isCurrentDate: true,
            y: 50
          },
          {
            date: '2023-06-13T00:00:00.000Z',
            hasData: false,
            y: 0
          }
        ],
        tallyData: [
          {
            date: '2023-06-12T00:00:00.000Z',
            hasData: true,
            isCurrentDate: true,
            y: 100
          },
          {
            date: '2023-06-13T00:00:00.000Z',
            hasData: false,
            y: 0
          }
        ],
        isCurrent: true
      })
    ).toMatchSnapshot('base');

    expect(
      getRemainingOverage({
        capacityData: [
          {
            date: '2023-06-12T00:00:00.000Z',
            hasData: true,
            isCurrentDate: true,
            y: 100
          },
          {
            date: '2023-06-13T00:00:00.000Z',
            hasData: false,
            y: 0
          }
        ],
        tallyData: [
          {
            date: '2023-06-12T00:00:00.000Z',
            hasData: true,
            isCurrentDate: true,
            y: 50
          },
          {
            date: '2023-06-13T00:00:00.000Z',
            hasData: false,
            y: 0
          }
        ],
        isCurrent: true
      })
    ).toMatchSnapshot('fallback');
  });
});
