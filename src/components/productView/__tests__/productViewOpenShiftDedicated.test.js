import React from 'react';
import { ProductViewOpenShiftDedicated } from '../productViewOpenShiftDedicated';
import { ToolbarFieldRangedMonthly } from '../../toolbar/toolbarFieldRangedMonthly';
import { config } from '../../../config/product.openshiftDedicated';
import * as routerContext from '../../router/routerContext';

describe('ProductViewOpenShiftDedicated Component', () => {
  let mock;

  beforeEach(() => {
    const mockContextValue = {
      pathParameter: 'lorem ipsum',
      productConfig: [config],
      productParameter: 'lorem ipsum product label',
      viewParameter: 'dolor sit'
    };

    mock = jest.spyOn(routerContext, 'useRouteDetail').mockImplementation(() => mockContextValue);
  });

  afterEach(() => {
    mock.mockClear();
  });

  it('should render a basic component', async () => {
    const props = {};
    const component = await shallowHookComponent(<ProductViewOpenShiftDedicated {...props} />);
    expect(component).toMatchSnapshot('basic');
    mock.mockClear();
  });

  it('should be a custom product view', async () => {
    const props = {};
    const component = await shallowHookComponent(<ProductViewOpenShiftDedicated {...props} />);
    const { toolbarGraph, toolbarGraphDescription, toolbarProduct } = component.props();

    expect(toolbarGraph.type === ToolbarFieldRangedMonthly).toBe(true);
    expect(toolbarGraphDescription).toBe(true);
    expect(toolbarProduct).toBe(false);
    mock.mockClear();
  });
});
