import moxios from 'moxios';
import rhelServices from '../rhelServices';

describe('RhelServices', () => {
  beforeEach(() => {
    moxios.install();

    moxios.stubRequest(/\/(tally|capacity).*?/, {
      status: 200,
      responseText: 'success',
      timeout: 1
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should export a specific number of methods and classes', () => {
    expect(Object.keys(rhelServices)).toHaveLength(2);
  });

  it('should have specific methods', () => {
    expect(rhelServices.getGraphCapacityRhel).toBeDefined();
    expect(rhelServices.getGraphReportsRhel).toBeDefined();
  });

  /**
   *  timeout errors associated with this test sometimes stem from endpoint
   *  settings, see "before each" regex above
   */
  it('should return promises for every method', done => {
    const promises = Object.keys(rhelServices).map(value => rhelServices[value]());

    Promise.all(promises).then(success => {
      expect(success.length).toEqual(Object.keys(rhelServices).length);
      done();
    });
  });
});
