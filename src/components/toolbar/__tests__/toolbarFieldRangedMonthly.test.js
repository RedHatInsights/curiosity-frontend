import React from 'react';
import { ToolbarFieldRangedMonthly, toolbarFieldOptions, useOnSelect } from '../toolbarFieldRangedMonthly';
import { store } from '../../../redux/store';
import { RHSM_API_QUERY_SET_TYPES } from '../../../services/rhsm/rhsmConstants';

describe('ToolbarFieldRangedMonthly Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {
      useProductGraphTallyQuery: () => ({
        [RHSM_API_QUERY_SET_TYPES.START_DATE]: 't(curiosity-toolbar.granularityRangedMonthly, {"context":"current"})'
      })
    };
    const component = await shallowComponent(<ToolbarFieldRangedMonthly {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should export select options', () => {
    expect(toolbarFieldOptions).toMatchSnapshot('toolbarFieldOptions');
  });

  it('should handle selecting an option directly', async () => {
    const props = {
      useProductGraphTallyQuery: () => ({ [RHSM_API_QUERY_SET_TYPES.START_DATE]: '2018-08-01T00:00:00.000Z' })
    };
    const component = await shallowComponent(<ToolbarFieldRangedMonthly {...props} />);

    expect(component).toMatchSnapshot('selected option');
  });

  it('should handle updating granularity and date through redux state with component', () => {
    const props = {};

    const component = renderComponent(<ToolbarFieldRangedMonthly {...props} />);

    const input = component.find('button');
    component.fireEvent.click(input);

    const inputMenuItem = component.find('button.pf-v5-c-select__menu-item');
    component.fireEvent.click(inputMenuItem);

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, component');
  });

  it('should handle updating granularity and date through redux state with hook', () => {
    const options = {
      useProduct: () => ({ viewId: 'loremIpsum' })
    };

    const onSelect = useOnSelect(options);

    onSelect({
      value: { startDate: new Date('2018-08-01T00:00:00.000Z'), endDate: new Date('2018-08-31T00:00:00.000Z') }
    });
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, hook');
  });
});
