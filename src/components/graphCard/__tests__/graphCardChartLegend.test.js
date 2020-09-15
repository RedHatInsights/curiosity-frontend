import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@patternfly/react-core';
import { GraphCardChartLegend } from '../graphCardChartLegend';

describe('GraphCardChartLegend Component', () => {
  it('should render a basic component', () => {
    const props = {
      datum: {
        dataSets: [
          {
            stroke: '#000000',
            id: 'loremIpsum',
            data: [{ y: 0, hasData: true }]
          }
        ]
      }
    };
    const component = shallow(<GraphCardChartLegend {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should render basic data', () => {
    const props = {
      datum: {
        dataSets: [
          {
            stroke: '#000000',
            id: 'loremIpsum',
            isThreshold: false,
            data: [{ y: 0, hasData: true }]
          },
          {
            stroke: '#000000',
            id: 'ametConsectetur',
            isThreshold: false,
            data: [{ y: 0, hasData: false }]
          },
          {
            stroke: '#ff0000',
            id: 'dolorSit',
            isThreshold: true,
            data: [{ y: 0, isInfinite: false }]
          },
          {
            stroke: '#ff0000',
            id: 'nonCursus',
            isThreshold: true,
            data: [{ y: 0, isInfinite: true }]
          }
        ]
      },
      productLabel: 'test'
    };

    const component = shallow(<GraphCardChartLegend {...props} />);
    expect(component).toMatchSnapshot('data');
  });

  it('should handle a click event', () => {
    const props = {
      datum: {
        dataSets: [
          {
            stroke: '#000000',
            id: 'loremIpsum',
            isThreshold: false,
            data: [{ y: 0, hasData: true }]
          },
          {
            stroke: '#ff0000',
            id: 'dolorSit',
            isThreshold: true,
            data: [{ y: 0, isInfinite: false }]
          }
        ]
      },
      legend: {
        'test-dolorSit': true
      },
      productLabel: 'test',
      viewId: 'test'
    };

    const component = shallow(<GraphCardChartLegend {...props} />);
    expect(component.find(Button).first()).toMatchSnapshot('click event pre');

    component.find(Button).first().simulate('click');
    // emulate a Redux state update.
    component.setProps({
      legend: { ...props.legend, ...{ 'test-loremIpsum': true } }
    });
    expect(component.find(Button).first()).toMatchSnapshot('click event update');

    component.find(Button).first().simulate('keyPress');
    // emulate a Redux state update.
    component.setProps({
      legend: { ...props.legend, ...{ 'test-loremIpsum': false } }
    });
    expect(component.find(Button).first()).toMatchSnapshot('click event post');
  });

  it('should handle variations in data when returning legend items', () => {
    const props = {
      datum: {
        dataSets: [
          {
            stroke: '#000000',
            id: 'loremIpsum',
            isThreshold: false,
            data: [{ y: 0, hasData: true }]
          },
          {
            stroke: '#ff0000',
            id: 'dolorSit',
            isThreshold: true,
            data: [{ y: 0, isInfinite: false }]
          }
        ]
      },
      productLabel: 'test'
    };

    const component = shallow(<GraphCardChartLegend {...props} />);

    expect(
      component.instance().renderLegendItem({
        chartId: 'loremIpsum',
        color: '#000000',
        isDisabled: false,
        isThreshold: false,
        labelContent: 'lorem ispum',
        tooltipContent: 'dolor sit'
      })
    ).toMatchSnapshot('legend item, WITH tooltip content');

    expect(
      component.instance().renderLegendItem({
        chartId: 'loremIpsum',
        color: '#000000',
        isDisabled: false,
        isThreshold: false,
        labelContent: 'lorem ispum',
        tooltipContent: undefined
      })
    ).toMatchSnapshot('legend item, MISSING tooltip content');

    expect(
      component.instance().renderLegendItem({
        chartId: 'loremIpsum',
        color: '#000000',
        isDisabled: true,
        isThreshold: false,
        labelContent: 'lorem ispum',
        tooltipContent: undefined
      })
    ).toMatchSnapshot('legend item, disabled');
  });
});
