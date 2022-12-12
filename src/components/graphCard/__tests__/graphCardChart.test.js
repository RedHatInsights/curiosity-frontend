import React from 'react';
import { GraphCardChart } from '../graphCardChart';

describe('GraphCardChart Component', () => {
  it('should render a default component', async () => {
    const props = {};
    const component = await shallowHookComponent(<GraphCardChart {...props} />);

    expect(component).toMatchSnapshot('default');
  });

  it('should handle API response states', async () => {
    const props = {
      useGetMetrics: () => ({ pending: true, error: false, fulfilled: false, dataSets: [] })
    };

    const componentPending = await shallowHookComponent(<GraphCardChart {...props} />);
    expect(componentPending).toMatchSnapshot('pending');

    props.useGetMetrics = () => ({ pending: false, error: true, fulfilled: false, dataSets: [] });
    const componentError = await shallowHookComponent(<GraphCardChart {...props} />);
    expect(componentError).toMatchSnapshot('error');

    props.useGetMetrics = () => ({ pending: false, error: false, fulfilled: true, dataSets: [] });
    const componentFulfilled = await shallowHookComponent(<GraphCardChart {...props} />);
    expect(componentFulfilled).toMatchSnapshot('fulfilled');
  });
});
