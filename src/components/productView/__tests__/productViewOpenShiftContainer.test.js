import React from 'react';
import { shallow } from 'enzyme';
import { PageColumns, PageToolbar } from '../../pageLayout/pageLayout';
import { ToolbarFieldUom } from '../../toolbar/toolbarFieldUom';
import { ToolbarFieldRangedMonthly } from '../../toolbar/toolbarFieldRangedMonthly';
import { ProductViewOpenShiftContainer } from '../productViewOpenShiftContainer';
import { config as openshiftContainerConfig } from '../../../config/product.openshiftContainer';
import { config as openshiftMetricsConfig } from '../../../config/product.openshiftMetrics';

describe('ProductViewOpenShiftContainer Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      routeDetail: {
        pathParameter: 'lorem ipsum',
        productConfig: [openshiftContainerConfig, openshiftMetricsConfig],
        productParameter: 'lorem ipsum product label'
      }
    };

    const component = shallow(<ProductViewOpenShiftContainer {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should be a custom product view', () => {
    const props = {
      routeDetail: {
        pathParameter: 'lorem ipsum',
        productConfig: [openshiftContainerConfig, openshiftMetricsConfig],
        productParameter: 'lorem ipsum product label'
      }
    };

    const component = shallow(<ProductViewOpenShiftContainer {...props} />);
    const pageColumns = component.find(PageColumns);

    expect(pageColumns.children().length).toBe(5);

    // column one
    expect(pageColumns.childAt(0).find(PageToolbar).length).toBe(1);

    // column two
    expect(pageColumns.childAt(1).find(ToolbarFieldUom).length).toBe(1);
    expect(pageColumns.childAt(3).find(ToolbarFieldRangedMonthly).length).toBe(1);
  });
});
