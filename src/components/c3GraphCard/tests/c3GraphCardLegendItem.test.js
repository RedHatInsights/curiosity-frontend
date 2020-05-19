import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@patternfly/react-core';
import { C3GraphCardLegendItem } from '../c3GraphCardLegendItem';

describe('C3GraphCardLegendItem Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      chartId: 'lorem'
    };
    const component = shallow(<C3GraphCardLegendItem {...props}>lorem ipsum</C3GraphCardLegendItem>);

    expect(component).toMatchSnapshot('non-connected');
  });

  it('should render a tooltip with button', () => {
    const props = {
      chartId: 'lorem',
      tooltipContent: <div>lorem ipsum</div>
    };
    const component = shallow(<C3GraphCardLegendItem {...props} />);

    expect(component).toMatchSnapshot('tooltip');
  });

  it('should be able to display both threshold and disabling icons', () => {
    const props = {
      chartId: 'lorem',
      isThreshold: true
    };
    const component = shallow(<C3GraphCardLegendItem {...props} />);
    expect(component).toMatchSnapshot('threshold');

    component.setProps({
      isThreshold: false,
      isDisabled: true
    });
    expect(component).toMatchSnapshot('disabled');
  });

  it('should handle focus, revert, and toggle chart events while reading and updating state', () => {
    const props = {
      chartId: 'lorem',
      chart: {
        color: jest.fn(),
        focus: jest.fn().mockReturnValue('focus'),
        hide: jest.fn(),
        revert: jest.fn(),
        toggle: jest.fn()
      }
    };
    const component = shallow(<C3GraphCardLegendItem {...props} />);
    const componentInstance = component.instance();

    componentInstance.onToggle();
    expect(component.state()).toMatchSnapshot('toggle ON');

    componentInstance.onFocus();
    expect(props.chart.focus).toHaveBeenCalledTimes(0);

    componentInstance.onRevert();
    expect(props.chart.revert).toHaveBeenCalledTimes(0);

    componentInstance.onToggle();
    expect(component.state()).toMatchSnapshot('toggle OFF');

    componentInstance.onFocus();
    expect(props.chart.focus).toHaveBeenCalledTimes(1);

    componentInstance.onRevert();
    expect(props.chart.revert).toHaveBeenCalledTimes(2);
  });

  it('should handle hiding the chart legend item', () => {
    const props = {
      chartId: 'lorem',
      chart: {
        color: jest.fn(),
        focus: jest.fn(),
        hide: jest.fn(),
        revert: jest.fn(),
        toggle: jest.fn()
      },
      isToggled: true
    };

    shallow(<C3GraphCardLegendItem {...props} />);
    expect(props.chart.hide).toHaveBeenCalledTimes(1);
  });

  it('should offset internal state towards the parent component', () => {
    const props = {
      chartId: 'lorem',
      getToggle: jest.fn(),
      isToggled: false
    };

    const component = shallow(<C3GraphCardLegendItem {...props} />);
    component.find(Button).simulate('click');
    expect(props.getToggle).toHaveBeenCalledTimes(1);
  });
});
