import React from 'react';
import { GraphCard } from '../graphCard';

describe('GraphCard Component', () => {
  it('should setup basic settings', async () => {
    const props = {
      useParseFiltersSettings: () => ({
        filtersSettings: [
          {
            settings: {
              loremIpsum: true,
              metric: undefined,
              metrics: [
                {
                  chartType: 'area',
                  id: 'Sockets',
                  isCapacity: false,
                  isStacked: true,
                  loremIpsum: true,
                  isThreshold: false,
                  isToolbarFilter: false,
                  metric: 'Sockets',
                  strokeWidth: 2
                }
              ],
              padding: {
                bottom: 75,
                left: 75,
                right: 45,
                top: 45
              }
            }
          }
        ]
      })
    };
    const componentStandalone = await shallowHookComponent(<GraphCard {...props} />);
    expect(componentStandalone).toMatchSnapshot('settings, standalone');

    props.useParseFiltersSettings = () => ({
      filtersSettings: [
        {
          settings: {
            loremIpsum: false,
            isMetricDisplay: true,
            cards: [
              {
                header: 'lorem',
                body: 'ipsum',
                footer: 'dolor sit'
              }
            ],
            metric: undefined,
            metrics: [
              {
                chartType: 'area',
                id: 'Core-seconds',
                isCapacity: false,
                isStacked: true,
                loremIpsum: false,
                isThreshold: false,
                isToolbarFilter: false,
                metric: 'Core-seconds',
                strokeWidth: 2
              }
            ]
          }
        }
      ]
    });

    const componentGrouped = await shallowHookComponent(<GraphCard {...props} />);
    expect(componentGrouped).toMatchSnapshot('settings, grouped');
  });

  it('should allow being disabled', async () => {
    const props = {
      isDisabled: true
    };
    const component = await shallowHookComponent(<GraphCard {...props} />);
    expect(component).toMatchSnapshot('disabled');
  });
});
