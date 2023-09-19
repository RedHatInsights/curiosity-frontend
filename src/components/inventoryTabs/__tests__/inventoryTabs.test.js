import React from 'react';
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

  it('should render a basic component', async () => {
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

    const component = await shallowComponent(<InventoryTabs {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should return an empty render when disabled', async () => {
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
    const component = await shallowComponent(<InventoryTabs {...props} />);

    expect(component).toMatchSnapshot('disabled component');
  });

  it('should handle updating through redux state with component', () => {
    const props = {
      useProduct: () => ({ productId: 'lorem' })
    };

    const component = renderComponent(
      <InventoryTabs {...props}>
        <InventoryTab title="loremIpsum">lorem ipsum</InventoryTab>
        <InventoryTab title="dolorSit">dolor sit</InventoryTab>
      </InventoryTabs>
    );
    const input = component.querySelectorAll('button.pf-v5-c-tabs__link')[1];
    component.fireEvent.click(input);

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
