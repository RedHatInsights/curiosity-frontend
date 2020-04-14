import React from 'react';
import { mount, shallow } from 'enzyme';
import { OptinView } from '../optinView';

describe('OptinView Component', () => {
  it('should render a non-connected component', () => {
    const props = {};

    const component = shallow(<OptinView {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should render an API state driven view', () => {
    const props = {};

    const component = shallow(<OptinView {...props} />);
    expect(component).toMatchSnapshot('initial view');

    component.setProps({
      pending: true
    });
    expect(component.find('CardFooter').first()).toMatchSnapshot('pending view');

    component.setProps({
      pending: false,
      error: true
    });
    expect(component.find('CardFooter').first()).toMatchSnapshot('error view');

    component.setProps({
      pending: false,
      error: false,
      fulfilled: true
    });
    expect(component.find('CardFooter').first()).toMatchSnapshot('fulfilled view');
  });

  it('should submit an opt-in form', () => {
    const props = {};

    const component = mount(<OptinView {...props} />);
    const componentInstance = component.instance();
    const spy = jest.spyOn(componentInstance, 'onSubmitOptIn');

    component.update();
    componentInstance.forceUpdate();

    component.find('form button').simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
