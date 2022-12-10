import React from 'react';
import { GraphCard } from '../graphCard';

describe('GraphCard Component', () => {
  it('should render a default component', async () => {
    const component = await shallowHookComponent(<GraphCard />);
    expect(component).toMatchSnapshot('default');
  });

  it('should setup basic settings', async () => {
    const props = {
      useParseFiltersSettings: () => ({
        groupedFiltersSettings: {},
        standaloneFiltersSettings: [
          {
            settings: {
              isStandalone: true,
              metric: {
                chartType: 'area',
                id: 'Sockets',
                isCapacity: false,
                isStacked: true,
                isStandalone: true,
                isThreshold: false,
                isToolbarFilter: false,
                metric: 'Sockets',
                strokeWidth: 2
              },
              metrics: [
                {
                  chartType: 'area',
                  id: 'Sockets',
                  isCapacity: false,
                  isStacked: true,
                  isStandalone: true,
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
      groupedFiltersSettings: {
        settings: {
          isStandalone: false,
          metric: undefined,
          metrics: [
            {
              chartType: 'area',
              id: 'Core-seconds',
              isCapacity: false,
              isStacked: true,
              isStandalone: false,
              isThreshold: false,
              isToolbarFilter: false,
              metric: 'Core-seconds',
              strokeWidth: 2
            }
          ]
        }
      },
      standaloneFiltersSettings: []
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
