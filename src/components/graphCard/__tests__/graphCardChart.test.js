import React from 'react';
import { GraphCardChart } from '../graphCardChart';

describe('GraphCardChart Component', () => {
  it('should render a basic component', async () => {
    const props = {};
    const component = await shallowComponent(<GraphCardChart {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should handle API response states', async () => {
    const props = {
      useGetMetrics: () => ({ pending: true, error: false, fulfilled: false, dataSets: [] })
    };

    const componentPending = await shallowComponent(<GraphCardChart {...props} />);
    expect(componentPending).toMatchSnapshot('pending');

    props.useGetMetrics = () => ({ pending: false, error: true, fulfilled: false, dataSets: [] });
    const componentError = await shallowComponent(<GraphCardChart {...props} />);
    expect(componentError).toMatchSnapshot('error');

    props.useGetMetrics = () => ({ pending: false, error: false, fulfilled: true, dataSets: [] });
    const componentFulfilled = await shallowComponent(<GraphCardChart {...props} />);
    expect(componentFulfilled).toMatchSnapshot('fulfilled');
  });
});
