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
              tooltip: '1 lorem ipsum',
              xAxisLabel: '1 x axis label',
              yAxisLabel: '1 y axis label'
            },
            {
              x: 2,
              y: 2,
              tooltip: '2 lorem ipsum',
              xAxisLabel: '2 x axis label',
              yAxisLabel: '2 y axis label'
            }
          ],
          legendLabel: 'Arma virumque cano',
          isStacked: true
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
              tooltip: '1 lorem ipsum',
              xAxisLabel: '1 x axis label'
            },
            {
              x: 2,
              y: 1,
              tooltip: '2 lorem ipsum',
              xAxisLabel: '2 x axis label'
            }
          ],
          legendLabel: 'Arma virumque cano',
          isStacked: true
        },
        {
          data: [],
          legendLabel: 'Arma virumque cano',
          isThreshold: true
        }
      ]
    };

    const component = shallow(<ChartArea {...props} />);
    expect(component.render()).toMatchSnapshot('y tick format');
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
              tooltip: '1 lorem ipsum',
              xAxisLabel: '1 x axis label'
            },
            {
              x: 2,
              y: 1,
              tooltip: '2 lorem ipsum',
              xAxisLabel: '2 x axis label'
            },
            {
              x: 2,
              y: 1,
              tooltip: '2 lorem ipsum',
              xAxisLabel: '2 x axis label'
            }
          ],
          legendLabel: 'Arma virumque cano',
          isStacked: true
        }
      ]
    };

    const component = mount(<ChartArea {...props} />);
    const componentInstance = component.instance();

    expect(componentInstance.getChartDomain({ isXAxisTicks: true, isYAxisTicks: false })).toMatchSnapshot(
      'y axis domain or range'
    );
  });

  it('should handle render displays for both data and threshold', () => {
    const props = {
      dataSets: [
        {
          data: [
            {
              x: 1,
              y: 0,
              tooltip: '1 lorem ipsum',
              xAxisLabel: '1 x axis label'
            },
            {
              x: 2,
              y: 1,
              tooltip: '2 lorem ipsum',
              xAxisLabel: '2 x axis label'
            }
          ],
          legendLabel: 'Arma virumque cano',
          isStacked: true
        },
        {
          data: [
            {
              x: 1,
              y: 10,
              tooltip: '10 dolor sit',
              xAxisLabel: '1 x axis label'
            },
            {
              x: 2,
              y: 10,
              tooltip: '10 dolor sit',
              xAxisLabel: '2 x axis label'
            }
          ],
          legendLabel: 'Arma virumque cano',
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
              tooltip: '1 lorem ipsum',
              xAxisLabel: '1 x axis label'
            }
          ],
          interpolation: 'natural',
          legendLabel: 'Arma virumque cano',
          isStacked: true
        },
        {
          data: [
            {
              x: 1,
              y: 10,
              tooltip: '10 dolor sit',
              xAxisLabel: '1 x axis label'
            }
          ],
          legendLabel: 'Arma virumque cano',
          isThreshold: true
        }
      ]
    };

    const component = shallow(<ChartArea {...props} />);
    expect(component).toMatchSnapshot('variation');

    // check setChartTicks label increment and tick format directly
    component.setProps({
      xAxisLabelIncrement: 2,
      yAxisLabelIncrement: 2,
      xAxisTickFormat: lorem => `${lorem} ipsum`,
      yAxisTickFormat: dolor => `${dolor} sit`
    });
    expect(component.instance().setChartTicks()).toMatchSnapshot('setChartTicks');

    // check getChartTicks setting xAxisFixLabelOverlap and yAxisFixLabelOverlap directly
    component.setProps({
      xAxisFixLabelOverlap: true,
      yAxisFixLabelOverlap: true
    });
    expect(component.instance().getChartTicks()).toMatchSnapshot('getChartTicks');

    // check getChartDomain setting domain directly
    component.setProps({
      domain: {
        x: [0, 100],
        y: [0, 20]
      }
    });
    expect(component.instance().getChartDomain({ isXAxisTicks: false, isYAxisTicks: false })).toMatchSnapshot(
      'getChartDomain: domain'
    );

    // check getChartDomain: isYAxisTicks and isXAxisTicks
    component.setProps({
      domain: {}
    });
    expect(component.instance().getChartDomain({ isXAxisTicks: false, isYAxisTicks: true })).toMatchSnapshot(
      'getChartDomain: isYAxisTicks true'
    );
    expect(component.instance().getChartDomain({ isXAxisTicks: true, isYAxisTicks: false })).toMatchSnapshot(
      'getChartDomain: isXAxisTicks true'
    );

    // check getChartLegend
    expect(component.instance().getChartLegend()).toMatchSnapshot('getChartLegend');

    // check setChartTicks: xAxisLabelUseDataSet, yAxisLabelUseDataSet
    const additionalDataSet = [
      {
        data: [
          {
            x: 2,
            y: 1,
            tooltip: '1 hello world',
            xAxisLabel: '1 hello world x-axis label',
            yAxisLabel: '1 hello world y-axis label'
          }
        ],
        legendLabel: 'Hello world',
        xAxisLabelUseDataSet: true,
        yAxisLabelUseDataSet: true
      }
    ];
    component.setProps({
      dataSets: [...props.dataSets, ...additionalDataSet]
    });
    expect(component.instance().setChartTicks()).toMatchSnapshot(
      'setChartTicks: xAxisLabelUseDataSet, yAxisLabelUseDataSet'
    );
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

  it('should run componentWillUnmount method successfully', () => {
    const component = mount(<ChartArea />);
    const componentWillUnmount = jest.spyOn(component.instance(), 'componentWillUnmount');
    component.unmount();
    expect(componentWillUnmount).toHaveBeenCalled();
  });
});
