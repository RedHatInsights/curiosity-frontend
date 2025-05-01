import { rhsmHelpers, billingMetrics } from '../rhsmHelpers';

describe('RhsmHelpers', () => {
  it('should have specific functions', () => {
    expect(rhsmHelpers).toMatchSnapshot('rhsmHelpers');
  });

  it.each([
    {
      description: 'basic',
      data: undefined
    },
    {
      description: 'multiple unique providers, multiple accounts',
      data: {
        loremApi: [
          { id: '123', provider: 'ipsum', type: 'loremApi' },
          { id: '456', provider: 'lorem', type: 'loremApi' },
          { id: '789', provider: 'lorem', type: 'loremApi' },
          { id: '012', provider: 'dolor', type: 'loremApi' }
        ],
        dolorApi: [{ id: '789', provider: 'lorem', type: 'dolorApi' }]
      }
    },
    {
      description: 'single provider, multiple accounts',
      data: {
        loremApi: [
          { id: '123', provider: 'lorem', type: 'loremApi' },
          { id: '456', provider: 'lorem', type: 'loremApi' },
          { id: '789', provider: 'lorem', type: 'loremApi' },
          { id: '012', provider: 'lorem', type: 'loremApi' }
        ],
        dolorApi: [{ id: '789', provider: 'lorem', type: 'dolorApi' }]
      }
    },
    {
      description: 'single unique provider, multiple accounts',
      data: {
        loremApi: [
          { id: '123', provider: 'lorem', type: 'loremApi' },
          { id: '456', provider: 'lorem', type: 'loremApi' },
          { id: '789', provider: 'dolor', type: 'loremApi' },
          { id: '012', provider: 'lorem', type: 'loremApi' }
        ],
        dolorApi: [{ id: '789', provider: 'dolor', type: 'dolorApi' }]
      }
    },
    {
      description: 'single provider, single account',
      data: {
        loremApi: [
          { id: '123', provider: 'lorem', type: 'loremApi' },
          { id: '789', provider: 'lorem', type: 'loremApi' }
        ],
        dolorApi: [{ id: '789', provider: 'lorem', type: 'dolorApi' }]
      }
    },
    {
      description: 'single unique provider, single account',
      data: {
        loremApi: [
          { id: '123', provider: 'lorem', type: 'loremApi' },
          { id: '789', provider: 'dolor', type: 'loremApi' }
        ],
        dolorApi: [{ id: '789', provider: 'dolor', type: 'dolorApi' }]
      }
    }
  ])('billingMetrics should return parsed API responses in a consumable metric format, $description', ({ data }) => {
    expect(billingMetrics(data)).toMatchSnapshot();
  });
});
