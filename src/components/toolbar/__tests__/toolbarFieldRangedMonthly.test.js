import React from 'react';
import { mount, shallow } from 'enzyme';
import { ToolbarFieldRangedMonthly, toolbarFieldOptions } from '../toolbarFieldRangedMonthly';
import { store } from '../../../redux/store';

describe('ToolbarFieldGranularity Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a non-connected component', () => {
    const props = {};
    const component = shallow(<ToolbarFieldRangedMonthly {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });

  it('should export select options', () => {
    expect(toolbarFieldOptions).toMatchSnapshot('toolbarFieldOptions');
  });

  it('should handle selecting an option directly', () => {
    const props = {
      value: '2018-08-01T00:00:00.000Z'
    };
    const component = shallow(<ToolbarFieldRangedMonthly {...props} />);

    expect(component).toMatchSnapshot('selected option');
  });

  it('should handle updating granularity through redux state', () => {
    const props = {};

    const component = mount(<ToolbarFieldRangedMonthly {...props} />);

    component.find('button').simulate('click');
    component.update();
    component.find('button.pf-c-select__menu-item').first().simulate('click');

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch date range');
  });
});
