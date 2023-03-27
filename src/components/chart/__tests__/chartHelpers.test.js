/* eslint-disable no-unsafe-optional-chaining */
import { chartHelpers } from '../chartHelpers';

describe('ChartHelpers', () => {
  it('should return specific properties', () => {
    expect(chartHelpers).toMatchSnapshot('specific properties');
  });

  it('should generate a max x, max y from datasets', () => {
    const options = {
      dataSets: [
        {
          id: 'lorem',
          data: [
            { x: 0, y: 10 },
            { x: 1, y: 10 },
            { x: 2, y: 10 },
            { x: 3, y: 10 },
            { x: 4, y: 10 },
            { x: 5, y: 10 }
          ]
        },
        {
          id: 'ipsum',
          isStacked: true,
          data: [
            { x: 0, y: 20 },
            { x: 1, y: 10 },
            { x: 2, y: 30 },
            { x: 3, y: 50 },
            { x: 4, y: 100 },
            { x: 5, y: 10 }
          ]
        },
        {
          id: 'dolor',
          isStacked: true,
          data: [
            { x: 0, y: 20 },
            { x: 1, y: 10 },
            { x: 2, y: 30 },
            { x: 3, y: 50 },
            { x: 4, y: 100 },
            { x: 5, y: 10 }
          ]
        }
      ]
    };

    expect(chartHelpers.generateMaxXY(options)).toMatchSnapshot('max x, y');
  });

  it('should generate domain ranges', () => {
    const options = {
      maxY: 200
    };

    expect(chartHelpers.generateDomains(options)).toMatchSnapshot('domain, maxY number');

    options.maxY = {
      lorem: 10,
      ipsum: 100,
      dolor: 100
    };
    expect(chartHelpers.generateDomains(options)).toMatchSnapshot('domain, maxY object');

    options.maxY = 0.01;

    expect(chartHelpers.generateDomains(options)).toMatchSnapshot('domain, maxY less than 0.1');
  });

  it('should generate element props', () => {
    const options = {
      dataSets: [
        {
          id: 'lorem',
          data: [
            { x: 0, y: 10 },
            { x: 1, y: 10 },
            { x: 2, y: 10 },
            { x: 3, y: 10 },
            { x: 4, y: 10 },
            { x: 5, y: 10 }
          ]
        },
        {
          id: 'ipsum',
          isStacked: true,
          data: [
            { x: 0, y: 20 },
            { x: 1, y: 10 },
            { x: 2, y: 30 },
            { x: 3, y: 50 },
            { x: 4, y: 100 },
            { x: 5, y: 10 }
          ]
        },
        {
          id: 'dolor',
          isStacked: true,
          interpolation: 'lorem ipsum interpolation',
          animate: true,
          data: [
            { x: 0, y: 20 },
            { x: 1, y: 10 },
            { x: 2, y: 30 },
            { x: 3, y: 50 },
            { x: 4, y: 100 },
            { x: 5, y: 10 }
          ]
        }
      ],
      maxX: 6,
      maxY: 200
    };

    expect(chartHelpers.generateElementsProps(options)).toMatchSnapshot('props');

    const customOptions = {
      dataSets: [
        {
          id: 'lorem',
          data: [
            { x: 0, y: 10 },
            { x: 1, y: 10 },
            { x: 2, y: 10 },
            { x: 3, y: 10 },
            { x: 4, y: 10 },
            { x: 5, y: 10 }
          ]
        }
      ]
    };

    const { x: xValueNumber, y: yValueNumber } = chartHelpers.generateElementsProps({
      ...customOptions,
      xValueFormat: () => 0,
      yValueFormat: () => 0
    })?.elementsById.lorem.props;
    const { x: xValueNaN, y: yValueNaN } = chartHelpers.generateElementsProps({
      ...customOptions,
      xValueFormat: () => Number.NaN,
      yValueFormat: () => Number.NaN
    })?.elementsById.lorem.props;
    const { x: xValueUndefined, y: yValueUndefined } = chartHelpers.generateElementsProps({
      ...customOptions,
      xValueFormat: () => undefined,
      yValueFormat: () => undefined
    })?.elementsById.lorem.props;
    const { x: xValueNull, y: yValueNull } = chartHelpers.generateElementsProps({
      ...customOptions,
      xValueFormat: () => null,
      yValueFormat: () => null
    })?.elementsById.lorem.props;
    const { x: xValueString, y: yValueString } = chartHelpers.generateElementsProps({
      ...customOptions,
      xValueFormat: () => 'lorem',
      yValueFormat: () => 'ipsum'
    })?.elementsById.lorem.props;

    expect({
      xValueNumber: xValueNumber(),
      yValueNumber: yValueNumber(),
      xValueNaN: xValueNaN(),
      yValueNaN: yValueNaN(),
      xValueUndefined: xValueUndefined(),
      yValueUndefined: yValueUndefined(),
      xValueNull: xValueNull(),
      yValueNull: yValueNull(),
      xValueString: xValueString(),
      yValueString: yValueString()
    }).toMatchSnapshot('custom valueFormats');
  });

  it('should generate tooltip data/content', () => {
    const mockContent = jest.fn();
    const options = {
      content: mockContent,
      dataSets: [
        {
          id: 'lorem',
          data: [
            { x: 0, y: 10 },
            { x: 1, y: 10 },
            { x: 2, y: 10 },
            { x: 3, y: 10 },
            { x: 4, y: 10 },
            { x: 5, y: 10 }
          ]
        },
        {
          id: 'ipsum',
          isStacked: true,
          data: [
            { x: 0, y: 20 },
            { x: 1, y: 10 },
            { x: 2, y: 30 },
            { x: 3, y: 50 },
            { x: 4, y: 100 },
            { x: 5, y: 10 }
          ]
        },
        {
          id: 'dolor',
          isStacked: true,
          data: [
            { x: 0, y: 20 },
            { x: 1, y: 10 },
            { x: 2, y: 30 },
            { x: 3, y: 50 },
            { x: 4, y: 100 },
            { x: 5, y: 10 }
          ]
        }
      ]
    };

    expect(chartHelpers.generateTooltipData(options)).toMatchSnapshot('tooltip, settings');
    expect(mockContent.mock.calls).toMatchSnapshot('tooltip, content');
  });

  it('should generate x axis props', () => {
    const mockFormat = jest.fn();
    const options = {
      xAxisTickFormat: mockFormat,
      maxX: 6,
      xAxisLabelIncrement: 1,
      dataSet: {
        id: 'lorem',
        data: [
          {
            x: 0,
            y: 0,
            date: '2023-02-12T00:00:00.000Z',
            hasData: false,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 1,
            y: 0,
            date: '2023-02-13T00:00:00.000Z',
            hasData: false,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 2,
            y: 0,
            date: '2023-02-14T00:00:00.000Z',
            hasData: false,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 3,
            y: 0,
            date: '2023-02-15T00:00:00.000Z',
            hasData: false,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 4,
            y: 0,
            date: '2023-02-16T00:00:00.000Z',
            hasData: false,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 5,
            y: 0,
            date: '2023-02-17T00:00:00.000Z',
            hasData: false,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 6,
            y: 0,
            date: '2023-02-18T00:00:00.000Z',
            hasData: false,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 7,
            y: 0,
            date: '2023-02-19T00:00:00.000Z',
            hasData: false,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 8,
            y: 0,
            date: '2023-02-20T00:00:00.000Z',
            hasData: false,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 9,
            y: 0,
            date: '2023-02-21T00:00:00.000Z',
            hasData: true,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 10,
            y: 0,
            date: '2023-02-22T00:00:00.000Z',
            hasData: true,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 11,
            y: 0,
            date: '2023-02-23T00:00:00.000Z',
            hasData: true,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 12,
            y: 0,
            date: '2023-02-24T00:00:00.000Z',
            hasData: true,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 13,
            y: 0,
            date: '2023-02-25T00:00:00.000Z',
            hasData: true,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 14,
            y: 0,
            date: '2023-02-26T00:00:00.000Z',
            hasData: true,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 15,
            y: 0,
            date: '2023-02-27T00:00:00.000Z',
            hasData: true,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 16,
            y: 0,
            date: '2023-02-28T00:00:00.000Z',
            hasData: true,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 17,
            y: 0,
            date: '2023-03-01T00:00:00.000Z',
            hasData: true,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 18,
            y: 0,
            date: '2023-03-02T00:00:00.000Z',
            hasData: false,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 19,
            y: 0,
            date: '2023-03-03T00:00:00.000Z',
            hasData: true,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 20,
            y: 0,
            date: '2023-03-04T00:00:00.000Z',
            hasData: true,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 21,
            y: 0,
            date: '2023-03-05T00:00:00.000Z',
            hasData: true,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 22,
            y: 1,
            date: '2023-03-06T00:00:00.000Z',
            hasData: true,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 23,
            y: 1,
            date: '2023-03-07T00:00:00.000Z',
            hasData: true,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 24,
            y: 1,
            date: '2023-03-08T00:00:00.000Z',
            hasData: true,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 25,
            y: 1,
            date: '2023-03-09T00:00:00.000Z',
            hasData: true,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 26,
            y: 1,
            date: '2023-03-10T00:00:00.000Z',
            hasData: true,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 27,
            y: 0,
            date: '2023-03-11T00:00:00.000Z',
            hasData: true,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 28,
            y: 0,
            date: '2023-03-12T00:00:00.000Z',
            hasData: true,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 29,
            y: 0,
            date: '2023-03-13T00:00:00.000Z',
            hasData: true,
            isCurrentDate: false,
            isFutureDate: false
          },
          {
            x: 30,
            y: 0,
            date: '2023-03-14T00:00:00.000Z',
            hasData: true,
            isCurrentDate: true,
            isFutureDate: false
          }
        ]
      }
    };

    const generatedProps = chartHelpers.generateXAxisProps(options);
    expect(generatedProps).toMatchSnapshot('props');
    generatedProps.tickValues.forEach((value, index) => generatedProps.tickFormat(index));

    expect(mockFormat.mock.calls).toMatchSnapshot('format callback');
  });

  it('should generate y axis props', () => {
    const mockFormat = jest.fn();
    const options = {
      yAxisTickFormat: mockFormat,
      maxY: {
        lorem: 10,
        ipsum: 100
      },
      dataSets: [
        {
          id: 'lorem',
          data: [
            { x: 0, y: 10 },
            { x: 1, y: 10 },
            { x: 2, y: 10 },
            { x: 3, y: 10 },
            { x: 4, y: 10 },
            { x: 5, y: 10 }
          ]
        },
        {
          id: 'ipsum',
          stroke: 'lorem ipsum stroke',
          strokeWidth: 2,
          data: [
            { x: 0, y: 20 },
            { x: 1, y: 10 },
            { x: 2, y: 30 },
            { x: 3, y: 50 },
            { x: 4, y: 100 },
            { x: 5, y: 10 }
          ]
        }
      ]
    };

    const generatedProps = chartHelpers.generateYAxisProps(options);
    expect(generatedProps).toMatchSnapshot('props');

    generatedProps[0].tickFormat(1);
    expect(mockFormat.mock.calls[0]).toMatchSnapshot('format callback, 0, left axis');

    generatedProps[1].tickFormat(1);
    expect(mockFormat.mock.calls[1]).toMatchSnapshot('format callback, 1, right axis');
  });

  it('should aggregated generated x,y axis props', () => {
    const options = {};

    expect(chartHelpers.generateAxisProps(options)).toMatchSnapshot('default settings');
  });
});
