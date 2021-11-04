import React from 'react';
import { GraphCardChart } from '../graphCardChart';

describe('GraphCardChart Component', () => {
  it('should render a basic component', async () => {
    const props = {};
    const component = await shallowHookComponent(<GraphCardChart {...props} />);

    expect(component).toMatchSnapshot('basic');
  });
});
