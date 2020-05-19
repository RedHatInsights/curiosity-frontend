import React from 'react';
import { mount, shallow } from 'enzyme';
import { C3Chart } from '../c3Chart';

describe('C3Chart Component', () => {
  it('should render a basic component', () => {
    const props = {};
    const component = shallow(<C3Chart {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should run componentWillUnmount method successfully', () => {
    const component = mount(<C3Chart />);
    const componentWillUnmount = jest.spyOn(component.instance(), 'componentWillUnmount');
    component.unmount();
    expect(componentWillUnmount).toHaveBeenCalled();
  });

  it('should pass child components', () => {
    const props = {};
    const component = shallow(
      <C3Chart {...props}>
        lorem <span>ipsum</span>
      </C3Chart>
    );

    expect(component).toMatchSnapshot('child components');
  });

  it('should return a chart and config reference', () => {
    const props = {
      config: {
        data: {
          columns: []
        }
      }
    };
    const component = shallow(
      <C3Chart {...props}>
        {({ chart, config }) => (
          <span>
            {chart} and {JSON.stringify(config)}
          </span>
        )}
      </C3Chart>
    );

    expect(component).toMatchSnapshot('references');
  });
});
