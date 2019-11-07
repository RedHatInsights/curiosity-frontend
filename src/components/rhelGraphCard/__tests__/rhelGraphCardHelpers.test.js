import moment from 'moment';
import {
  rhelGraphCardHelpers,
  getChartXAxisLabelIncrement,
  getGraphLabels,
  getTooltipDate,
  xAxisTickFormat,
  yAxisTickFormat
} from '../rhelGraphCardHelpers';
import { dateHelpers } from '../../../common';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../../../types/rhelApiTypes';

describe('RhelGraphCardHelpers', () => {
  it('should have specific functions', () => {
    expect(rhelGraphCardHelpers).toMatchSnapshot('rhelGraphCardHelpers');
  });

  it('getChartXAxisLabelIncrement should return a x axis tick increment based on granularity', () => {
    const daily = getChartXAxisLabelIncrement(GRANULARITY_TYPES.DAILY);
    const weekly = getChartXAxisLabelIncrement(GRANULARITY_TYPES.WEEKLY);
    const monthly = getChartXAxisLabelIncrement(GRANULARITY_TYPES.MONTHLY);
    const quarterly = getChartXAxisLabelIncrement(GRANULARITY_TYPES.QUARTERLY);

    expect({ daily, weekly, monthly, quarterly }).toMatchSnapshot('x axis tick increment');
  });

  it('getGraphLabels should return a label based on granularity', () => {
    const daily = getGraphLabels({ granularity: GRANULARITY_TYPES.DAILY, tooltipLabel: 'ipsum tooltip label' });
    const weekly = getGraphLabels({ granularity: GRANULARITY_TYPES.WEEKLY, tooltipLabel: 'ipsum tooltip label' });
    const monthly = getGraphLabels({ granularity: GRANULARITY_TYPES.MONTHLY, tooltipLabel: 'ipsum tooltip label' });
    const quarterly = getGraphLabels({ granularity: GRANULARITY_TYPES.QUARTERLY, tooltipLabel: 'ipsum tooltip label' });

    expect({ daily, weekly, monthly, quarterly }).toMatchSnapshot('granularity based label');
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
    const generateTicks = ({ startDate, endDate, granularity, momentGranularity }) => {
      const endDateStartDateDiff = moment(endDate).diff(startDate, momentGranularity);
      const generatedTicks = [];

      for (let i = 0; i <= endDateStartDateDiff; i++) {
        const date = moment
          .utc(startDate)
          .add(i, momentGranularity)
          .startOf(momentGranularity);

        const previousDate = moment(date)
          .subtract(1, momentGranularity)
          .startOf(momentGranularity);

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

      ticks[multiplier] = yAxisTickFormat(multiplier);
      ticks[thirteenMultiplier] = yAxisTickFormat(thirteenMultiplier);
      ticks[fifteenMultiplier] = yAxisTickFormat(fifteenMultiplier);
    }

    expect(ticks).toMatchSnapshot('y axis tick values');
  });
});
