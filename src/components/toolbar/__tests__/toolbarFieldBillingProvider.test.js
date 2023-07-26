import React from 'react';
import { ToolbarFieldBillingProvider, toolbarFieldOptions, useOnSelect } from '../toolbarFieldBillingProvider';
import { store } from '../../../redux/store';
import {
  RHSM_API_QUERY_BILLING_PROVIDER_TYPES as BILLING_PROVIDER_TYPES,
  RHSM_API_QUERY_SET_TYPES as RHSM_API_QUERY_TYPES
} from '../../../services/rhsm/rhsmConstants';

describe('ToolbarFieldBillingProvider Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {
      useProductQuery: () => ({ [RHSM_API_QUERY_TYPES.BILLING_PROVIDER]: BILLING_PROVIDER_TYPES.AWS })
    };
    const component = await shallowComponent(<ToolbarFieldBillingProvider {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should export select options', () => {
    expect(toolbarFieldOptions).toMatchSnapshot('toolbarFieldOptions');
  });

  it('should handle updating sla through redux state with component', () => {
    const props = {};

    const component = renderComponent(<ToolbarFieldBillingProvider {...props} />);

    const input = component.find('button');
    component.fireEvent.click(input);

    const inputMenuItem = component.find('button.pf-c-select__menu-item');
    component.fireEvent.click(inputMenuItem);

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, component');
  });

  it('should handle updating sla through redux state with hook', () => {
    const options = {
      useProduct: () => ({ viewId: 'loremIpsum' })
    };

    const onSelect = useOnSelect(options);

    onSelect({
      value: 'dolor sit'
    });
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, hook');
  });
});
