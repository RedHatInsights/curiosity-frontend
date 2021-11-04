import React from 'react';
import { GraphCardChartTitleTooltip } from '../graphCardChartTitleTooltip';

describe('GraphCardChartTitleTooltip Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useGraphCardContext: () => ({ settings: { isCardTitleDescription: true, metric: { id: 'loremIpsum' } } })
    };
    const component = await shallowHookComponent(<GraphCardChartTitleTooltip {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should hide if there is no description', async () => {
    const props = {
      useGraphCardContext: () => ({ settings: { isCardTitleDescription: false } })
    };
    const component = await shallowHookComponent(<GraphCardChartTitleTooltip {...props} />);

    expect(component).toMatchSnapshot('hide');
  });
});
