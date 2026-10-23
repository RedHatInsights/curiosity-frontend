import React from 'react';
import { ProductView } from '../productView';
import {
  useProductQuery,
  useProductGraphTallyQuery,
  useProductInventoryGuestsQuery,
  useProductInventoryHostsQuery,
  useProductInventorySubscriptionsQuery,
  useProductExportQuery,
  useResolvedSlaUsageFilteringEnabled
} from '../productViewContext';
import { Toolbar } from '../../toolbar/toolbar';
import { ToolbarFieldSla } from '../../toolbar/toolbarFieldSla';
import { ToolbarFieldUsage } from '../../toolbar/toolbarFieldUsage';
import {
  RHSM_API_QUERY_SET_TYPES as QUERY_TYPES,
  RHSM_API_QUERY_SLA_TYPES as SLA_TYPES,
  RHSM_API_QUERY_USAGE_TYPES as USAGE_TYPES
} from '../../../services/rhsm/rhsmConstants';

jest.mock('../../toolbar/toolbar', () => ({ Toolbar: jest.fn() }));
jest.mock('../../graphCard/graphCard', () => ({ GraphCard: () => null }));
jest.mock('../../bannerMessages/bannerMessages', () => () => null);
jest.mock('../../inventoryTabs/inventoryTabs', () => ({ __esModule: true, default: () => null }));
jest.mock('../productViewOnload', () => ({ ProductViewOnload: ({ children }) => children }));

const FilteringProbe = () => {
  const queries = [
    useProductQuery(),
    useProductGraphTallyQuery(),
    useProductInventoryGuestsQuery(),
    useProductInventoryHostsQuery(),
    useProductInventorySubscriptionsQuery(),
    useProductExportQuery()
  ];

  return (
    <React.Fragment>
      <output data-test="queries">{JSON.stringify(queries)}</output>
      <ToolbarFieldSla
        useOnSelect={() => jest.fn()}
        options={[
          { title: 'No SLA', value: SLA_TYPES.NONE },
          { title: 'Premium', value: SLA_TYPES.PREMIUM }
        ]}
      />
      <ToolbarFieldUsage
        useOnSelect={() => jest.fn()}
        options={[
          { title: 'Unspecified Usage', value: USAGE_TYPES.UNSPECIFIED },
          { title: 'Production', value: USAGE_TYPES.PRODUCTION }
        ]}
      />
    </React.Fragment>
  );
};

describe('Product view default filtering', () => {
  it('should update queries and dropdown options together when the flag changes after mounting', () => {
    Toolbar.mockImplementation(() => <FilteringProbe />);
    const featureFlag = jest.fn(() => false);
    const route = {
      firstMatch: {
        productId: 'rhel',
        viewId: 'viewRhel',
        initialToolbarFilters: [{ id: QUERY_TYPES.SLA }, { id: QUERY_TYPES.USAGE }],
        query: { [QUERY_TYPES.SLA]: null, [QUERY_TYPES.USAGE]: null }
      },
      productGroup: 'rhel'
    };
    const props = {
      useRouteDetail: () => route,
      useResolvedSlaUsageFilteringEnabled: () =>
        useResolvedSlaUsageFilteringEnabled({
          useChrome: () => ({ visibilityFunctions: { featureFlag } })
        })
    };
    const component = renderComponent(<ProductView {...props} />);

    const expectFiltering = enabled => {
      const queries = JSON.parse(component.find('[data-test="queries"]').textContent);
      expect(queries).toHaveLength(6);
      queries.forEach(query => {
        expect(query).toMatchObject({
          [QUERY_TYPES.SLA]: enabled ? SLA_TYPES.PREMIUM : null,
          [QUERY_TYPES.USAGE]: enabled ? USAGE_TYPES.PRODUCTION : null
        });
      });

      [
        ['toolbarFieldSla', 'No SLA'],
        ['toolbarFieldUsage', 'Unspecified Usage']
      ].forEach(([field, blankOption]) => {
        const button = component.find(`[data-test="${field}"]`);
        component.fireEvent.click(button);
        expect(component.screen.queryAllByRole('option', { name: blankOption })).toHaveLength(enabled ? 0 : 1);
        component.fireEvent.click(button);
      });
    };

    expectFiltering(false);

    featureFlag.mockReturnValue(true);
    component.rerender(<ProductView {...props} />);
    expectFiltering(true);

    featureFlag.mockReturnValue(false);
    component.rerender(<ProductView {...props} />);
    expectFiltering(false);
    expect(featureFlag).toHaveBeenCalledTimes(3);
  });
});
