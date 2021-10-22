import React from 'react';
import { ProductViewOpenShiftDedicated } from '../productViewOpenShiftDedicated';
import { ToolbarFieldRangedMonthly } from '../../toolbar/toolbarFieldRangedMonthly';

describe('ProductViewOpenShiftDedicated Component', () => {
  it('should render a basic component', async () => {
    const props = {};
    const component = await shallowHookComponent(<ProductViewOpenShiftDedicated {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should be a custom product view', async () => {
    const props = {};
    const component = await shallowHookComponent(<ProductViewOpenShiftDedicated {...props} />);
    const { toolbarGraph, toolbarGraphDescription } = component.props();

    expect(toolbarGraph.type === ToolbarFieldRangedMonthly).toBe(true);
    expect(toolbarGraphDescription).toBe(true);
  });
});
