import React from 'react';
import { shallow } from 'enzyme';
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

  it('should render a basic component', () => {
    const props = {
      useProductGraphTallyQuery: () => ({
        [RHSM_API_QUERY_SET_TYPES.START_DATE]: 't(curiosity-toolbar.granularityRangedMonthly, {"context":"current"})'
      })
    };
    const component = shallow(<ToolbarFieldRangedMonthly {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should export select options', () => {
    expect(toolbarFieldOptions).toMatchSnapshot('toolbarFieldOptions');
  });

  it('should handle selecting an option directly', () => {
    const props = {
      useProductGraphTallyQuery: () => ({ [RHSM_API_QUERY_SET_TYPES.START_DATE]: '2018-08-01T00:00:00.000Z' })
    };
    const component = shallow(<ToolbarFieldRangedMonthly {...props} />);

    expect(component).toMatchSnapshot('selected option');
  });

  it('should handle updating granularity and date through redux state with component', async () => {
    const props = {};

    const component = await mountHookComponent(<ToolbarFieldRangedMonthly {...props} />);

    component.find('button').simulate('click');
    component.update();
    component.find('button.pf-c-select__menu-item').first().simulate('click');

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch date range, component');
  });

  it('should handle updating granularity and date through redux state with hook', () => {
    const options = {
      useProduct: () => ({ viewId: 'loremIpsum' })
    };

    const onSelect = useOnSelect(options);

    onSelect({
      value: { startDate: new Date('2018-08-01T00:00:00.000Z'), endDate: new Date('2018-08-31T00:00:00.000Z') }
    });
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch date range, hook');
  });
});
