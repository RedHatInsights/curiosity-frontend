import React from 'react';
import { Chart } from '../chart';
import * as chartContext from '../chartContext';

describe('Chart Component', () => {
  it('should render a basic component', async () => {
    const props = {};
    const component = await shallowComponent(<Chart {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should setup basic chart settings', async () => {
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

    const mockValue = jest.fn();
    const mock = mockObjectProperty(chartContext.ChartContext, 'Provider', value => {
      mockValue(value);
      return null;
    });

    renderComponent(<Chart {...props} />);
    expect(mockValue.mock.calls).toMatchSnapshot('settings');

    mock.mockClear();
  });
});
