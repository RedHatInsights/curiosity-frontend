import React from 'react';
import { GraphCardChartTitleTooltip } from '../graphCardChartTitleTooltip';

describe('GraphCardChartTitleTooltip Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useGraphCardContext: () => ({
        settings: { isCardTitleDescription: true, loremIpsum: true, stringId: 'loremIpsum' }
      })
    };
    const component = await shallowComponent(<GraphCardChartTitleTooltip {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should hide if there is no description', async () => {
    const props = {
      useGraphCardContext: () => ({ settings: { isCardTitleDescription: false } })
    };
    const component = await shallowComponent(<GraphCardChartTitleTooltip {...props} />);

    expect(component).toMatchSnapshot('hide');
  });
});
