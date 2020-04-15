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
      session: {
        status: 200
      }
    });
    expect(component.find('CardFooter').first()).toMatchSnapshot('200 view');

    component.setProps({
      session: {
        status: 401
      }
    });
    expect(component.find('CardFooter').first()).toMatchSnapshot('401 view');

    component.setProps({
      session: {
        status: 403
      }
    });
    expect(component.find('CardFooter').first()).toMatchSnapshot('403 view');

    component.setProps({
      session: {
        status: 418
      }
    });
    expect(component.find('CardFooter').first()).toMatchSnapshot('4XX view');

    component.setProps({
      session: {
        status: 500
      }
    });
    expect(component.find('CardFooter').first()).toMatchSnapshot('500 view');

    component.setProps({
      pending: true,
      session: {}
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
    const props = {
      session: {
        status: 403
      }
    };

    const component = mount(<OptinView {...props} />);
    const componentInstance = component.instance();
    const spy = jest.spyOn(componentInstance, 'onSubmitOptIn');

    component.update();
    componentInstance.forceUpdate();

    component.find('form button').simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
