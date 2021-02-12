import React from 'react';
import { shallow } from 'enzyme';
import { RouterContext, useRouteContext, useLocation, useRouteDetail } from '../routerContext';

describe('RouterContext', () => {
  // eslint-disable-next-line
  const Hook = ({ hook }) => <React.Fragment>{JSON.stringify(hook(), null, 2)}</React.Fragment>;
  const setContext = (value = {}) => jest.spyOn(React, 'useContext').mockImplementation(() => value);

  it('should return specific properties', () => {
    expect(RouterContext).toBeDefined();
    expect(useLocation).toBeDefined();
    expect(useRouteDetail).toBeDefined();
    expect(useRouteContext).toBeDefined();
  });

  it('should apply a hook for useRouteDetail', () => {
    const spy = setContext({
      routeDetail: {
        lorem: 'ipsum'
      }
    });

    const component = shallow(<Hook hook={useRouteDetail} />);
    expect(component).toMatchSnapshot('useRouteDetail');
    spy.mockClear();
  });

  it('should apply a hook for useLocation', () => {
    const spy = setContext({
      location: {
        dolor: 'sit'
      }
    });

    const component = shallow(<Hook hook={useLocation} />);
    expect(component).toMatchSnapshot('useLocation');
    spy.mockClear();
  });

  it('should apply a hook for useRouteContext', () => {
    const spy = setContext({
      routeDetail: {
        lorem: 'ipsum'
      },
      location: {
        dolor: 'sit'
      }
    });

    const component = shallow(<Hook hook={useRouteContext} />);
    expect(component).toMatchSnapshot('useRouteContext');
    spy.mockClear();
  });
});
