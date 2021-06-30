import React from 'react';
import { shallow } from 'enzyme';
import { ProductViewOpenShiftDedicated } from '../productViewOpenShiftDedicated';
import { ToolbarFieldRangedMonthly } from '../../toolbar/toolbarFieldRangedMonthly';
import { config } from '../../../config/product.openshiftDedicated';

describe('ProductViewOpenShiftDedicated Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      routeDetail: {
        pathParameter: 'lorem ipsum',
        productConfig: [config],
        productParameter: 'lorem ipsum product label',
        viewParameter: 'dolor sit'
      }
    };

    const component = shallow(<ProductViewOpenShiftDedicated {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should be a custom product view', () => {
    const props = {
      routeDetail: {
        pathParameter: 'lorem ipsum',
        productConfig: [config],
        productParameter: 'lorem ipsum product label',
        viewParameter: 'dolor sit'
      }
    };

    const component = shallow(<ProductViewOpenShiftDedicated {...props} />);
    const { toolbarGraph, toolbarGraphDescription, toolbarProduct } = component.props();

    expect(toolbarGraph.type === ToolbarFieldRangedMonthly).toBe(true);
    expect(toolbarGraphDescription).toBe(true);
    expect(toolbarProduct).toBe(false);
  });
});
