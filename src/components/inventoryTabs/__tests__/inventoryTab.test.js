import React from 'react';
import { mount, shallow } from 'enzyme';
import { InventoryTab } from '../inventoryTab';

describe('InventoryTab Component', () => {
  it('should output a non-connected component', () => {
    const props = {
      children: <div>lorem ipsum</div>,
      title: 'lorem ipsum'
    };

    const component = shallow(<InventoryTab {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should have accessible props', () => {
    const props = {
      children: <div>lorem ipsum</div>,
      title: 'lorem ipsum',
      active: true
    };

    const component = mount(<InventoryTab {...props} />);
    const componentProps = React.Children.map([component], child => child.props);
    expect(componentProps).toMatchSnapshot('component props');
  });
});
