import React from 'react';
import { PageColumns, PageToolbar } from '../../pageLayout/pageLayout';
import { ToolbarFieldUom } from '../../toolbar/toolbarFieldUom';
import { ToolbarFieldRangedMonthly } from '../../toolbar/toolbarFieldRangedMonthly';
import { ProductViewOpenShiftContainer } from '../productViewOpenShiftContainer';
import { config as openshiftContainerConfig } from '../../../config/product.openshiftContainer';
import { config as openshiftMetricsConfig } from '../../../config/product.openshiftMetrics';
import * as routerContext from '../../router/routerContext';

describe('ProductViewOpenShiftContainer Component', () => {
  let mock;

  beforeEach(() => {
    const mockContextValue = {
      pathParameter: 'lorem ipsum',
      productConfig: [openshiftContainerConfig, openshiftMetricsConfig],
      productParameter: 'lorem ipsum product label'
    };

    mock = jest.spyOn(routerContext, 'useRouteDetail').mockImplementation(() => mockContextValue);
  });

  afterEach(() => {
    mock.mockClear();
  });

  it('should render a basic component', async () => {
    const props = {};
    const component = await shallowHookComponent(<ProductViewOpenShiftContainer {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should be a custom product view', async () => {
    const props = {};
    const component = await shallowHookComponent(<ProductViewOpenShiftContainer {...props} />);
    const pageColumns = component.find(PageColumns);

    expect(pageColumns.children().length).toBe(5);

    // column one
    expect(pageColumns.childAt(0).find(PageToolbar).length).toBe(1);

    // column two
    expect(pageColumns.childAt(1).find(ToolbarFieldUom).length).toBe(1);
    expect(pageColumns.childAt(3).find(ToolbarFieldRangedMonthly).length).toBe(1);
  });
});
