import React from 'react';
import {
  ToolbarFieldBillingAccount as ToolbarField,
  useToolbarFieldOptions,
  useOnSelect
} from '../toolbarFieldBillingAccount';
import { store } from '../../../redux/store';
import { RHSM_API_QUERY_SET_TYPES } from '../../../services/rhsm/rhsmConstants';

describe('ToolbarFieldBillingAccount Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {
      useProductQuery: () => ({ [RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID]: 'mock account id' })
    };

    const component = await shallowComponent(<ToolbarField {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should generate select options', async () => {
    const { result: toolbarFieldOptions } = await renderHook(() =>
      useToolbarFieldOptions({
        useProductQuery: () => ({ [RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER]: 'mock billing provider' }),
        useSelector: () => ({
          data: {
            accountsByProvider: {
              'mock billing provider': ['lorem', 'ipsum', 'dolor', 'sit']
            }
          }
        })
      })
    );

    expect(toolbarFieldOptions).toMatchSnapshot('toolbarFieldOptions');
  });

  it('should handle updating through redux state with component', () => {
    const props = {
      useToolbarFieldOptions: () => [
        {
          isSelected: true,
          title: 't(curiosity-toolbar.label_billing_account_id, {"context":"lorem"})',
          value: 'lorem'
        },
        {
          isSelected: false,
          title: 't(curiosity-toolbar.label_billing_account_id, {"context":"ipsum"})',
          value: 'ipsum'
        }
      ]
    };

    const component = renderComponent(<ToolbarField {...props} />);
    const input = component.find('button');
    component.fireEvent.click(input);

    const inputMenuItem = component.screen.getAllByRole('option').pop();
    component.fireEvent.click(inputMenuItem);

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, component');
  });

  it('should handle updating through redux state with hook', () => {
    const options = {
      useProduct: () => ({ productId: 'mock-product-id', viewId: 'mock-view-id' })
    };

    const onSelect = useOnSelect(options);
    onSelect({
      value: 'dolor sit'
    });

    onSelect({
      value: 'lorem ipsum'
    });

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, hook');
  });
});
