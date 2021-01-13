import React from 'react';
import { mount, shallow } from 'enzyme';
import { ToolbarFieldGranularity, toolbarFieldOptions } from '../toolbarFieldGranularity';
import { store } from '../../../redux/store';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../../../types/rhsmApiTypes';

describe('ToolbarFieldGranularity Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a non-connected component', () => {
    const props = {
      value: GRANULARITY_TYPES.WEEKLY
    };
    const component = shallow(<ToolbarFieldGranularity {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });

  it('should export select options', () => {
    expect(toolbarFieldOptions).toMatchSnapshot('toolbarFieldOptions');
  });

  it('should handle updating granularity through redux state', () => {
    const props = {};

    const component = mount(<ToolbarFieldGranularity {...props} />);

    component.find('button').simulate('click');
    component.update();
    component.find('button.pf-c-select__menu-item').first().simulate('click');

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch granularity');
  });
});
