import { graphHelpers, getGraphHeight, getTooltipDimensions, getTooltipFontSize } from '../graphHelpers';
import { helpers } from '../helpers';

const { breakpoints } = helpers;

describe('GraphHelpers', () => {
  it('should have specific functions', () => {
    expect(graphHelpers).toMatchSnapshot('helpers');
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
