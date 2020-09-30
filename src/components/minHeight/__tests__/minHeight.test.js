import React from 'react';
import { shallow } from 'enzyme';
import { MinHeight } from '../minHeight';

describe('MinHeight Component', () => {
  it('should render a non-connected component', () => {
    const props = {};

    const component = shallow(<MinHeight {...props}>lorem ipsum</MinHeight>);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should set minHeight in relation to contents and props', () => {
    const props = {};
    const component = shallow(<MinHeight {...props}>lorem ipsum</MinHeight>);

    expect(component.instance().setMinHeight).toBeDefined();

    // initial height should be zero
    expect(component.instance().updatedMinHeight).toEqual(0);

    // set the container size arbitrarily
    component.instance().containerRef.current = { clientHeight: 100 };
    component.instance().componentDidUpdate();
    expect(component.instance().updatedMinHeight).toEqual(100);

    // set a minimum minHeight
    component.setProps({ minHeight: 200 });
    expect(component.instance().updatedMinHeight).toEqual(200);

    // disable "on update" minHeight adjustments
    component.setProps({ autoUpdate: false, minHeight: 300 });
    expect(component.instance().updatedMinHeight).toEqual(200);
  });
});
