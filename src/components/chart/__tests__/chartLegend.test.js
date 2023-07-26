import React from 'react';
import { ChartLegend } from '../chartLegend';
import * as chartContext from '../chartContext';

describe('ChartLegend Component', () => {
  it('should render a basic component', () => {
    const props = {};
    const component = renderComponent(<ChartLegend {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should pass legend props', () => {
    const props = {};

    const mockLegend = jest.fn();
    const mockContextValue = {
      chartSettings: {
        chartLegend: mockLegend,
        dataSets: [
          {
            data: [
              {
                x: 1,
                xAxisLabel: '1 x axis label',
                y: 1
              },
              {
                x: 2,
                xAxisLabel: '2 x axis label',
                y: 2
              }
            ],
            fill: '#ipsum',
            id: 'loremGraph',
            isStacked: true,
            stroke: '#lorem',
            strokeWidth: 2
          },
          {
            data: [
              {
                x: 1,
                xAxisLabel: '1 x axis label',
                y: 1
              },
              {
                x: 2,
                xAxisLabel: '2 x axis label',
                y: 2
              }
            ],
            fill: '#ipsum',
            id: 'ipsumGraph',
            isThreshold: true,
            stroke: '#lorem',
            strokeDasharray: '4,3',
            strokeWidth: 3
          }
        ]
      }
    };

    const mock = jest.spyOn(chartContext, 'useChartContext').mockImplementation(() => mockContextValue);

    renderComponent(<ChartLegend {...props} />);
    expect(mockLegend.mock.calls).toMatchSnapshot('passed props');

    mock.mockClear();
  });

  it('should handle legend elements', () => {
    const props = {};

    const MockLegend = p => <div data-test={JSON.stringify(p, null, 2)}>lorem ipsum</div>;
    const mockContextValue = {
      chartSettings: {
        chartLegend: MockLegend,
        dataSets: [
          {
            data: [
              {
                x: 1,
                xAxisLabel: '1 x axis label',
                y: 1
              },
              {
                x: 2,
                xAxisLabel: '2 x axis label',
                y: 2
              }
            ],
            id: 'loremGraph'
          }
        ]
      }
    };

    const mock = jest.spyOn(chartContext, 'useChartContext').mockImplementation(() => mockContextValue);

    const component = renderComponent(<ChartLegend {...props} />);
    expect(component).toMatchSnapshot('element');

    mock.mockClear();
  });
});
