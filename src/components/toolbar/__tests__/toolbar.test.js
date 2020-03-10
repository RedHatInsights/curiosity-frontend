import React from 'react';
import { mount, shallow } from 'enzyme';
import { Toolbar } from '../toolbar';
import { toolbarTypes } from '../toolbarTypes';

describe('Toolbar Component', () => {
  it('should render a non-connected component', () => {
    const props = {};
    const component = shallow(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });

  it('should handle updating state and dispatching an sla filter', () => {
    const props = {};

    const dispatchFilter = jest.spyOn(Toolbar.prototype, 'dispatchFilter');
    const component = mount(<Toolbar {...props} />);
    const componentInstance = component.instance();

    const slaOption = toolbarTypes.getOptions('sla').options[0];
    componentInstance.onSlaSelect({ selected: { ...slaOption }, value: slaOption.value });
    expect(componentInstance.state).toMatchSnapshot('sla selected');

    componentInstance.onClear();
    expect(componentInstance.state).toMatchSnapshot('clear filters');

    expect(dispatchFilter).toHaveBeenCalledTimes(2);
  });
});
