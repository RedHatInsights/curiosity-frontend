import React from 'react';
import { GraphCardMetricTotals } from '../graphCardMetricTotals';
import { translate } from '../../i18n/i18nHelpers';

describe('GraphCardMetricTotals Component', () => {
  it('should render a basic component', () => {
    const props = {
      children: 'lorem ipsum'
    };
    const component = renderComponent(<GraphCardMetricTotals {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should handle multiple display states', async () => {
    const props = {
      useGraphCardContext: () => ({
        children: 'lorem ipsum',
        settings: {
          isMetricDisplay: true,
          groupMetric: ['hello', 'world'],
          cards: [
            {
              header: 'lorem',
              body: 'ipsum',
              footer: 'dolor sit'
            }
          ]
        }
      }),
      useMetricsSelector: () => ({
        pending: true,
        error: false,
        fulfilled: false
      })
    };
    const component = await shallowComponent(<GraphCardMetricTotals {...props} />);

    expect(component).toMatchSnapshot('pending');

    const componentPending = await component.setProps({
      useMetricsSelector: () => ({
        pending: false,
        error: true,
        fulfilled: false
      })
    });

    expect(componentPending).toMatchSnapshot('error');

    const componentFulfilled = await component.setProps({
      useMetricsSelector: () => ({
        pending: false,
        error: false,
        fulfilled: true
      })
    });

    expect(componentFulfilled).toMatchSnapshot('fulfilled');
  });

  it('should handle custom card displays', () => {
    const props = {
      useGraphCardContext: () => ({
        children: 'lorem ipsum',
        settings: {
          isMetricDisplay: true,
          groupMetric: ['hello', 'world'],
          cards: [
            {
              header: 'lorem',
              body: passedValues =>
                translate('ipsum-{{data}}', { testId: 'custom test id', data: JSON.stringify(passedValues) }),
              footer: 'dolor sit timestamp'
            },
            {
              key: 'my custom react key',
              header: passedValues => `hello-${JSON.stringify(passedValues)}`,
              body: 'world',
              footer: 'dolor sit timestamp'
            },
            {
              header: 'dolor',
              body: 'sit',
              footer: passedValues => `dolor sit timestamp-${JSON.stringify(passedValues)}`
            }
          ]
        }
      }),
      useMetricsSelector: () => ({
        pending: false,
        error: false,
        fulfilled: true
      })
    };
    const component = renderComponent(<GraphCardMetricTotals {...props} />);
    expect(component).toMatchSnapshot('fulfilled');
  });
});
