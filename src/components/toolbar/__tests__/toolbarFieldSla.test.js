import React from 'react';
import { shallow } from 'enzyme';
import { ToolbarFieldSla, toolbarFieldOptions } from '../toolbarFieldSla';
import { store } from '../../../redux/store';
import { RHSM_API_QUERY_SLA_TYPES as SLA_TYPES, RHSM_API_QUERY_TYPES } from '../../../types/rhsmApiTypes';

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
      useProductQuery: () => ({ [RHSM_API_QUERY_TYPES.SLA]: SLA_TYPES.STANDARD })
    };
    const component = shallow(<ToolbarFieldSla {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should export select options', () => {
    expect(toolbarFieldOptions).toMatchSnapshot('toolbarFieldOptions');
  });

  it('should handle updating sla through redux state', async () => {
    const props = {
      useProduct: () => ({ viewId: 'loremIpsum' })
    };

    const component = await mountHookComponent(<ToolbarFieldSla {...props} />);

    component.find('button').simulate('click');
    component.update();
    component.find('button.pf-c-select__menu-item').first().simulate('click');

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch sla');
  });
});
