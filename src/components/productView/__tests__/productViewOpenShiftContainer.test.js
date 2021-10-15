import React from 'react';
import toJson from 'enzyme-to-json';
import { PageColumns } from '../../pageLayout/pageLayout';
import { ProductViewOpenShiftContainer } from '../productViewOpenShiftContainer';
import { config as openshiftContainerConfig } from '../../../config/product.openshiftContainer';
import { config as openshiftMetricsConfig } from '../../../config/product.openshiftMetrics';

describe('ProductViewOpenShiftContainer Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useRouteDetail: () => ({
        pathParameter: 'lorem ipsum',
        productConfig: [openshiftContainerConfig, openshiftMetricsConfig],
        productParameter: 'lorem ipsum product label'
      })
    };
    const component = await shallowHookComponent(<ProductViewOpenShiftContainer {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should be a custom product view', async () => {
    const props = {
      useRouteDetail: () => ({
        pathParameter: 'lorem ipsum',
        productConfig: [openshiftContainerConfig, openshiftMetricsConfig],
        productParameter: 'lorem ipsum product label'
      })
    };
    const component = await shallowHookComponent(<ProductViewOpenShiftContainer {...props} />);
    const pageColumns = component.find(PageColumns);

    expect(pageColumns.children().length).toBe(2);

    // column one
    const { type: childOneType } = toJson(pageColumns.childAt(0));
    expect(childOneType).toBe('ContextProvider');

    // column two
    const { type: childTwoType } = toJson(pageColumns.childAt(1));
    expect(childTwoType).toBe('ContextProvider');
  });
});
