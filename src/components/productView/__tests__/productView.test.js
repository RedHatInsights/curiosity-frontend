import React from 'react';
import { ProductView } from '../productView';
import { RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES as DISPLAY_TYPES } from '../../../services/rhsm/rhsmConstants';

describe('ProductView Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useRouteDetail: () => ({
        productGroup: 'lorem ipsum',
        productConfig: [{ lorem: 'ipsum', productId: 'lorem', viewId: 'viewIpsum' }]
      })
    };

    const component = await shallowHookComponent(<ProductView {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should render nothing if productGroup, and product parameters are empty', async () => {
    const props = {
      useRouteDetail: () => ({
        productGroup: null,
        productConfig: []
      })
    };

    const componentProductGroup = await shallowHookComponent(<ProductView {...props} />);
    expect(componentProductGroup).toMatchSnapshot('empty, productGroup');

    props.useRouteDetail = () => ({
      productGroup: 'lorem ipsum',
      productId: null,
      viewId: null
    });

    const componentProductId = await shallowHookComponent(<ProductView {...props} />);
    expect(componentProductId).toMatchSnapshot('empty, productId and viewId');
  });

  it('should allow custom product views via productDisplay types', async () => {
    const props = {
      useRouteDetail: () => ({
        productGroup: 'lorem ipsum',
        productConfig: [
          { lorem: 'ipsum', productId: 'lorem', viewId: 'viewIpsum', productDisplay: DISPLAY_TYPES.HOURLY }
        ]
      })
    };

    const componentTypeOne = await shallowHookComponent(<ProductView {...props} />);
    expect(componentTypeOne).toMatchSnapshot('custom view, hourly');

    props.useRouteDetail = () => ({
      productGroup: 'lorem ipsum',
      productConfig: [
        { lorem: 'ipsum', productId: 'lorem', viewId: 'viewIpsum', productDisplay: DISPLAY_TYPES.CAPACITY }
      ]
    });
    const componentTypeTwo = await shallowHookComponent(<ProductView {...props} />);
    expect(componentTypeTwo).toMatchSnapshot('custom view, capacity');

    props.useRouteDetail = () => ({
      productGroup: 'lorem ipsum',
      productConfig: [
        { lorem: 'ipsum', productId: 'lorem', viewId: 'viewIpsum', productDisplay: DISPLAY_TYPES.DUAL_AXES }
      ]
    });
    const componentTypeThree = await shallowHookComponent(<ProductView {...props} />);
    expect(componentTypeThree).toMatchSnapshot('custom view, dual axes');

    props.useRouteDetail = () => ({
      productGroup: 'lorem ipsum',
      productConfig: [{ lorem: 'ipsum', productId: 'lorem', viewId: 'viewIpsum', productDisplay: DISPLAY_TYPES.LEGACY }]
    });
    const componentTypeFour = await shallowHookComponent(<ProductView {...props} />);
    expect(componentTypeFour).toMatchSnapshot('custom view, legacy');

    props.useRouteDetail = () => ({
      productGroup: 'lorem ipsum',
      productConfig: [
        { lorem: 'ipsum', productId: 'lorem', viewId: 'viewIpsum', productDisplay: DISPLAY_TYPES.PARTIAL }
      ]
    });
    const componentTypeFive = await shallowHookComponent(<ProductView {...props} />);
    expect(componentTypeFive).toMatchSnapshot('custom view, partial');
  });

  it('should allow custom inventory displays via config', async () => {
    const props = {
      toolbarGraphDescription: true,
      useRouteDetail: () => ({
        productGroup: 'lorem ipsum',
        productConfig: [
          { lorem: 'ipsum', productId: 'lorem', viewId: 'viewIpsum', initialSubscriptionsInventoryFilters: [] }
        ]
      })
    };

    const component = await shallowHookComponent(<ProductView {...props} />);
    expect(component).toMatchSnapshot('custom tabs, subscriptions table');
  });
});
