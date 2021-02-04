import React from 'react';
import { mount, shallow } from 'enzyme';
import { ChartArea } from '../chartArea';

describe('ChartArea Component', () => {
  it('should render a basic component', () => {
    const props = {};
    const component = shallow(<ChartArea {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should render basic data', () => {
    const props = {
      dataSets: [
        {
          data: [
            {
              x: 1,
              y: 1,
              xAxisLabel: '1 x axis label'
            },
            {
              x: 2,
              y: 2,
              xAxisLabel: '2 x axis label'
            }
          ],
          id: 'loremGraph',
          isStacked: true,
          fill: '#ipsum',
          stroke: '#lorem',
          strokeWidth: 2
        },
        {
          data: [
            {
              x: 1,
              y: 1,
              xAxisLabel: '1 x axis label'
            },
            {
              x: 2,
              y: 2,
              xAxisLabel: '2 x axis label'
            }
          ],
          id: 'ipsumGraph',
          isThreshold: true,
          fill: '#ipsum',
          stroke: '#lorem',
          strokeDasharray: '4,3',
          strokeWidth: 3
        }
      ]
    };

    const component = shallow(<ChartArea {...props} />);
    expect(component).toMatchSnapshot('data');
  });

  it('should allow tick formatting', () => {
    const props = {
      yAxisTickFormat: ({ tick }) => `${tick} dolor sit`,
      dataSets: [
        {
          data: [
            {
              x: 1,
              y: 0,
              xAxisLabel: '1 x axis label'
            },
            {
              x: 2,
              y: 1,
              xAxisLabel: '2 x axis label'
            }
          ],
          id: 'loremGraph',
          isStacked: true
        },
        {
          data: [],
          id: 'ipsumGraph',
          isThreshold: true
        }
      ]
    };

    const component = shallow(<ChartArea {...props} />);
    expect(component.render()).toMatchSnapshot('y tick format');

    component.setProps({
      xAxisTickFormat: ({ tick }) => `${tick} ipsum`
    });
    expect(component.render()).toMatchSnapshot('x tick format');
  });

  it('should set a minimum y axis domain or range', () => {
    const props = {
      yAxisTickFormat: ({ tick }) => `${tick} dolor sit`,
      dataSets: [
        {
          data: [
            {
              x: 1,
              y: 0,
              xAxisLabel: '1 x axis label'
            },
            {
              x: 2,
              y: 1,
              xAxisLabel: '2 x axis label'
            },
            {
              x: 2,
              y: 1,
              xAxisLabel: '2 x axis label'
            }
          ],
          id: 'loremGraph',
          isStacked: true
        }
      ]
    };

    const component = mount(<ChartArea {...props} />);
    const componentInstance = component.instance();

    expect(componentInstance.getChartDomain({ isXAxisTicks: true })).toMatchSnapshot('y axis domain or range');
  });

  it('should handle render displays for both data and threshold', () => {
    const props = {
      dataSets: [
        {
          data: [
            {
              x: 1,
              y: 0,
              xAxisLabel: '1 x axis label'
            },
            {
              x: 2,
              y: 1,
              xAxisLabel: '2 x axis label'
            }
          ],
          id: 'loremGraph',
          isStacked: true
        },
        {
          data: [
            {
              x: 1,
              y: 10,
              xAxisLabel: '1 x axis label'
            },
            {
              x: 2,
              y: 10,
              xAxisLabel: '2 x axis label'
            }
          ],
          id: 'ipsumGraph',
          isThreshold: true
        }
      ]
    };

    const component = shallow(<ChartArea {...props} />);
    expect(component).toMatchSnapshot('threshold');
  });

  it('should handle variation in passed properties with specific methods', () => {
    const props = {
      dataSets: [
        {
          data: [
            {
              x: 1,
              y: 0,
              xAxisLabel: '1 x axis label'
            }
          ],
          id: 'loremGraph',
          interpolation: 'natural',
          isStacked: true
        },
        {
          data: [
            {
              x: 1,
              y: 10,
              xAxisLabel: '1 x axis label'
            }
          ],
          id: 'ipsumGraph',
          isThreshold: true
        }
      ]
    };

    const component = shallow(<ChartArea {...props} />);
    expect(component).toMatchSnapshot('variation');

    // check setChartTicks label increment and tick format directly
    component.setProps({
      xAxisLabelIncrement: 2,
      xAxisTickFormat: lorem => `${lorem} ipsum`,
      yAxisTickFormat: dolor => `${dolor} sit`
    });
    expect(component.instance().setChartTicks()).toMatchSnapshot('setChartTicks');

    // check getChartTicks setting xAxisFixLabelOverlap and yAxisFixLabelOverlap directly
    component.setProps({
      xAxisFixLabelOverlap: true
    });
    expect(component.instance().getChartTicks()).toMatchSnapshot('getChartTicks');

    // check getChartDomain setting domain directly
    component.setProps({
      domain: {
        x: [0, 100],
        y: [0, 20]
      }
    });
    expect(component.instance().getChartDomain({ isXAxisTicks: false })).toMatchSnapshot('getChartDomain: domain');

    // check getChartDomain: isYAxisTicks and isXAxisTicks
    component.setProps({
      domain: {}
    });
    expect(component.instance().getChartDomain({ isXAxisTicks: false })).toMatchSnapshot(
      'getChartDomain: isYAxisTicks true'
    );
    expect(component.instance().getChartDomain({ isXAxisTicks: true })).toMatchSnapshot(
      'getChartDomain: isXAxisTicks true'
    );

    // check setChartTicks: xAxisLabelUseDataSet, yAxisLabelUseDataSet
    const additionalDataSet = [
      {
        data: [
          {
            x: 2,
            y: 1,
            xAxisLabel: '1 hello world x-axis label'
          }
        ],
        id: 'dolorGraph',
        xAxisLabelUseDataSet: true
      }
    ];
    component.setProps({
      dataSets: [...props.dataSets, ...additionalDataSet]
    });
    expect(component.instance().setChartTicks()).toMatchSnapshot('setChartTicks: xAxisLabelUseDataSet');
  });

  it('should handle custom chart tooltips', () => {
    const props = {
      dataSets: [
        {
          data: [
            {
              x: 1,
              y: 0,
              xAxisLabel: '1 x axis label'
            }
          ],
          id: 'loremGraph',
          interpolation: 'natural',
          isStacked: true
        },
        {
          data: [
            {
              x: 1,
              y: 10,
              xAxisLabel: '1 x axis label'
            }
          ],
          id: 'ipsumGraph',
          isThreshold: true
        }
      ]
    };

    const component = shallow(<ChartArea {...props} />);

    // check getTooltipData for tooltip updates
    expect(component.instance().getTooltipData()).toMatchSnapshot('getTooltipData:before');
    component.setProps({
      chartTooltip: () => 'lorem ipsum dolor...'
    });
    expect(component.instance().getTooltipData()).toMatchSnapshot('getTooltipData:after function');

    component.setProps({
      chartTooltip: propsObj => <div id="custom-tooltip">{propsObj.datum}</div>
    });
    expect(component.instance().getTooltipData()).toMatchSnapshot('getTooltipData:after node');

    // check renderTooltip
    const renderTooltip = component.instance().renderTooltip();
    expect(renderTooltip).toMatchSnapshot('renderTooltip: should return a custom tooltip');

    const componentTooltip = shallow(renderTooltip);
    expect(componentTooltip).toMatchSnapshot('componentTooltip');

    // confirm chart output
    expect(component).toMatchSnapshot('custom tooltip, post-props chart');
  });

  it('should handle custom chart legends', () => {
    let chartMethods = {};
    const props = {
      dataSets: [
        {
          data: [
            {
              x: 1,
              y: 0,
              xAxisLabel: '1 x axis label'
            }
          ],
          id: 'loremGraph',
          interpolation: 'natural',
          isStacked: true
        },
        {
          data: [
            {
              x: 1,
              y: 10,
              xAxisLabel: '1 x axis label'
            }
          ],
          id: 'ipsumGraph',
          isThreshold: true
        }
      ],
      chartLegend: propsObj => {
        chartMethods = propsObj.chart;
        return propsObj;
      }
    };

    const component = shallow(<ChartArea {...props} />);
    expect(component.instance().renderLegend()).toMatchSnapshot('renderLegend: should return a custom legend');

    chartMethods.hide('loremGraph');
    expect(component.instance().dataSetsToggle).toMatchSnapshot('hide state');

    const returnedToggleValue = chartMethods.isToggled('loremGraph');
    expect({ state: component.instance().dataSetsToggle, returnedToggleValue }).toMatchSnapshot('isToggled state');

    chartMethods.toggle('loremGraph');
    expect(component.instance().dataSetsToggle).toMatchSnapshot('toggle state');

    chartMethods.revert();
    expect(component.instance().dataSetsToggle).toMatchSnapshot('revert state');
  });

  it('should set initial width to zero and then resize', () => {
    const component = shallow(<ChartArea />);

    expect(component.instance().onResizeContainer).toBeDefined();

    // initial state width should be zero
    expect(component.state().chartWidth).toEqual(0);

    // set the container size arbitrarily
    component.instance().containerRef.current = { clientWidth: 100 };
    global.dispatchEvent(new Event('resize'));
    expect(component.state().chartWidth).toEqual(100);

    // set the container size arbitrarily and force handleResize to fire
    component.instance().containerRef.current = { clientWidth: 1337 };
    global.dispatchEvent(new Event('resize'));
    expect(component.state().chartWidth).toEqual(1337);
  });

  it('should attempt to handle a ResizeObserver', () => {
    const observe = jest.fn();
    const unobserve = jest.fn();

    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe,
      unobserve
    }));

    const component = mount(<ChartArea />);
    expect(observe).toHaveBeenCalledTimes(1);

    component.unmount();
    expect(unobserve).toHaveBeenCalledTimes(1);
  });

  it('should run componentWillUnmount method successfully', () => {
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn()
    }));

    const component = mount(<ChartArea />);
    const componentWillUnmount = jest.spyOn(component.instance(), 'componentWillUnmount');
    component.unmount();
    expect(componentWillUnmount).toHaveBeenCalled();
  });
});
