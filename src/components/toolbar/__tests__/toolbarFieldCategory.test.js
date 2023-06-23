import React from 'react';
import { ToolbarFieldCategory, useToolbarFieldOptions, useOnSelect } from '../toolbarFieldCategory';
import { store } from '../../../redux/store';
import {
  RHSM_API_QUERY_CATEGORY_TYPES as CATEGORY_TYPES,
  RHSM_API_QUERY_SET_TYPES
} from '../../../services/rhsm/rhsmConstants';

describe('ToolbarFieldCategory Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {
      useProductQuery: () => ({ [RHSM_API_QUERY_SET_TYPES.CATEGORY]: CATEGORY_TYPES.CLOUD })
    };

    const component = await shallowComponent(<ToolbarFieldCategory {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should generate select options', async () => {
    const { result: toolbarFieldOptions } = await renderHook(() =>
      useToolbarFieldOptions({
        useProductGraphConfig: () => ({
          filters: [
            { metric: 'lorem', query: {} },
            { filters: [{ metric: 'ipsum', query: { [RHSM_API_QUERY_SET_TYPES.CATEGORY]: CATEGORY_TYPES.CLOUD } }] },
            { metric: 'dolor', query: { [RHSM_API_QUERY_SET_TYPES.CATEGORY]: CATEGORY_TYPES.VIRTUAL } },
            { metric: 'sit', query: { [RHSM_API_QUERY_SET_TYPES.CATEGORY]: CATEGORY_TYPES.HYPERVISOR } }
          ]
        })
      })
    );

    expect(toolbarFieldOptions).toMatchSnapshot('toolbarFieldOptions');
  });

  it('should handle updating through redux state with component', () => {
    const props = {
      useToolbarFieldOptions: () => [
        {
          metaData: {
            metric: 'dolor',
            query: {
              category: 'virtual'
            }
          },
          selected: false,
          title: 't(curiosity-toolbar.label_category, {"context":"virtual"})',
          value: 'virtual'
        },
        {
          metaData: {
            metric: 'sit',
            query: {
              category: 'hypervisor'
            }
          },
          selected: false,
          title: 't(curiosity-toolbar.label_category, {"context":"hypervisor"})',
          value: 'hypervisor'
        }
      ]
    };

    const component = renderComponent(<ToolbarFieldCategory {...props} />);
    const input = component.find('button');
    component.fireEvent.click(input);

    const inputMenuItem = component.find('button.pf-c-select__menu-item');
    component.fireEvent.click(inputMenuItem);

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, component');
  });

  it('should handle updating through redux state with hook', () => {
    const options = {
      useProduct: () => ({ productId: 'mock-product-id', viewId: 'mock-view-id' })
    };

    const onSelect = useOnSelect(options);
    onSelect({
      value: 'dolor sit',
      selected: {
        metaData: {
          metric: 'hello',
          query: {
            category: 'world'
          }
        }
      }
    });

    onSelect({
      value: 'lorem ipsum',
      selected: {}
    });

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, hook');
  });
});
