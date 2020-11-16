import React from 'react';
import { mount, shallow } from 'enzyme';
import { MinHeight } from '../minHeight';

describe('MinHeight Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runAllTimers();
  });

  it('should render a non-connected component', () => {
    const props = {};

    const component = shallow(<MinHeight {...props}>lorem ipsum</MinHeight>);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should set minHeight in relation to contents and props', () => {
    const props = {
      updateOnContent: true
    };
    const component = mount(<MinHeight {...props}>lorem ipsum</MinHeight>);
    const componentInstance = component.instance();

    // initial minHeight should be undefined
    componentInstance.containerRef.current = { style: {} };
    expect(componentInstance.containerRef.current.style.minHeight).toBe(undefined);

    // set the container size arbitrarily
    componentInstance.containerRef.current = { clientHeight: 75, style: {} };
    componentInstance.innerContainerRef.current = { clientHeight: 75 };
    jest.runAllTimers();
    expect(componentInstance.containerRef.current.style.minHeight).toBe('75px');

    // set a minimum minHeight
    component.setProps({ minHeight: 200 });
    jest.runAllTimers();
    expect(componentInstance.containerRef.current.style.minHeight).toBe('200px');

    // disable "on update" minHeight adjustments
    component.setProps({ updateOnContent: false, minHeight: 300 });
    jest.runAllTimers();
    expect(componentInstance.containerRef.current.style.minHeight).toBe('200px');
  });

  it('should set minHeight on resize', () => {
    const props = {};
    const component = shallow(<MinHeight {...props}>lorem ipsum</MinHeight>);
    const componentInstance = component.instance();

    expect(componentInstance.onResizeContainer).toBeDefined();

    // initial height and width should be zero
    componentInstance.containerRef.current = {};
    expect(componentInstance.updatedContainerWidth).toBe(0);

    // set the container size arbitrarily and force handleResize to fire
    componentInstance.containerRef.current = { clientHeight: 100, clientWidth: 200, style: {} };
    componentInstance.innerContainerRef.current = { clientHeight: 100, clientWidth: 200 };
    global.dispatchEvent(new Event('resize'));
    expect(componentInstance.containerRef.current.style.minHeight).toBe('100px');
    expect(componentInstance.updatedContainerWidth).toBe(200);

    // set the container size arbitrarily and force handleResize to fire
    componentInstance.containerRef.current = { clientHeight: 1000, clientWidth: 1337, style: {} };
    componentInstance.innerContainerRef.current = { clientHeight: 1000, clientWidth: 1337 };
    global.dispatchEvent(new Event('resize'));
    expect(componentInstance.containerRef.current.style.minHeight).toBe('1000px');
    expect(componentInstance.updatedContainerWidth).toBe(1337);

    componentInstance.containerRef.current = { clientHeight: 600, clientWidth: 600, style: { minHeight: '1000px' } };
    componentInstance.innerContainerRef.current = { clientHeight: 600, clientWidth: 600 };
    component.setProps({ updateOnResize: false });
    global.dispatchEvent(new Event('resize'));
    expect(componentInstance.containerRef.current.style.minHeight).toBe('1000px');
    expect(componentInstance.updatedContainerWidth).toBe(1337);
  });

  it('should attempt to handle a ResizeObserver', () => {
    const props = {};
    const setResizeObserver = jest.spyOn(MinHeight.prototype, 'setResizeObserver');

    const component = mount(<MinHeight {...props}>lorem ipsum</MinHeight>);
    expect(setResizeObserver).toHaveBeenCalledTimes(1);

    const resizeObserver = jest.spyOn(component.instance(), 'resizeObserver');
    component.unmount();
    expect(resizeObserver).toHaveBeenCalledTimes(1);
  });

  it('should run componentWillUnmount method successfully', () => {
    const props = {};
    const component = mount(<MinHeight {...props}>lorem ipsum</MinHeight>);
    const componentWillUnmount = jest.spyOn(component.instance(), 'componentWillUnmount');
    component.unmount();
    expect(componentWillUnmount).toHaveBeenCalled();
  });
});
