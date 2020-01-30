import moxios from 'moxios';
import { rhsmServices } from '../rhsmServices';

describe('RhsmServices', () => {
  beforeEach(() => {
    moxios.install();

    moxios.stubRequest(/\/(tally|capacity|version).*?/, {
      status: 200,
      responseText: 'success',
      timeout: 1
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should export a specific number of methods and classes', () => {
    expect(Object.keys(rhsmServices)).toHaveLength(3);
  });

  it('should have specific methods', () => {
    expect(rhsmServices.getApiVersion).toBeDefined();
    expect(rhsmServices.getGraphCapacity).toBeDefined();
    expect(rhsmServices.getGraphReports).toBeDefined();
  });

  /**
   *  timeout errors associated with this test sometimes stem from endpoint
   *  settings or missing globals, see "before" above, or the "setupTests" config
   */
  it('should return promises for every method', done => {
    const promises = Object.keys(rhsmServices).map(value => rhsmServices[value]());

    Promise.all(promises).then(success => {
      expect(success.length).toEqual(Object.keys(rhsmServices).length);
      done();
    });
  });
});
