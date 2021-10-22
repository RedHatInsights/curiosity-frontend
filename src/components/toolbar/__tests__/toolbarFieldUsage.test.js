import React from 'react';
import { shallow } from 'enzyme';
import { ToolbarFieldUsage, toolbarFieldOptions } from '../toolbarFieldUsage';
import { store } from '../../../redux/store';
import { RHSM_API_QUERY_USAGE_TYPES as USAGE_TYPES, RHSM_API_QUERY_TYPES } from '../../../types/rhsmApiTypes';

describe('ToolbarFieldSla Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', () => {
    const props = {
      useProduct: () => ({ viewId: 'loremIpsum' }),
      useProductQuery: () => ({ [RHSM_API_QUERY_TYPES.USAGE]: USAGE_TYPES.DEVELOPMENT })
    };
    const component = shallow(<ToolbarFieldUsage {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should export select options', () => {
    expect(toolbarFieldOptions).toMatchSnapshot('toolbarFieldOptions');
  });

  it('should handle updating usage through redux state', async () => {
    const props = {
      useProduct: () => ({ viewId: 'loremIpsum' })
    };

    const component = await mountHookComponent(<ToolbarFieldUsage {...props} />);

    component.find('button').simulate('click');
    component.update();
    component.find('button.pf-c-select__menu-item').first().simulate('click');

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch usage');
  });
});
