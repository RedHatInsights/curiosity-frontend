import moment from 'moment';
import {
  graphCardHelpers,
  getChartXAxisLabelIncrement,
  getTooltipDate,
  getTooltips,
  xAxisTickFormat,
  yAxisTickFormat
} from '../graphCardHelpers';
import { dateHelpers } from '../../../common';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../../../types/rhsmApiTypes';

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

  it('getTooltips should return a formatted tooltip based on data and granularity', () => {
    const itemsByKey = {};

    const daily = () => getTooltips({ itemsByKey, granularity: GRANULARITY_TYPES.DAILY });
    const weekly = () => getTooltips({ itemsByKey, granularity: GRANULARITY_TYPES.WEEKLY });
    const monthly = () => getTooltips({ itemsByKey, granularity: GRANULARITY_TYPES.MONTHLY });
    const quarterly = () => getTooltips({ itemsByKey, granularity: GRANULARITY_TYPES.QUARTERLY });

    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'no data granularity data display'
    );

    // report value > 0
    itemsByKey.hypervisorSockets = { x: 0, y: 50, date: '2019-06-01T00:00:00Z', hasData: undefined };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'data display > 0 and UNDEFINED hasData on report'
    );

    itemsByKey.hypervisorSockets = { x: 0, y: 50, date: '2019-06-01T00:00:00Z', hasData: false };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'data display > 0 and NOT hasData on report'
    );

    itemsByKey.hypervisorSockets = { x: 0, y: 50, date: '2019-06-01T00:00:00Z', hasData: true };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'data display > 0 and hasData on report'
    );

    // report value = 0
    itemsByKey.hypervisorSockets = { x: 0, y: 0, date: '2019-06-01T00:00:00Z', hasData: undefined };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'data display for zero and UNDEFINED hasData on report'
    );

    itemsByKey.hypervisorSockets = { x: 0, y: 0, date: '2019-06-01T00:00:00Z', hasData: false };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'data display for zero and NOT hasData on report'
    );

    itemsByKey.hypervisorSockets = { x: 0, y: 0, date: '2019-06-01T00:00:00Z', hasData: true };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'data display for zero and hasData on report'
    );

    // report value = null
    itemsByKey.hypervisorSockets = { x: 0, y: null, date: '2019-06-01T00:00:00Z', hasData: undefined };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'data display for null and UNDEFINED hasData on report'
    );

    itemsByKey.hypervisorSockets = { x: 0, y: null, date: '2019-06-01T00:00:00Z', hasData: false };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'data display for null and NOT hasData on report'
    );

    itemsByKey.hypervisorSockets = { x: 0, y: null, date: '2019-06-01T00:00:00Z', hasData: true };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'data display for null and hasData on report'
    );

    delete itemsByKey.hypervisorSockets;

    // threshold value > 0
    itemsByKey.threshold = { x: 0, y: 100, date: '2019-06-01T00:00:00Z', hasInfinite: undefined };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'threshold display for > 0 and UNDEFINED hasInfinite on threshold'
    );

    itemsByKey.threshold = { x: 0, y: 100, date: '2019-06-01T00:00:00Z', hasInfinite: false };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'threshold display for > 0 and NOT hasInfinite on threshold'
    );

    itemsByKey.threshold = { x: 0, y: 100, date: '2019-06-01T00:00:00Z', hasInfinite: true };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'threshold display for > 0 and hasInfinite on threshold'
    );

    // threshold value = 0
    itemsByKey.threshold = { x: 0, y: 0, date: '2019-06-01T00:00:00Z', hasInfinite: undefined };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'threshold display for zero and UNDEFINED hasInfinite on threshold'
    );

    itemsByKey.threshold = { x: 0, y: 0, date: '2019-06-01T00:00:00Z', hasInfinite: false };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'threshold display for zero and NOT hasInfinite on threshold'
    );

    itemsByKey.threshold = { x: 0, y: 0, date: '2019-06-01T00:00:00Z', hasInfinite: true };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'threshold display for zero and hasInfinite on threshold'
    );

    // threshold value = null
    itemsByKey.threshold = { x: 0, y: null, date: '2019-06-01T00:00:00Z', hasInfinite: undefined };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'threshold display for null and UNDEFINED hasInfinite on threshold'
    );

    itemsByKey.threshold = { x: 0, y: null, date: '2019-06-01T00:00:00Z', hasInfinite: false };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'threshold display for null and NOT hasInfinite on threshold'
    );

    itemsByKey.threshold = { x: 0, y: null, date: '2019-06-01T00:00:00Z', hasInfinite: true };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'threshold display for null and hasInfinite on threshold'
    );
  });

  /**
   * Previously we handled the "discreet" filler dates, the API handles this now.
   * Now we emulate an API like response with "generateTicks".
   */
  it('xAxisTickFormat should produce consistent x axis tick values', () => {
    const generateTicks = ({ startDate, endDate, granularity, momentGranularity }) => {
      const endDateStartDateDiff = moment(endDate).diff(startDate, momentGranularity);
      const generatedTicks = [];

      for (let i = 0; i <= endDateStartDateDiff; i++) {
        const date = moment.utc(startDate).add(i, momentGranularity).startOf(momentGranularity);
        const previousDate = moment(date).subtract(1, momentGranularity).startOf(momentGranularity);

        generatedTicks.push(
          xAxisTickFormat({ date: date.toISOString(), granularity, tick: i, previousDate: previousDate.toISOString() })
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

    expect({ daily, weekly, monthly, quarterly }).toMatchSnapshot('x axis tick values');

    expect({
      missingDate: xAxisTickFormat({ granularity: GRANULARITY_TYPES.DAILY, tick: 0 }),
      missingGranularity: xAxisTickFormat({ date: dateHelpers.defaultDateTime.startDate, tick: 0 })
    }).toMatchSnapshot('x axis should be undefined if date or granularity are missing');
  });

  it('yAxisTickFormat should produce consistent y axis tick values', () => {
    const ticks = {};

    for (let i = 0; i < 11; i++) {
      const multiplier = Math.pow(10, i);
      const thirteenMultiplier = 13 * multiplier;
      const fifteenMultiplier = 15 * multiplier;

      ticks[multiplier] = yAxisTickFormat({ tick: multiplier });
      ticks[thirteenMultiplier] = yAxisTickFormat({ tick: thirteenMultiplier });
      ticks[fifteenMultiplier] = yAxisTickFormat({ tick: fifteenMultiplier });
    }

    expect(ticks).toMatchSnapshot('y axis tick values');
  });
});
