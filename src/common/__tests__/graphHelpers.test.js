import {
  graphHelpers,
  convertGraphUsageData,
  getGraphHeight,
  getTooltipDimensions,
  getTooltipFontSize
} from '../graphHelpers';
import { helpers } from '../helpers';
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

  it('should match graph heights at all breakpoints', () => {
    const { breakpoints } = helpers;

    expect(getGraphHeight(breakpoints, 'xs')).toMatchSnapshot('xs graph height');
    expect(getGraphHeight(breakpoints, 'sm')).toMatchSnapshot('sm graph height');
    expect(getGraphHeight(breakpoints, 'md')).toMatchSnapshot('md graph height');
    expect(getGraphHeight(breakpoints, 'lg')).toMatchSnapshot('lg graph height');
    expect(getGraphHeight(breakpoints, 'xl')).toMatchSnapshot('xl graph height');
    expect(getGraphHeight(breakpoints, 'xl2')).toMatchSnapshot('xl2 graph height');
  });

  it('should match tooltip dimensions at all breakpoints', () => {
    const { breakpoints } = helpers;

    expect(getTooltipDimensions(breakpoints, 'xs')).toMatchSnapshot('xs tooltip dimensions');
    expect(getTooltipDimensions(breakpoints, 'sm')).toMatchSnapshot('sm tooltip dimensions');
    expect(getTooltipDimensions(breakpoints, 'md')).toMatchSnapshot('md tooltip dimensions');
    expect(getTooltipDimensions(breakpoints, 'lg')).toMatchSnapshot('lg tooltip dimensions');
    expect(getTooltipDimensions(breakpoints, 'xl')).toMatchSnapshot('xl tooltip dimensions');
    expect(getTooltipDimensions(breakpoints, 'xl2')).toMatchSnapshot('xl2 tooltip dimensions');
  });

  it('should match tooltip font sizes at all breakpoints', () => {
    const { breakpoints } = helpers;

    expect(getTooltipFontSize(breakpoints, 'xs')).toMatchSnapshot('xs tooltip font sizes');
    expect(getTooltipFontSize(breakpoints, 'sm')).toMatchSnapshot('sm tooltip font sizes');
    expect(getTooltipFontSize(breakpoints, 'md')).toMatchSnapshot('md tooltip font sizes');
    expect(getTooltipFontSize(breakpoints, 'lg')).toMatchSnapshot('lg tooltip font sizes');
    expect(getTooltipFontSize(breakpoints, 'xl')).toMatchSnapshot('xl tooltip font sizes');
    expect(getTooltipFontSize(breakpoints, 'xl2')).toMatchSnapshot('xl2 tooltip font sizes');
  });
});
