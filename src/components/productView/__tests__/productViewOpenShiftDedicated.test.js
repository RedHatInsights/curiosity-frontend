import React from 'react';
import { ProductViewOpenShiftDedicated } from '../productViewOpenShiftDedicated';
import { ToolbarFieldRangedMonthly } from '../../toolbar/toolbarFieldRangedMonthly';
import { config } from '../../../config/product.openshiftDedicated';

describe('ProductViewOpenShiftDedicated Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useRouteDetail: () => ({
        pathParameter: 'lorem ipsum',
        productConfig: [config],
        productParameter: 'lorem ipsum product label',
        viewParameter: 'dolor sit'
      })
    };
    const component = await shallowHookComponent(<ProductViewOpenShiftDedicated {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should be a custom product view', async () => {
    const props = {
      useRouteDetail: () => ({
        pathParameter: 'lorem ipsum',
        productConfig: [config],
        productParameter: 'lorem ipsum product label',
        viewParameter: 'dolor sit'
      })
    };
    const component = await shallowHookComponent(<ProductViewOpenShiftDedicated {...props} />);
    const { toolbarGraph, toolbarGraphDescription, toolbarProduct } = component.props();

    expect(toolbarGraph.type === ToolbarFieldRangedMonthly).toBe(true);
    expect(toolbarGraphDescription).toBe(true);
    expect(toolbarProduct).toBe(false);
  });
});
