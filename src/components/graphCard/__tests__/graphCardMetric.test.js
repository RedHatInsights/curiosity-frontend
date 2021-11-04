import React from 'react';
import { GraphCardMetric } from '../graphCardMetric';

describe('GraphCardMetric Component', () => {
  it('should render a basic component', async () => {
    const props = {};
    const component = await shallowHookComponent(<GraphCardMetric {...props} />);

    expect(component).toMatchSnapshot('basic');
  });
});
