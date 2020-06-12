import moment from 'moment';
import { c3GraphCardHelpers, c3Config, getTooltipDate, xAxisTickFormat, yAxisTickFormat } from '../c3GraphCardHelpers';
import { dateHelpers } from '../../../common';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../../../types/rhsmApiTypes';

describe('C3GraphCardHelpers', () => {
  it('should have specific functions', () => {
    expect(c3GraphCardHelpers).toMatchSnapshot('graphCardHelpers');
  });

  it('c3Config should return a c3 configuration object', () => {
    const configuration = c3Config({
      data: [
        {
          id: 'lorem',
          data: [{ date: '2019-06-08T00:00:00Z', x: 0, y: 1, hasData: false, isInfinite: false }],
          color: 'red'
        },
        {
          id: 'ipsum',
          data: [{ date: '2019-06-08T00:00:00Z', x: 0, y: 1, hasData: true, isInfinite: false }],
          color: 'red'
        },
        {
          id: 'dolor',
          data: [{ date: '2019-06-08T00:00:00Z', x: 0, y: 1, hasData: false, isInfinite: true }],
          color: 'red'
        },
        {
          id: 'sit',
          data: [{ date: '2019-06-08T00:00:00Z', x: 0, y: 1, hasData: true, isInfinite: true }],
          color: 'red'
        }
      ],
      granularity: GRANULARITY_TYPES.DAILY,
      productShortLabel: 'lorem'
    });
    expect({ configuration }).toMatchSnapshot('chart configuration');
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
      for (let k = 1; k < 16; k++) {
        const incrementMultiplier = k * multiplier;
        ticks[incrementMultiplier] = yAxisTickFormat({ tick: incrementMultiplier });
      }
    }

    expect(ticks).toMatchSnapshot('y axis tick values');
  });
});
