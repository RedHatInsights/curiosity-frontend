import React, { useMemo } from 'react';
import { Toolbar } from '../toolbar';
import { useSeparateSlaTypeUsageFiltersEnabled, SEPARATE_SLA_TYPE_USAGE_FILTERS_FLAG } from '../toolbarContext';
import { toolbarFieldOptions } from '../toolbarFieldSelectCategory';
import { translate } from '../../i18n/i18n';
import {
  ProductViewContext,
  RESOLVED_SLA_USAGE_FILTERING_FLAG,
  useResolvedSlaUsageFilteringEnabled
} from '../../productView/productViewContext';
import { config as rhelConfig } from '../../../config/product.rhel';
import { config as openshiftConfig } from '../../../config/product.openshiftContainer';
import { store } from '../../../redux/store';
import { reduxTypes } from '../../../redux';
import {
  RHSM_API_QUERY_SET_TYPES as QUERY_TYPES,
  RHSM_API_QUERY_SLA_TYPES as SLA_TYPES,
  RHSM_API_QUERY_USAGE_TYPES as USAGE_TYPES,
  RHSM_API_QUERY_CATEGORY_TYPES as CATEGORY_TYPES
} from '../../../services/rhsm/rhsmConstants';

const FilterToolbar = ({ resolved = true, separate = true, productConfig = rhelConfig, ...props }) => {
  const useChrome = () => ({
    visibilityFunctions: {
      featureFlag: flag =>
        ({
          [RESOLVED_SLA_USAGE_FILTERING_FLAG]: resolved,
          [SEPARATE_SLA_TYPE_USAGE_FILTERS_FLAG]: separate
        })[flag]
    }
  });
  const defaultFilteringEnabled = useResolvedSlaUsageFilteringEnabled({ useChrome });
  const productContext = useMemo(
    () => ({ ...productConfig, defaultFilteringEnabled }),
    [productConfig, defaultFilteringEnabled]
  );
  const useSeparateFiltersEnabled = () => useSeparateSlaTypeUsageFiltersEnabled({ useChrome });

  return (
    <ProductViewContext.Provider value={productContext}>
      <Toolbar
        isDisabled={false}
        isGroupVariantDisabled
        useSeparateSlaTypeUsageFiltersEnabled={useSeparateFiltersEnabled}
        useToolbarFields={() => ({ itemFields: [], secondaryFields: [] })}
        {...props}
      />
    </ProductViewContext.Provider>
  );
};

