import React from 'react';
import { GraphCardMetrics } from '../graphCardMetrics';

describe('GraphCardMetrics Component', () => {
  it('should render a basic component', async () => {
    const props = {};
    const component = await shallowHookComponent(<GraphCardMetrics {...props} />);

    expect(component).toMatchSnapshot('basic');
  });
});
