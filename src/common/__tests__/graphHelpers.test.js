import { graphHelpers, convertGraphUsageData, getChartDomain, getTickValues } from '../graphHelpers';
import { rhelApiTypes } from '../../types/rhelApiTypes';

describe('GraphHelpers', () => {
  it('should have specific functions', () => {
    expect(graphHelpers).toMatchSnapshot('graphHelpers');
  });

  it('should convert graph data and return zeroed usage array if error', () => {
    const props = {
      startDate: new Date('2019-06-01T00:00:00Z'),
      endDate: new Date('2019-06-05T23:59:59Z'),
      error: true
    };

    expect(convertGraphUsageData(props)).toMatchSnapshot('error is true');
  });

  it('should convert graph data and return zeroed usage array if usage is empty', () => {
    const props = {
      startDate: new Date('2019-06-01T00:00:00Z'),
      endDate: new Date('2019-06-05T23:59:59Z'),
      label: 'sockets on',
      previousLabel: 'from previous day',
      data: []
    };

    expect(convertGraphUsageData(props)).toMatchSnapshot('zeroed array');
  });

  it('should convert graph data and generate tooltips when usage is populated', () => {
    const props = {
      startDate: new Date('2019-06-01T00:00:00Z'),
      endDate: new Date('2019-06-05T23:59:59Z'),
      label: 'sockets on',
      previousLabel: 'from previous day',
      data: [
        {
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 56,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2019-06-01T00:00:00Z',
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 28,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 5
        },
        {
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 30,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2019-06-02T00:00:00Z',
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 28,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 7
        },
        {
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 40,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2019-06-03T00:00:00Z',
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 28,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 3
        },
        {
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 0,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2019-06-04T00:00:00Z',
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 0,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 0
        },
        {
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 0,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2019-06-05T00:00:00Z',
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 0,
          [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 0
        }
      ]
    };

    expect(convertGraphUsageData(props)).toMatchSnapshot('usage populated');
  });

  it('should convert graph data and returned zeroed array when usage throws error', () => {
    const props = {
      startDate: new Date('2019-06-01T00:00:00Z'),
      endDate: new Date('2019-06-05T23:59:59Z'),
      label: 'sockets on',
      previousLabel: 'from previous day',
      data: [null]
    };

    expect(
      convertGraphUsageData({
        ...props
      })
    ).toMatchSnapshot('throws error');
  });

  it('getChartDomain should return expected y domain for given inputs', () => {
    expect({
      'empty array': getChartDomain({ empty: true }).y,
      'maxY = 0': getChartDomain({ maxY: 0 }).y,
      'maxY = 9': getChartDomain({ maxY: 9 }).y,
      'maxY = 49': getChartDomain({ maxY: 49 }).y,
      'maxY = 50': getChartDomain({ maxY: 50 }).y,
      'maxY = 100': getChartDomain({ maxY: 100 }).y,
      'maxY = 1000': getChartDomain({ maxY: 1000 }).y
    }).toMatchSnapshot();
  });

  it('should get tick values array given chart data', () => {
    expect({
      'empty array': getTickValues({ chartData: [], xAxisTickInterval: 2 }),
      'x axis interval': getTickValues({
        chartData: [{ x: 'Jan 1' }, { x: 'Jan 2' }, { x: 'Jan 3' }, { x: 'Jan 4' }, { x: 'Jan 5' }, { x: 'Jan 6' }],
        xAxisTickInterval: 2
      })
    }).toMatchSnapshot();
  });
});
