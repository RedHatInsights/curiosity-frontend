import React from 'react';
import { ToolbarFieldExport, toolbarFieldOptions, useOnSelect } from '../toolbarFieldExport';
import { useProductExportQuery } from '../../productView/productViewContext';
import {
  RHSM_API_QUERY_SET_TYPES as QUERY_TYPES,
  RHSM_API_QUERY_SLA_TYPES as SLA_TYPES,
  RHSM_API_QUERY_USAGE_TYPES as USAGE_TYPES
} from '../../../services/rhsm/rhsmConstants';
import { config as rhelConfig } from '../../../config/product.rhel';

describe('ToolbarFieldExport Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useExistingExports: () => jest.fn()
    };
    const component = await shallowComponent(<ToolbarFieldExport {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should export select options', () => {
    expect(toolbarFieldOptions).toMatchSnapshot('toolbarFieldOptions');
  });

  it('should handle updating export through redux action with component', () => {
    const mockOnSelect = jest.fn();
    const props = {
      useOnSelect: () => mockOnSelect,
      useExistingExports: () => jest.fn()
    };

    const component = renderComponent(<ToolbarFieldExport {...props} />);
    const input = component.find('button');
    component.fireEvent.click(input);

    const inputMenuItem = component.screen.getAllByRole('menuitem').pop();
    component.fireEvent.click(inputMenuItem);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it('should handle updating export through redux action with hook', () => {
    const mockExport = jest.fn();
    const options = {
      useExport: () => mockExport,
      useProduct: () => ({ viewId: 'loremIpsum' }),
      useProductExportQuery: () => ({})
    };

    const onSelect = useOnSelect(options);

    onSelect({
      value: 'dolor sit'
    });
    expect(mockExport.mock.calls).toMatchSnapshot('dispatch, hook');
  });

  it('should include resolved SLA and Usage values in export requests', () => {
    const mockExport = jest.fn();
    const useResolvedExportQuery = () =>
      useProductExportQuery({
        useProduct: () => ({ productId: 'rhel' }),
        useProductViewContext: () => rhelConfig,
        useResolvedSlaUsageFilteringEnabled: () => true,
        useProductToolbarQuery: () => ({
          [QUERY_TYPES.SLA]: null,
          [QUERY_TYPES.USAGE]: ''
        })
      });
    const onSelect = useOnSelect({
      useExport: () => mockExport,
      useProduct: () => ({ productId: 'rhel' }),
      useProductExportQuery: useResolvedExportQuery
    });

    onSelect({ value: 'csv' });

    const [, exportRequest] = mockExport.mock.calls[0];
    expect(exportRequest.sources.map(({ filters }) => filters)).toEqual([
      {
        product_id: 'rhel',
        [QUERY_TYPES.SLA]: SLA_TYPES.PREMIUM,
        [QUERY_TYPES.USAGE]: USAGE_TYPES.PRODUCTION
      },
      {
        product_id: 'rhel',
        [QUERY_TYPES.SLA]: SLA_TYPES.PREMIUM,
        [QUERY_TYPES.USAGE]: USAGE_TYPES.PRODUCTION
      }
    ]);
  });
});
