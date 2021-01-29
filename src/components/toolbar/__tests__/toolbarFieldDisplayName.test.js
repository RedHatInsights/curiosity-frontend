import React from 'react';
import { mount, shallow } from 'enzyme';
import { ToolbarFieldDisplayName } from '../toolbarFieldDisplayName';
import { store } from '../../../redux/store';
import { TextInput } from '../../form/textInput';
import { helpers } from '../../../common/helpers';

describe('ToolbarFieldDisplayName Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a non-connected component', () => {
    const props = {};
    const component = shallow(<ToolbarFieldDisplayName {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });

  it('should handle updating display name through redux state', () => {
    const props = {
      value: 'lorem ipsum'
    };

    const component = shallow(<ToolbarFieldDisplayName {...props} />);
    component.find(TextInput).simulate('change', { value: 'dolor sit' });
    component.find(TextInput).simulate('keyUp', {});

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch display name');
  });

  it('should handle updating display name using the enter key', () => {
    const props = {
      value: 'lorem ipsum'
    };

    const component = mount(<ToolbarFieldDisplayName {...props} />);
    const mockEvent = { keyCode: 13, currentTarget: { value: 'dolor sit' }, persist: helpers.noop };
    component.find(TextInput).instance().onKeyUp(mockEvent);

    expect(mockDispatch.mock.calls).toMatchSnapshot('enter display name');
  });

  it('should handle clearing display name through redux state', () => {
    const props = {
      value: 'lorem ipsum'
    };

    const component = mount(<ToolbarFieldDisplayName {...props} />);
    const mockEvent = { keyCode: 27, currentTarget: { value: '' }, persist: helpers.noop };
    component.find(TextInput).instance().onKeyUp(mockEvent);

    expect(mockDispatch.mock.calls).toMatchSnapshot('clear display name');
  });
});
