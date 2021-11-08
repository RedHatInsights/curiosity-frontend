import moxios from 'moxios';
import { rhsmServices } from '../rhsmServices';

describe('RhsmServices', () => {
  beforeEach(() => {
    moxios.install();

    moxios.stubRequest(/\/(tally|capacity|hosts|subscriptions|version).*?/, {
      status: 200,
      responseText: 'success',
      timeout: 1
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should export a specific number of methods and classes', () => {
    expect(Object.keys(rhsmServices)).toHaveLength(7);
  });

  it('should have specific methods', () => {
    expect(rhsmServices.getApiVersion).toBeDefined();
    expect(rhsmServices.getGraphCapacity).toBeDefined();
    expect(rhsmServices.getGraphReports).toBeDefined();
    expect(rhsmServices.getGraphTally).toBeDefined();
    expect(rhsmServices.getHostsInventory).toBeDefined();
    expect(rhsmServices.getHostsInventoryGuests).toBeDefined();
    expect(rhsmServices.getSubscriptionsInventory).toBeDefined();
  });

  /**
   *  timeout errors associated with this test sometimes stem from endpoint
   *  settings or missing globals, see "before" above, or the "setupTests" config
   */
  it('should return promises for every method', async () => {
    const promises = Object.keys(rhsmServices).map(value => rhsmServices[value]());
    const response = await Promise.all(promises);

    expect(response.length).toEqual(Object.keys(rhsmServices).length);
  });
});
