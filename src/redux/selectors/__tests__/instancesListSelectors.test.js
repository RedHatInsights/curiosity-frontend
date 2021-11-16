import instancesListSelectors from '../instancesListSelectors';

describe('InstancesListSelectors', () => {
  it('should return specific selectors', () => {
    expect(instancesListSelectors).toMatchSnapshot('selectors');
  });

  it('should pass minimal data on missing a reducer response', () => {
    const state = {};
    expect(instancesListSelectors.instancesList(state)).toMatchSnapshot('missing reducer error');
  });

  it('should pass existing state data through response', () => {
    const state = {
      inventory: {
        instancesInventory: {
          loremIpsum: {
            testing: 'lorem ipsum',
            data: {
              data: [],
              meta: 'meta field'
            }
          }
        }
      }
    };
    const props = {
      productId: 'loremIpsum'
    };

    expect(instancesListSelectors.instancesList(state, props)).toMatchSnapshot('existing state data');
  });

  it('should pass existing query data through response', () => {
    const state = {
      inventory: {
        instancesInventory: {
          loremIpsum: {}
        }
      },
      view: {
        query: { loremIpsum: { d: 'e' } },
        inventoryHostsQuery: { dolorSit: { a: 'b' }, loremIpsum: { c: 'd' } }
      }
    };
    const props = {
      productId: 'loremIpsum',
      viewId: 'dolorSit'
    };

    expect(instancesListSelectors.instancesList(state, props)).toMatchSnapshot('existing query data');
  });
});
