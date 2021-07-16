import React from 'react';
import { shallow } from 'enzyme';
import { ChartLegend } from '../chartLegend';
import * as chartContext from '../chartContext';

describe('ChartLegend Component', () => {
  it('should render a basic component', () => {
    const props = {};
    const component = shallow(<ChartLegend {...props} />);

    expect(component.render()).toMatchSnapshot('basic');
  });

  it('should pass legend props', async () => {
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

    await shallowHookComponent(<ChartLegend {...props} />);
    expect(mockLegend.mock.calls).toMatchSnapshot('passed props');

    mock.mockClear();
  });

  it('should handle legend elements', async () => {
    const props = {};

    const mockLegend = <div>lorem ipsum</div>;
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
            id: 'loremGraph'
          }
        ]
      }
    };

    const mock = jest.spyOn(chartContext, 'useChartContext').mockImplementation(() => mockContextValue);

    const component = await shallowHookComponent(<ChartLegend {...props} />);
    expect(component).toMatchSnapshot('element');

    mock.mockClear();
  });
});
