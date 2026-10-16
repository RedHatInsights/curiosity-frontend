import React from 'react';
import { ToolbarFieldSla, toolbarFieldOptions, useOnSelect } from '../toolbarFieldSla';
import { useProductQuery } from '../../productView/productViewContext';
import { store } from '../../../redux/store';
import { RHSM_API_QUERY_SLA_TYPES as SLA_TYPES, RHSM_API_QUERY_SET_TYPES } from '../../../services/rhsm/rhsmConstants';

describe('ToolbarFieldSla Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {
      useProductQuery: () => ({ [RHSM_API_QUERY_SET_TYPES.SLA]: SLA_TYPES.STANDARD }),
      useResolvedSlaUsageFilteringEnabled: () => true
    };
    const component = await shallowComponent(<ToolbarFieldSla {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should hide blank and unspecified SLA options', async () => {
    const options = [
      ...toolbarFieldOptions,
      { title: 'Whitespace', value: '  ', isSelected: false },
      { title: 'Missing', value: null, isSelected: false }
    ];
    const component = await shallowComponent(
      <ToolbarFieldSla
        options={options}
        useOnSelect={() => jest.fn()}
        useResolvedSlaUsageFilteringEnabled={() => true}
        useProductQuery={() => ({ [RHSM_API_QUERY_SET_TYPES.SLA]: SLA_TYPES.PREMIUM })}
      />
    );

    expect(component.props.options.map(({ value }) => value)).toEqual([
      SLA_TYPES.PREMIUM,
      SLA_TYPES.STANDARD,
      SLA_TYPES.SELF
    ]);
  });

  it('should default Premium and hide No SLA when only SLA is supported', async () => {
    const slaOnlyProductContext = {
      initialToolbarFilters: [{ id: RHSM_API_QUERY_SET_TYPES.SLA }]
    };
    const { result: productQuery } = await renderHook(() =>
      useProductQuery({
        useProductViewContext: () => slaOnlyProductContext,
        useProductQueryFactory: () => ({}),
        useResolvedSlaUsageFilteringEnabled: () => true
      })
    );
    const component = await shallowComponent(
      <ToolbarFieldSla
        useProductQuery={() => productQuery}
        useOnSelect={() => jest.fn()}
        useResolvedSlaUsageFilteringEnabled={() => true}
      />
    );

    expect(slaOnlyProductContext.initialToolbarFilters.map(({ id }) => id)).toContain(RHSM_API_QUERY_SET_TYPES.SLA);
    expect(slaOnlyProductContext.initialToolbarFilters.map(({ id }) => id)).not.toContain(
      RHSM_API_QUERY_SET_TYPES.USAGE
    );
    expect(component.props.selectedOptions).toBe(SLA_TYPES.PREMIUM);
    expect(component.props.options.map(({ value }) => value)).toEqual([
      SLA_TYPES.PREMIUM,
      SLA_TYPES.STANDARD,
      SLA_TYPES.SELF
    ]);
  });

  it('should retain the No SLA option while the feature flag is disabled by default', async () => {
    const component = await shallowComponent(
      <ToolbarFieldSla
        useOnSelect={() => jest.fn()}
        useProductQuery={() => ({ [RHSM_API_QUERY_SET_TYPES.SLA]: SLA_TYPES.PREMIUM })}
      />
    );

    expect(component.props.options.map(({ value }) => value)).toContain(SLA_TYPES.NONE);
  });

  it('should export select options', () => {
    expect(toolbarFieldOptions).toMatchSnapshot('toolbarFieldOptions');
  });

  it('should handle updating sla through redux state with component', () => {
    const props = { useResolvedSlaUsageFilteringEnabled: () => true };

    const component = renderComponent(<ToolbarFieldSla {...props} />);
    const input = component.find('button');
    component.fireEvent.click(input);

    const inputMenuItem = component.screen.getAllByRole('option').pop();
    component.fireEvent.click(inputMenuItem);

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, component');
  });

  it('should handle updating sla through redux state with hook', () => {
    const options = {
      useProduct: () => ({ productId: 'loremIpsum' })
    };

    const onSelect = useOnSelect(options);

    onSelect({
      value: 'dolor sit'
    });
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, hook');
  });

  it('should clear the SLA filter to its default', () => {
    const onSelect = useOnSelect({
      useDispatch: () => mockDispatch,
      useProduct: () => ({ productId: 'loremIpsum' })
    });

    onSelect();

    expect(mockDispatch.mock.calls[0][0][1]).toMatchObject({
      filter: RHSM_API_QUERY_SET_TYPES.SLA,
      value: null
    });
  });
});
