import React from 'react';
import { shallow } from 'enzyme';
import { InventoryTabs, InventoryTab, useOnTab } from '../inventoryTabs';
import { store } from '../../../redux';

describe('InventoryTabs Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', () => {
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
    expect(component).toMatchSnapshot('basic');
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

  it('should handle updating through redux state with component', async () => {
    const props = {
      useProduct: () => ({ productId: 'lorem' })
    };

    const component = await mountHookComponent(
      <InventoryTabs {...props}>
        <InventoryTab title="loremIpsum">lorem ipsum</InventoryTab>
        <InventoryTab title="dolorSit">dolor sit</InventoryTab>
      </InventoryTabs>
    );
    component.find('button.pf-c-tabs__link').last().simulate('click');

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, component');
  });

  it('should handle updating through redux state with hook', () => {
    const options = {
      useProduct: () => ({ productId: 'lorem' })
    };

    const onTab = useOnTab(options);
    onTab({
      index: 1
    });

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, hook');
  });
});
