import React from 'react';
import { ProductView } from '../productView';

describe('ProductView Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useRouteDetail: () => ({
        pathParameter: 'lorem ipsum',
        productConfig: [{ lorem: 'ipsum', productId: 'lorem', viewId: 'viewIpsum' }],
        productParameter: 'lorem ipsum product label',
        viewParameter: 'dolor sit'
      })
    };

    const component = await shallowHookComponent(<ProductView {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should render nothing if path and product parameters are empty', async () => {
    const props = {
      useRouteDetail: () => ({
        pathParameter: null,
        productConfig: [],
        viewParameter: null
      })
    };

    const component = await shallowHookComponent(<ProductView {...props} />);
    expect(component).toMatchSnapshot('empty');
  });

  it('should allow custom product views via props', async () => {
    const props = {
      toolbarGraphDescription: true,
      useRouteDetail: () => ({
        pathParameter: 'lorem ipsum',
        productConfig: [{ lorem: 'ipsum', productId: 'lorem', viewId: 'viewIpsum' }],
        productParameter: 'lorem ipsum product label',
        viewParameter: 'dolor sit'
      })
    };

    const component = await shallowHookComponent(<ProductView {...props} />);
    expect(component).toMatchSnapshot('custom graphCard, descriptions');

    component.setProps({
      toolbarGraphDescription: false,
      toolbarGraph: <React.Fragment>lorem ipsum</React.Fragment>
    });

    expect(component).toMatchSnapshot('custom toolbar, toolbarGraph');
  });

  it('should allow custom inventory displays via config', async () => {
    const props = {
      toolbarGraphDescription: true,
      useRouteDetail: () => ({
        pathParameter: 'lorem ipsum',
        productParameter: 'lorem ipsum product label',
        viewParameter: 'dolor sit',
        productConfig: [
          { lorem: 'ipsum', productId: 'lorem', viewId: 'viewIpsum', initialSubscriptionsInventoryFilters: [] }
        ]
      })
    };

    const component = await shallowHookComponent(<ProductView {...props} />);
    expect(component).toMatchSnapshot('custom tabs, subscriptions table');
  });
});
