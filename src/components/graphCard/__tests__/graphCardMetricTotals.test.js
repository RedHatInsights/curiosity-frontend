import React from 'react';
import { GraphCardMetricTotals } from '../graphCardMetricTotals';

describe('GraphCardMetricTotals Component', () => {
  it('should render a basic component', async () => {
    const props = {};
    const component = await shallowHookComponent(<GraphCardMetricTotals {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should handle multiple display states', async () => {
    const props = {
      useMetricsSelector: () => ({
        pending: true,
        error: false,
        fulfilled: false
      })
    };
    const component = await shallowHookComponent(<GraphCardMetricTotals {...props} />);

    expect(component).toMatchSnapshot('pending');

    component.setProps({
      useMetricsSelector: () => ({
        pending: false,
        error: true,
        fulfilled: false
      })
    });

    expect(component).toMatchSnapshot('error');

    component.setProps({
      useMetricsSelector: () => ({
        pending: false,
        error: false,
        fulfilled: true
      })
    });

    expect(component).toMatchSnapshot('fulfilled');
  });
});
