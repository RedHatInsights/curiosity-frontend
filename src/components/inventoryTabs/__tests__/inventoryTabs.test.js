import React from 'react';
import { mount, shallow } from 'enzyme';
import { InventoryTabs, InventoryTab } from '../inventoryTabs';
import { store } from '../../../redux';

describe('InventoryTabs Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a non-connected component', () => {
    const GenericComponent = () => (
      <div>
        <strong>world</strong>
      </div>
    );

    const props = {
      productId: 'lorem',
      children: [
        <InventoryTab key="lorem" title="lorem">
          ipsum
        </InventoryTab>,
        <InventoryTab key="sit" title="sit">
          amet
        </InventoryTab>,
        <GenericComponent key="hello" />
      ]
    };

    const component = shallow(<InventoryTabs {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should return an empty render when disabled', () => {
    const props = {
      productId: 'lorem',
      children: [
        <InventoryTab key="lorem" title="lorem">
          ipsum
        </InventoryTab>,
        <InventoryTab key="sit" title="sit">
          amet
        </InventoryTab>
      ],
      isDisabled: true
    };
    const component = shallow(<InventoryTabs {...props} />);

    expect(component).toMatchSnapshot('disabled component');
  });

  it('should handle updating tabs for redux state', () => {
    const props = {
      productId: 'lorem',
      children: [
        <InventoryTab key="lorem" title="lorem">
          ipsum
        </InventoryTab>,
        <InventoryTab key="sit" title="sit">
          amet
        </InventoryTab>
      ]
    };
    const component = mount(<InventoryTabs {...props} />);
    const componentInstance = component.instance();

    componentInstance.onTab({ index: 1 });
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch filter');
  });
});
