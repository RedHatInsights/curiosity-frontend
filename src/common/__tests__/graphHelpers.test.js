import {
  graphHelpers,
  convertGraphData,
  getGraphHeight,
  getTooltipDimensions,
  getTooltipFontSize
} from '../graphHelpers';
import { helpers } from '../helpers';

describe('GraphHelpers', () => {
  const { breakpoints } = helpers;
  const startDate = new Date('2019-06-01T00:00:00Z');
  const endDate = new Date('2019-06-05T00:00:00Z');
  const socketLabel = 'sockets on';
  const previousLabel = 'from previous day';

  it('should have specific functions', () => {
    expect(graphHelpers).toMatchSnapshot('graphHelpers');
  });

  it('should convert graph data and return zeroed usage array if usage is empty', () => {
    expect(convertGraphData({ usage: [], startDate, endDate, socketLabel, previousLabel })).toMatchSnapshot(
      'zeroed array'
    );
  });

  it('should convert graph data and generate tooltips when usage is populated', () => {
    expect(
      convertGraphData({
        usage: [
          { cores: 56, date: '2019-06-01T00:00:00Z', instance_count: 28 },
          { cores: 30, date: '2019-06-02T00:00:00Z', instance_count: 28 },
          { cores: 40, date: '2019-06-03T00:00:00Z', instance_count: 28 }
        ],
        startDate,
        endDate,
        socketLabel,
        previousLabel
      })
    ).toMatchSnapshot('usage populated');
  });

  it('should convert graph data and returned zeroed array when usage throws error', () => {
    expect(
      convertGraphData({
        usage: [null], // unexpected usage, will throw exception
        startDate,
        endDate,
        socketLabel,
        previousLabel
      })
    ).toMatchSnapshot('throws error');
  });

  it('should match graph heights at all breakpoints', () => {
    expect(getGraphHeight(breakpoints, 'xs')).toMatchSnapshot('xs graph height');
    expect(getGraphHeight(breakpoints, 'sm')).toMatchSnapshot('sm graph height');
    expect(getGraphHeight(breakpoints, 'md')).toMatchSnapshot('md graph height');
    expect(getGraphHeight(breakpoints, 'lg')).toMatchSnapshot('lg graph height');
    expect(getGraphHeight(breakpoints, 'xl')).toMatchSnapshot('xl graph height');
    expect(getGraphHeight(breakpoints, 'xl2')).toMatchSnapshot('xl2 graph height');
  });

  it('should match tooltip dimensions at all breakpoints', () => {
    expect(getTooltipDimensions(breakpoints, 'xs')).toMatchSnapshot('xs tooltip dimensions');
    expect(getTooltipDimensions(breakpoints, 'sm')).toMatchSnapshot('sm tooltip dimensions');
    expect(getTooltipDimensions(breakpoints, 'md')).toMatchSnapshot('md tooltip dimensions');
    expect(getTooltipDimensions(breakpoints, 'lg')).toMatchSnapshot('lg tooltip dimensions');
    expect(getTooltipDimensions(breakpoints, 'xl')).toMatchSnapshot('xl tooltip dimensions');
    expect(getTooltipDimensions(breakpoints, 'xl2')).toMatchSnapshot('xl2 tooltip dimensions');
  });

  it('should match tooltip font sizes at all breakpoints', () => {
    expect(getTooltipFontSize(breakpoints, 'xs')).toMatchSnapshot('xs tooltip font sizes');
    expect(getTooltipFontSize(breakpoints, 'sm')).toMatchSnapshot('sm tooltip font sizes');
    expect(getTooltipFontSize(breakpoints, 'md')).toMatchSnapshot('md tooltip font sizes');
    expect(getTooltipFontSize(breakpoints, 'lg')).toMatchSnapshot('lg tooltip font sizes');
    expect(getTooltipFontSize(breakpoints, 'xl')).toMatchSnapshot('xl tooltip font sizes');
    expect(getTooltipFontSize(breakpoints, 'xl2')).toMatchSnapshot('xl2 tooltip font sizes');
  });
});
