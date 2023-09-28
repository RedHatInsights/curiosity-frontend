import React from 'react';
import { ChartElements } from '../chartElements';
import * as chartContext from '../chartContext';

// ToDo: more useful test
describe('ChartElements Component', () => {
  it('should render a basic component', () => {
    const props = {};
    const component = renderComponent(<ChartElements {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should handle basic element settings from context', async () => {
    const props = {};
    const mockContextValue = {
      chartSettings: {
        chartDomain: {
          domain: {
            y: [0, 3]
          }
        },
        chartElementsProps: {
          elements: [
            {
              chartType: undefined,
              props: {
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
                key: 'chart-ipsumGraph-',
                name: 'chart-ipsumGraph-',
                style: {
                  data: {
                    fill: '#ipsum',
                    stroke: '#lorem',
                    strokeDasharray: '4,3',
                    strokeWidth: 3
                  }
                },
                themeColor: undefined,
                themeVariant: undefined,
                x: undefined,
                y: Function.prototype
              }
            }
          ],
          elementsById: {
            ipsumGraph: {
              chartType: undefined,
              props: {
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
                key: 'chart-ipsumGraph-',
                name: 'chart-ipsumGraph-',
                style: {
                  data: {
                    fill: '#ipsum',
                    stroke: '#lorem',
                    strokeDasharray: '4,3',
                    strokeWidth: 3
                  }
                },
                themeColor: undefined,
                themeVariant: undefined,
                x: undefined,
                y: Function.prototype
              }
            }
          },
          stackedElements: [
            {
              chartType: undefined,
              props: {
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
                key: 'chart-loremGraph-',
                name: 'chart-loremGraph-',
                style: {
                  data: {
                    fill: '#ipsum',
                    stroke: '#lorem',
                    strokeWidth: 2
                  }
                },
                themeColor: undefined,
                themeVariant: undefined,
                x: undefined,
                y: Function.prototype
              }
            }
          ],
          stackedElementsById: {
            loremGraph: {
              chartType: undefined,
              props: {
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
                key: 'chart-loremGraph-',
                name: 'chart-loremGraph-',
                style: {
                  data: {
                    fill: '#ipsum',
                    stroke: '#lorem',
                    strokeWidth: 2
                  }
                },
                themeColor: undefined,
                themeVariant: undefined,
                x: undefined,
                y: Function.prototype
              }
            }
          }
        },
        chartLegend: null,
        chartWidth: 0,
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
        ],
        hasData: true,
        isMultiYAxis: false,
        maxX: 2,
        maxY: 2,
        padding: {
          bottom: 75,
          left: 55,
          right: 55,
          top: 50
        },
        themeColor: 'blue',
        tooltipDataSetLookUp: {},
        xAxisProps: {
          fixLabelOverlap: true,
          tickFormat: Function.prototype,
          tickValues: [1, 2]
        },
        yAxisProps: [
          {
            dependentAxis: true,
            orientation: 'left',
            showGrid: true,
            style: {
              axis: {},
              tickLabels: {}
            },
            tickFormat: Function.prototype
          }
        ]
      }
    };

    const mock = jest.spyOn(chartContext, 'useChartContext').mockImplementation(() => mockContextValue);

    const component = await shallowComponent(<ChartElements {...props} />);
    expect(component).toMatchSnapshot('chart elements');
    mock.mockClear();
  });
});
