import React from 'react';
import { ProductView } from '../productView';
import { RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES as DISPLAY_TYPES } from '../../../services/rhsm/rhsmConstants';

describe('ProductView Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useRouteDetail: () => ({
        firstMatch: { lorem: 'ipsum', productId: 'lorem', viewId: 'viewIpsum' },
        productGroup: 'lorem ipsum'
      })
    };

    const component = await shallowComponent(<ProductView {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should render nothing if productGroup, and product parameters are empty', async () => {
    const props = {
      useRouteDetail: () => ({
        firstMatch: {},
        productGroup: null
      })
    };

    const componentProductGroup = await shallowComponent(<ProductView {...props} />);
    expect(componentProductGroup).toMatchSnapshot('empty, productGroup');

    props.useRouteDetail = () => ({
      firstMatch: {},
      productGroup: 'lorem ipsum',
      productId: null,
      viewId: null
    });

    const componentProductId = await shallowComponent(<ProductView {...props} />);
    expect(componentProductId).toMatchSnapshot('empty, productId and viewId');
  });

  it('should allow custom product views via productDisplay types', async () => {
    const props = {
      useRouteDetail: () => ({
        firstMatch: { lorem: 'ipsum', productId: 'lorem', viewId: 'viewIpsum', productDisplay: DISPLAY_TYPES.HOURLY },
        productGroup: 'lorem ipsum'
      })
    };

    const componentTypeOne = await shallowComponent(<ProductView {...props} />);
    expect(componentTypeOne).toMatchSnapshot('custom view, hourly');

    props.useRouteDetail = () => ({
      firstMatch: { lorem: 'ipsum', productId: 'lorem', viewId: 'viewIpsum', productDisplay: DISPLAY_TYPES.CAPACITY },
      productGroup: 'lorem ipsum'
    });
    const componentTypeTwo = await shallowComponent(<ProductView {...props} />);
    expect(componentTypeTwo).toMatchSnapshot('custom view, capacity');

    props.useRouteDetail = () => ({
      firstMatch: { lorem: 'ipsum', productId: 'lorem', viewId: 'viewIpsum', productDisplay: DISPLAY_TYPES.DUAL_AXES },
      productGroup: 'lorem ipsum'
    });
    const componentTypeThree = await shallowComponent(<ProductView {...props} />);
    expect(componentTypeThree).toMatchSnapshot('custom view, dual axes');

    props.useRouteDetail = () => ({
      firstMatch: { lorem: 'ipsum', productId: 'lorem', viewId: 'viewIpsum', productDisplay: DISPLAY_TYPES.LEGACY },
      productGroup: 'lorem ipsum'
    });
    const componentTypeFour = await shallowComponent(<ProductView {...props} />);
    expect(componentTypeFour).toMatchSnapshot('custom view, legacy');

    props.useRouteDetail = () => ({
      firstMatch: { lorem: 'ipsum', productId: 'lorem', viewId: 'viewIpsum', productDisplay: DISPLAY_TYPES.PARTIAL },
      productGroup: 'lorem ipsum'
    });
    const componentTypeFive = await shallowComponent(<ProductView {...props} />);
    expect(componentTypeFive).toMatchSnapshot('custom view, partial');
  });

  it('should allow custom inventory displays via config', async () => {
    const props = {
      toolbarGraphDescription: true,
      useRouteDetail: () => ({
        firstMatch: {
          lorem: 'ipsum',
          productId: 'lorem',
          viewId: 'viewIpsum',
          initialInventoryFilters: [],
          initialSubscriptionsInventoryFilters: []
        },
        productGroup: 'lorem ipsum'
      })
    };

    const component = await shallowComponent(<ProductView {...props} />);
    expect(component).toMatchSnapshot('custom tabs, basic inventory tables');

    const componentMissingInv = await component.setProps({
      ...props,
      useRouteDetail: () => ({
        firstMatch: {
          lorem: 'ipsum',
          productId: 'lorem',
          viewId: 'viewIpsum',
          initialInventoryFilters: undefined,
          initialSubscriptionsInventoryFilters: []
        },
        productGroup: 'lorem ipsum'
      })
    });

    expect(componentMissingInv).toMatchSnapshot('custom tabs, missing inventory');

    const componentMissingSubsInv = await component.setProps({
      ...props,
      useRouteDetail: () => ({
        firstMatch: {
          lorem: 'ipsum',
          productId: 'lorem',
          viewId: 'viewIpsum',
          initialInventoryFilters: [],
          initialSubscriptionsInventoryFilters: undefined
        },
        productGroup: 'lorem ipsum'
      })
    });

    expect(componentMissingSubsInv).toMatchSnapshot('custom tabs, missing subscriptions inventory');
  });
});