describe('Separate SLA, Usage and Type toolbar filters', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each([
    [false, false],
    [false, true],
    [true, false],
    [true, true]
  ])('should use separate dropdowns only with both flags: resolved=%s, separate=%s', (resolved, separate) => {
    const component = renderComponent(<FilterToolbar resolved={resolved} separate={separate} />);
    const enabled = resolved && separate;

    expect(Boolean(component.find('.curiosity-toolbar__separate-filters'))).toBe(enabled);
    expect(Boolean(component.find('.curiosity-toolbar__reset-filters'))).toBe(enabled);
    expect(Boolean(component.find('[data-test="toolbarFieldSelectCategory"]'))).toBe(!enabled);
  });

  it('should place Reset filters on its own row below the separate dropdowns', () => {
    const component = renderComponent(<FilterToolbar />);
    const filterGroup = component.find('.curiosity-toolbar__separate-filters');
    const filterRow = filterGroup.closest('.pf-v6-c-toolbar__content');
    const resetButton = component.getByRole('button', { name: 't(curiosity-toolbar.clearFilters)' });
    const resetRow = resetButton.closest('.pf-v6-c-toolbar__content');

    expect(filterGroup.classList.contains('pf-m-nowrap')).toBe(true);
    expect(resetButton.closest('.curiosity-toolbar__separate-filters')).toBeNull();
    expect(filterRow.nextElementSibling).toBe(resetRow);
  });

  it('should order the dropdowns as SLA, Usage, Type and retain the default SLA and Usage', () => {
    const component = renderComponent(<FilterToolbar />);
    const filterGroup = component.find('.curiosity-toolbar__separate-filters');

    expect(
      Array.from(filterGroup.querySelectorAll('button[data-test]'), field => field.getAttribute('data-test'))
    ).toEqual(['toolbarFieldSla', 'toolbarFieldUsage', 'toolbarFieldCategory']);
    [QUERY_TYPES.SLA, QUERY_TYPES.USAGE, QUERY_TYPES.CATEGORY].forEach(filter => {
      const { title } = toolbarFieldOptions.find(({ value }) => value === filter);
      expect(component.getByText(`${title}:`)).toBeTruthy();
    });
    expect(component.find('[data-test="toolbarFieldSla"]').textContent).toContain(SLA_TYPES.PREMIUM);
    expect(component.find('[data-test="toolbarFieldUsage"]').textContent).toContain(USAGE_TYPES.PRODUCTION);
    expect(component.find('[data-test="toolbarFieldCategory"]').textContent).toBe(
      translate('curiosity-toolbar.placeholder', { context: ['filter', 'category'] })
    );
    expect(component.find('.pf-v6-c-label-group')).toBeNull();
  });

  it.each([
    ['toolbarFieldSla', QUERY_TYPES.SLA, SLA_TYPES.STANDARD, 3],
    ['toolbarFieldCategory', QUERY_TYPES.CATEGORY, CATEGORY_TYPES.PHYSICAL, 4],
    ['toolbarFieldUsage', QUERY_TYPES.USAGE, USAGE_TYPES.DEVELOPMENT, 3]
  ])('should list available options and update the query for %s', (field, filter, value, optionCount) => {
    const component = renderComponent(<FilterToolbar />);
    const dropdown = component.find(`[data-test="${field}"]`);
    component.fireEvent.click(dropdown);
    const options = component.screen.getAllByRole('option');

    expect(options).toHaveLength(optionCount);
    const option = options.find(item => item.textContent.includes(value));
    expect(option).toBeTruthy();
    component.fireEvent.click(option);

    expect(mockDispatch).toHaveBeenLastCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          type: reduxTypes.query.SET_QUERY_RESET_INVENTORY_LIST,
          viewId: rhelConfig.productId
        }),
        expect.objectContaining({ type: reduxTypes.query.SET_QUERY, filter, value, viewId: rhelConfig.productId })
      ])
    );
  });

  it('should show only SLA for a product that supports only SLA', () => {
    const component = renderComponent(<FilterToolbar productConfig={openshiftConfig} />);

    expect(component.find('[data-test="toolbarFieldSla"]').textContent).toContain(SLA_TYPES.PREMIUM);
    expect(component.find('[data-test="toolbarFieldUsage"]')).toBeNull();
    expect(component.find('[data-test="toolbarFieldCategory"]')).toBeNull();
    expect(component.find('[data-test="toolbarFieldSelectCategory"]')).toBeNull();
  });

  it('should allow resetting Type and restoring the default SLA and Usage', () => {
    const productConfig = {
      ...rhelConfig,
      query: {
        ...rhelConfig.query,
        [QUERY_TYPES.SLA]: SLA_TYPES.STANDARD,
        [QUERY_TYPES.USAGE]: USAGE_TYPES.DEVELOPMENT,
        [QUERY_TYPES.CATEGORY]: CATEGORY_TYPES.PHYSICAL
      }
    };
    const component = renderComponent(<FilterToolbar productConfig={productConfig} />);

    component.fireEvent.click(component.getByRole('button', { name: 't(curiosity-toolbar.clearFilters)' }));

    const queryActions = mockDispatch.mock.calls.flat(2).filter(({ type }) => type === reduxTypes.query.SET_QUERY);
    expect(queryActions.map(({ filter, value }) => ({ filter, value }))).toEqual([
      { filter: QUERY_TYPES.CATEGORY, value: null },
      { filter: QUERY_TYPES.SLA, value: null },
      { filter: QUERY_TYPES.USAGE, value: null }
    ]);
  });

  it.each([false, true])('should respect hardFilterReset=%s when resetting separate filters', hardFilterReset => {
    const clearAllFields = jest.fn();
    const component = renderComponent(
      <FilterToolbar hardFilterReset={hardFilterReset} useToolbarFieldClearAll={() => clearAllFields} />
    );

    component.fireEvent.click(component.getByRole('button', { name: 't(curiosity-toolbar.clearFilters)' }));

    expect(clearAllFields).toHaveBeenCalledTimes(1);
    expect(clearAllFields).toHaveBeenCalledWith(hardFilterReset);
  });

  it('should preserve selections when either feature flag changes after mounting', () => {
    const productConfig = {
      ...rhelConfig,
      query: {
        ...rhelConfig.query,
        [QUERY_TYPES.SLA]: SLA_TYPES.STANDARD,
        [QUERY_TYPES.USAGE]: USAGE_TYPES.DEVELOPMENT,
        [QUERY_TYPES.CATEGORY]: CATEGORY_TYPES.PHYSICAL
      }
    };
    const component = renderComponent(<FilterToolbar productConfig={productConfig} />);

    component.rerender(<FilterToolbar productConfig={productConfig} separate={false} />);
    expect(component.find('.curiosity-toolbar__separate-filters')).toBeNull();
    component.rerender(<FilterToolbar productConfig={productConfig} />);
    component.rerender(<FilterToolbar productConfig={productConfig} resolved={false} />);
    expect(component.find('.curiosity-toolbar__separate-filters')).toBeNull();
    component.rerender(<FilterToolbar productConfig={productConfig} />);

    expect(component.find('[data-test="toolbarFieldSla"]').textContent).toContain(SLA_TYPES.STANDARD);
    expect(component.find('[data-test="toolbarFieldUsage"]').textContent).toContain(USAGE_TYPES.DEVELOPMENT);
    expect(component.find('[data-test="toolbarFieldCategory"]').textContent).toContain(CATEGORY_TYPES.PHYSICAL);
    expect(mockDispatch.mock.calls.flat(2).some(({ type }) => type === reduxTypes.query.SET_QUERY)).toBe(false);
  });

  it.each([
    [QUERY_TYPES.SLA, 'First field', 'Second field'],
    ['second', 'Second field', 'First field']
  ])(
    'should retain other filter categories alongside separate filters: current=%s',
    (currentCategory, shown, hidden) => {
      const options = [
        toolbarFieldOptions.find(({ value }) => value === QUERY_TYPES.SLA),
        { title: 'First other filter', value: 'first', component: () => <span>First field</span> },
        { title: 'Second other filter', value: 'second', component: () => <span>Second field</span> }
      ];
      const component = renderComponent(
        <FilterToolbar useSelectCategoryOptions={() => ({ currentCategory, options })} />
      );

      component.fireEvent.click(component.find('[data-test="toolbarFieldSelectCategory"]'));
      expect(component.screen.getAllByRole('option').map(option => option.textContent)).toEqual([
        'First other filter',
        'Second other filter'
      ]);
      expect(component.find('[data-test="toolbarFieldSla"]')).toBeTruthy();
      expect(component.getByText(shown)).toBeTruthy();
      expect(component.queryByText(hidden)).toBeNull();
    }
  );

  it('should retain the combined layout without a separate Reset filters row when no split filters are supported', () => {
    const options = [{ title: 'Other filter', value: 'other', component: () => <span>Other field</span> }];
    const component = renderComponent(
      <FilterToolbar useSelectCategoryOptions={() => ({ currentCategory: 'other', options })} />
    );

    expect(component.getByText('Other field')).toBeTruthy();
    expect(component.find('.curiosity-toolbar__separate-filters')).toBeNull();
    expect(component.find('.curiosity-toolbar__reset-filters')).toBeNull();
    expect(component.find('[data-test="toolbarFieldSelectCategory"]')).toBeNull();
  });
});
