import React from 'react';
import { GraphCardChartTooltip } from '../graphCardChartTooltip';
import { ChartTypeVariant } from '../../chart/chart';
import {
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_SET_TYPES
} from '../../../services/rhsm/rhsmConstants';

describe('GraphCardChartTooltip Component', () => {
  it('should render a basic component', () => {
    const props = {
      useProductGraphTallyQuery: () => ({ [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY })
    };
    const component = renderComponent(<GraphCardChartTooltip {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should render basic data', () => {
    const props = {
      datum: {
        itemsByKey: {
          loremIpsum: {
            color: '#ffffff',
            data: {
              date: '2019-06-01T00:00:00Z',
              hasData: true,
              hasInfinite: false,
              y: 0
            }
          },
          dolorSit: {
            data: {
              date: '2019-06-01T00:00:00Z',
              hasData: true,
              hasInfinite: false,
              y: 1
            }
          }
        }
      },
      useProductGraphTallyQuery: () => ({ [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY })
    };

    const component = renderComponent(<GraphCardChartTooltip {...props} />);
    expect(component).toMatchSnapshot('data');
  });

  it('should return a formatted tooltip based on data and granularity', () => {
    const itemsByKey = {};

    const daily = () =>
      renderComponent(
        <GraphCardChartTooltip
          datum={{ itemsByKey }}
          useProductGraphTallyQuery={() => ({ [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY })}
        />
      ).find('td');
    const weekly = () =>
      renderComponent(
        <GraphCardChartTooltip
          datum={{ itemsByKey }}
          useProductGraphTallyQuery={() => ({ [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: GRANULARITY_TYPES.WEEKLY })}
        />
      ).find('td');
    const monthly = () =>
      renderComponent(
        <GraphCardChartTooltip
          datum={{ itemsByKey }}
          useProductGraphTallyQuery={() => ({ [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: GRANULARITY_TYPES.MONTHLY })}
        />
      ).find('td');
    const quarterly = () =>
      renderComponent(
        <GraphCardChartTooltip
          datum={{ itemsByKey }}
          useProductGraphTallyQuery={() => ({ [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: GRANULARITY_TYPES.QUARTERLY })}
        />
      ).find('td');

    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'no data granularity data display'
    );

    // report value > 0
    itemsByKey.hypervisorSockets = { data: { x: 0, y: 50, date: '2019-06-01T00:00:00Z', hasData: undefined } };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'data display > 0 and UNDEFINED hasData on report'
    );

    itemsByKey.hypervisorSockets = { data: { x: 0, y: 50, date: '2019-06-01T00:00:00Z', hasData: false } };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'data display > 0 and NOT hasData on report'
    );

    itemsByKey.hypervisorSockets = { data: { x: 0, y: 50, date: '2019-06-01T00:00:00Z', hasData: true } };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'data display > 0 and hasData on report'
    );

    // report value = 0
    itemsByKey.hypervisorSockets = { data: { x: 0, y: 0, date: '2019-06-01T00:00:00Z', hasData: undefined } };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'data display for zero and UNDEFINED hasData on report'
    );

    itemsByKey.hypervisorSockets = { data: { x: 0, y: 0, date: '2019-06-01T00:00:00Z', hasData: false } };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'data display for zero and NOT hasData on report'
    );

    itemsByKey.hypervisorSockets = { data: { x: 0, y: 0, date: '2019-06-01T00:00:00Z', hasData: true } };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'data display for zero and hasData on report'
    );

    // report value = null
    itemsByKey.hypervisorSockets = { data: { x: 0, y: null, date: '2019-06-01T00:00:00Z', hasData: undefined } };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'data display for null and UNDEFINED hasData on report'
    );

    itemsByKey.hypervisorSockets = { data: { x: 0, y: null, date: '2019-06-01T00:00:00Z', hasData: false } };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'data display for null and NOT hasData on report'
    );

    itemsByKey.hypervisorSockets = { data: { x: 0, y: null, date: '2019-06-01T00:00:00Z', hasData: true } };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'data display for null and hasData on report'
    );

    delete itemsByKey.hypervisorSockets;

    // threshold value > 0
    itemsByKey.threshold = {
      chartType: ChartTypeVariant.threshold,
      data: { x: 0, y: 100, date: '2019-06-01T00:00:00Z', hasInfinite: undefined }
    };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'threshold display for > 0 and UNDEFINED hasInfinite on threshold'
    );

    itemsByKey.threshold = {
      chartType: ChartTypeVariant.threshold,
      data: { x: 0, y: 100, date: '2019-06-01T00:00:00Z', hasInfinite: false }
    };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'threshold display for > 0 and NOT hasInfinite on threshold'
    );

    itemsByKey.threshold = {
      chartType: ChartTypeVariant.threshold,
      data: { x: 0, y: 100, date: '2019-06-01T00:00:00Z', hasInfinite: true }
    };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'threshold display for > 0 and hasInfinite on threshold'
    );

    // threshold value = 0
    itemsByKey.threshold = {
      chartType: ChartTypeVariant.threshold,
      data: { x: 0, y: 0, date: '2019-06-01T00:00:00Z', hasInfinite: undefined }
    };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'threshold display for zero and UNDEFINED hasInfinite on threshold'
    );

    itemsByKey.threshold = {
      chartType: ChartTypeVariant.threshold,
      data: { x: 0, y: 0, date: '2019-06-01T00:00:00Z', hasInfinite: false }
    };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'threshold display for zero and NOT hasInfinite on threshold'
    );

    itemsByKey.threshold = {
      chartType: ChartTypeVariant.threshold,
      data: { x: 0, y: 0, date: '2019-06-01T00:00:00Z', hasInfinite: true }
    };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'threshold display for zero and hasInfinite on threshold'
    );

    // threshold value = null
    itemsByKey.threshold = {
      chartType: ChartTypeVariant.threshold,
      data: { x: 0, y: null, date: '2019-06-01T00:00:00Z', hasInfinite: undefined }
    };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'threshold display for null and UNDEFINED hasInfinite on threshold'
    );

    itemsByKey.threshold = {
      chartType: ChartTypeVariant.threshold,
      data: { x: 0, y: null, date: '2019-06-01T00:00:00Z', hasInfinite: false }
    };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'threshold display for null and NOT hasInfinite on threshold'
    );

    itemsByKey.threshold = {
      chartType: ChartTypeVariant.threshold,
      data: { x: 0, y: null, date: '2019-06-01T00:00:00Z', hasInfinite: true }
    };
    expect({ daily: daily(), weekly: weekly(), monthly: monthly(), quarterly: quarterly() }).toMatchSnapshot(
      'threshold display for null and hasInfinite on threshold'
    );
  });
});
