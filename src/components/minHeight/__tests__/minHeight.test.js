import React from 'react';
import { mount, shallow } from 'enzyme';
import { MinHeight } from '../minHeight';

describe('MinHeight Component', () => {
  it('should render a non-connected component', () => {
    const props = {};

    const component = shallow(<MinHeight {...props}>lorem ipsum</MinHeight>);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should set minHeight in relation to contents and props', () => {
    const props = {
      autoUpdate: true
    };
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

  it('should set minHeight on resize', () => {
    const props = {};
    const component = shallow(<MinHeight {...props}>lorem ipsum</MinHeight>);

    expect(component.instance().onResizeContainer).toBeDefined();

    // initial height and width should be zero
    expect(component.instance().updatedMinHeight).toEqual(0);
    expect(component.instance().updatedContainerWidth).toEqual(0);

    // set the container size arbitrarily and force handleResize to fire
    component.instance().containerRef.current = { clientHeight: 100, clientWidth: 200 };
    global.dispatchEvent(new Event('resize'));
    expect(component.instance().updatedMinHeight).toEqual(100);
    expect(component.instance().updatedContainerWidth).toEqual(200);

    // set the container size arbitrarily and force handleResize to fire
    component.instance().containerRef.current = { clientHeight: 1000, clientWidth: 1337 };
    global.dispatchEvent(new Event('resize'));
    expect(component.instance().updatedMinHeight).toEqual(1000);
    expect(component.instance().updatedContainerWidth).toEqual(1337);
  });

  it('should attempt to handle a ResizeObserver', () => {
    const observe = jest.fn();
    const unobserve = jest.fn();

    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe,
      unobserve
    }));

    const props = {};
    const component = mount(<MinHeight {...props}>lorem ipsum</MinHeight>);
    expect(observe).toHaveBeenCalledTimes(1);

    component.unmount();
    expect(unobserve).toHaveBeenCalledTimes(1);
  });

  it('should run componentWillUnmount method successfully', () => {
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn()
    }));

    const props = {};
    const component = mount(<MinHeight {...props}>lorem ipsum</MinHeight>);
    const componentWillUnmount = jest.spyOn(component.instance(), 'componentWillUnmount');
    component.unmount();
    expect(componentWillUnmount).toHaveBeenCalled();
  });
});
