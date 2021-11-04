import React from 'react';
import { GraphCard } from '../graphCard';
import { rhsmConstants } from '../../../services/rhsm/rhsmConstants';

describe('GraphCard Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useProductGraphConfig: () => ({
        filters: [
          {
            id: rhsmConstants.RHSM_API_PATH_METRIC_TYPES.CORE_SECONDS
          }
        ]
      })
    };
    const component = await shallowHookComponent(<GraphCard {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should setup basic settings', async () => {
    const props = {
      useProductGraphConfig: () => ({
        filters: [
          {
            id: rhsmConstants.RHSM_API_PATH_METRIC_TYPES.CORE_SECONDS
          },
          {
            id: rhsmConstants.RHSM_API_PATH_METRIC_TYPES.SOCKETS,
            isStandalone: true
          }
        ]
      })
    };
    const component = await shallowHookComponent(<GraphCard {...props} />);

    expect(component).toMatchSnapshot('settings');
  });

  it('should allow being disabled', async () => {
    const props = {
      isDisabled: true
    };
    const component = await shallowHookComponent(<GraphCard {...props} />);

    expect(component).toMatchSnapshot('disabled');
  });
});
