import React from 'react';
import { ProductView } from '../productView';
import * as routerContext from '../../router/routerContext';

describe('ProductView Component', () => {
  it('should render a basic component', async () => {
    const props = {};
    const mockContextValue = {
      pathParameter: 'lorem ipsum',
      productConfig: [{ lorem: 'ipsum' }],
      productParameter: 'lorem ipsum product label',
      viewParameter: 'dolor sit'
    };

    const mock = jest.spyOn(routerContext, 'useRouteDetail').mockImplementation(() => mockContextValue);

    const component = await shallowHookComponent(<ProductView {...props} />);
    expect(component).toMatchSnapshot('basic');
    mock.mockClear();
  });

  it('should render nothing if path and product parameters are empty', async () => {
    const props = {};
    const mockContextValue = {
      pathParameter: null,
      productConfig: null,
      viewParameter: null
    };

    const mock = jest.spyOn(routerContext, 'useRouteDetail').mockImplementation(() => mockContextValue);

    const component = await shallowHookComponent(<ProductView {...props} />);
    expect(component).toMatchSnapshot('empty');
    mock.mockClear();
  });

  it('should allow custom product views via props', async () => {
    const props = {
      toolbarGraphDescription: true
    };
    const mockContextValue = {
      pathParameter: 'lorem ipsum',
      productConfig: [{ lorem: 'ipsum' }],
      productParameter: 'lorem ipsum product label',
      viewParameter: 'dolor sit'
    };

    const mock = jest.spyOn(routerContext, 'useRouteDetail').mockImplementation(() => mockContextValue);

    const component = await shallowHookComponent(<ProductView {...props} />);
    expect(component).toMatchSnapshot('custom graphCard, descriptions');

    component.setProps({
      toolbarGraphDescription: false,
      toolbarGraph: <React.Fragment>lorem ipsum</React.Fragment>,
      toolbarProduct: false
    });

    expect(component).toMatchSnapshot('custom toolbar, toolbarGraph');

    component.setProps({
      toolbarGraphDescription: false,
      toolbarGraph: false,
      toolbarProduct: <React.Fragment>dolor sit</React.Fragment>
    });

    expect(component).toMatchSnapshot('custom toolbar, toolbarProduct');
    mock.mockClear();
  });

  it('should allow custom inventory displays via config', async () => {
    const props = {
      toolbarGraphDescription: true
    };
    const mockContextValue = {
      pathParameter: 'lorem ipsum',
      productParameter: 'lorem ipsum product label',
      viewParameter: 'dolor sit',
      productConfig: [{ lorem: 'ipsum', initialSubscriptionsInventoryFilters: [] }]
    };

    const mock = jest.spyOn(routerContext, 'useRouteDetail').mockImplementation(() => mockContextValue);

    const component = await shallowHookComponent(<ProductView {...props} />);
    expect(component).toMatchSnapshot('custom tabs, subscriptions table');
    mock.mockClear();
  });
});
