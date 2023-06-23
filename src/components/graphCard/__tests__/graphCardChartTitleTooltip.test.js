import React from 'react';
import { GraphCardChartTitleTooltip } from '../graphCardChartTitleTooltip';

describe('GraphCardChartTitleTooltip Component', () => {
  it('should render a basic component', () => {
    const props = {
      useGraphCardContext: () => ({
        settings: { isCardTitleDescription: true, loremIpsum: true, stringId: 'loremIpsum' }
      })
    };
    const component = renderComponent(<GraphCardChartTitleTooltip {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should hide if there is no description', () => {
    const props = {
      useGraphCardContext: () => ({ settings: { isCardTitleDescription: false } })
    };
    const component = renderComponent(<GraphCardChartTitleTooltip {...props} />);

    expect(component).toMatchSnapshot('hide');
  });
});
