import React from 'react';
import { InventoryTab } from '../inventoryTab';

describe('InventoryTab Component', () => {
  it('should output a basic component', async () => {
    const props = {
      children: <div>lorem ipsum</div>,
      title: 'lorem ipsum'
    };

    const component = await shallowComponent(<InventoryTab {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should have accessible props', () => {
    const props = {
      children: <div>lorem ipsum</div>,
      title: 'lorem ipsum',
      active: true
    };

    const component = renderComponent(<InventoryTab {...props} />);
    expect(component.props).toMatchSnapshot('component props');
  });
});
