import {
  graphHelpers,
  convertChartData,
  getChartXAxisLabelIncrement,
  getGraphLabels,
  getGranularityDateType
} from '../graphHelpers';
import { rhelApiTypes } from '../../types/rhelApiTypes';

import { translate } from '../../components/i18n/i18n';

describe('GraphHelpers', () => {
  const GRANULARITY_TYPES = rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES;

  it('should have specific functions', () => {
    expect(graphHelpers).toMatchSnapshot('graphHelpers');
  });

  it('should convert graph data and return zeroed usage array if error', () => {
    const props = {
      dataFacet: rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS,
      dataThresholdFacet: rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS_THRESHOLD,
      tooltipLabel: translate('curiosity-graph.tooltipSockets'),
      tooltipThresholdLabel: translate('curiosity-graph.tooltipSocketsThreshold'),
      granularity: GRANULARITY_TYPES.DAILY,
      startDate: new Date('2019-06-01T00:00:00Z'),
      endDate: new Date('2019-06-05T23:59:59Z')
    };

    expect(convertChartData(props)).toMatchSnapshot('error is true');
  });

  it('should convert graph data and return zeroed usage array if usage is empty', () => {
    const props = {
      dataFacet: rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS,
      dataThresholdFacet: rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS_THRESHOLD,
      tooltipLabel: translate('curiosity-graph.tooltipSockets'),
      tooltipThresholdLabel: translate('curiosity-graph.tooltipSocketsThreshold'),
      granularity: GRANULARITY_TYPES.DAILY,
      startDate: new Date('2019-06-01T00:00:00Z'),
      endDate: new Date('2019-06-05T23:59:59Z'),
      data: []
    };

    expect(convertChartData(props)).toMatchSnapshot('zeroed array');
  });

  it('should convert graph data and generate tooltips when usage is populated', () => {
    const props = {
      dataFacet: rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS,
      dataThresholdFacet: rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS_THRESHOLD,
      tooltipLabel: translate('curiosity-graph.tooltipSockets'),
      tooltipThresholdLabel: translate('curiosity-graph.tooltipSocketsThreshold'),
      granularity: GRANULARITY_TYPES.DAILY,
      startDate: new Date('2019-06-01T00:00:00Z'),
      endDate: new Date('2019-06-05T23:59:59Z'),
      data: [
        {
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 56,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2019-06-01T00:00:00Z',
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 28,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 5,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS_THRESHOLD]: 10
        },
        {
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 30,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2019-06-02T00:00:00Z',
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 28,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 7,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS_THRESHOLD]: 10
        },
        {
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 40,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2019-06-03T00:00:00Z',
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 28,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 3,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS_THRESHOLD]: 10
        },
        {
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 0,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2019-06-04T00:00:00Z',
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 0,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 0,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS_THRESHOLD]: 10
        },
        {
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 0,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2019-06-05T00:00:00Z',
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 0,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 0,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS_THRESHOLD]: 10
        }
      ]
    };

    expect(convertChartData(props)).toMatchSnapshot('usage populated');
  });

  it('should convert graph data and returned zeroed array when usage throws error', () => {
    const props = {
      dataFacet: rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS,
      dataThresholdFacet: rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS_THRESHOLD,
      tooltipLabel: translate('curiosity-graph.tooltipSockets'),
      tooltipThresholdLabel: translate('curiosity-graph.tooltipSocketsThreshold'),
      granularity: GRANULARITY_TYPES.DAILY,
      startDate: new Date('2019-06-01T00:00:00Z'),
      endDate: new Date('2019-06-05T23:59:59Z'),
      data: [null]
    };

    expect(
      convertChartData({
        ...props
      })
    ).toMatchSnapshot('throws error');
  });

  it('should handle cross year labels', () => {
    const props = {
      dataFacet: rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS,
      dataThresholdFacet: rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS_THRESHOLD,
      tooltipLabel: translate('curiosity-graph.tooltipSockets'),
      tooltipThresholdLabel: translate('curiosity-graph.tooltipSocketsThreshold'),
      granularity: GRANULARITY_TYPES.DAILY,
      startDate: new Date('2018-12-31T00:00:00Z'),
      endDate: new Date('2019-01-06T00:00:00Z'),
      data: [
        {
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 56,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2018-12-31T00:00:00Z',
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 28,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 5,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS_THRESHOLD]: 10
        },
        {
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 30,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2019-01-01T00:00:00Z',
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 28,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 7,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS_THRESHOLD]: 10
        },
        {
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 30,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2019-01-02T00:00:00Z',
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 28,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 7,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS_THRESHOLD]: 10
        },
        {
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 30,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2019-01-03T00:00:00Z',
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 28,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 7,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS_THRESHOLD]: 10
        },
        {
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 30,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2019-01-04T00:00:00Z',
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 28,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 7,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS_THRESHOLD]: 10
        },
        {
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 30,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2019-01-05T00:00:00Z',
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 28,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 7,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS_THRESHOLD]: 10
        },
        {
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 30,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2019-01-06T00:00:00Z',
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 28,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 7,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS_THRESHOLD]: 10
        }
      ]
    };

    expect(convertChartData(props)).toMatchSnapshot('cross year');
  });

  it('should handle cross quarter labels', () => {
    const props = {
      dataFacet: rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS,
      dataThresholdFacet: rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS_THRESHOLD,
      tooltipLabel: translate('curiosity-graph.tooltipSockets'),
      tooltipThresholdLabel: translate('curiosity-graph.tooltipSocketsThreshold'),
      granularity: GRANULARITY_TYPES.QUARTERLY,
      startDate: new Date('2018-04-01T00:00:00Z'),
      endDate: new Date('2019-04-01T00:00:00Z'),
      data: [
        {
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 56,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2018-04-01T00:00:00Z',
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 28,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 5,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS_THRESHOLD]: 10
        },
        {
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 30,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2018-08-01T00:00:00Z',
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 28,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 7,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS_THRESHOLD]: 10
        },
        {
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 30,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2018-12-01T00:00:00Z',
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 28,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 7,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS_THRESHOLD]: 10
        },
        {
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 30,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2019-04-01T00:00:00Z',
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 28,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 7,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS_THRESHOLD]: 10
        },
        {
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 30,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2019-08-01T00:00:00Z',
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 28,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 7,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS_THRESHOLD]: 10
        }
      ]
    };

    expect(convertChartData(props)).toMatchSnapshot('quarter granularity');
  });

  it('should return a x axis tick increment based on granularity', () => {
    const daily = getChartXAxisLabelIncrement(GRANULARITY_TYPES.DAILY);
    const weekly = getChartXAxisLabelIncrement(GRANULARITY_TYPES.WEEKLY);
    const monthly = getChartXAxisLabelIncrement(GRANULARITY_TYPES.MONTHLY);
    const quarterly = getChartXAxisLabelIncrement(GRANULARITY_TYPES.QUARTERLY);
    expect({ daily, weekly, monthly, quarterly }).toMatchSnapshot('x axis tick increment');
  });

  it('should return a label based on granularity', () => {
    const daily = getGraphLabels({ granularity: GRANULARITY_TYPES.DAILY, tooltipLabel: 'ipsum' });
    const weekly = getGraphLabels({ granularity: GRANULARITY_TYPES.WEEKLY, tooltipLabel: 'ipsum' });
    const monthly = getGraphLabels({ granularity: GRANULARITY_TYPES.MONTHLY, tooltipLabel: 'ipsum' });
    const quarterly = getGraphLabels({ granularity: GRANULARITY_TYPES.QUARTERLY, tooltipLabel: 'ipsum' });
    expect({ daily, weekly, monthly, quarterly }).toMatchSnapshot('granularity based label');
  });

  it('should return a date type based on granularity', () => {
    const daily = getGranularityDateType(GRANULARITY_TYPES.DAILY);
    const weekly = getGranularityDateType(GRANULARITY_TYPES.WEEKLY);
    const monthly = getGranularityDateType(GRANULARITY_TYPES.MONTHLY);
    const quarterly = getGranularityDateType(GRANULARITY_TYPES.QUARTERLY);
    expect({ daily, weekly, monthly, quarterly }).toMatchSnapshot('granularity date type');
  });
});
