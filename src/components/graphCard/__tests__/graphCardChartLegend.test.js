import React from 'react';
import { shallow } from 'enzyme';
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
      product: 'test'
    };

    const component = shallow(<GraphCardChartLegend {...props} />);
    expect(component).toMatchSnapshot('data');
  });

  it('should handle variations in data when returning legend items', () => {
    expect(
      GraphCardChartLegend.renderLegendItem({
        chartId: 'lorem',
        color: '#ipsum',
        isDisabled: false,
        isThreshold: false,
        labelContent: 'lorem ispum',
        tooltipContent: 'dolor sit'
      })
    ).toMatchSnapshot('legend item, WITH tooltip content');

    expect(
      GraphCardChartLegend.renderLegendItem({
        chartId: 'lorem',
        color: '#ipsum',
        isDisabled: false,
        isThreshold: false,
        labelContent: 'lorem ispum',
        tooltipContent: undefined
      })
    ).toMatchSnapshot('legend item, MISSING tooltip content');

    expect(
      GraphCardChartLegend.renderLegendItem({
        chartId: 'lorem',
        color: '#ipsum',
        isDisabled: true,
        isThreshold: false,
        labelContent: 'lorem ispum',
        tooltipContent: undefined
      })
    ).toMatchSnapshot('legend item, disabled');
  });
});
