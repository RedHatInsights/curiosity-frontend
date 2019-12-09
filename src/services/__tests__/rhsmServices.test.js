import moxios from 'moxios';
import { rhsmServices } from '../rhsmServices';

describe('RhsmServices', () => {
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
    expect(Object.keys(rhsmServices)).toHaveLength(2);
  });

  it('should have specific methods', () => {
    expect(rhsmServices.getGraphCapacity).toBeDefined();
    expect(rhsmServices.getGraphReports).toBeDefined();
  });

  /**
   *  timeout errors associated with this test sometimes stem from endpoint
   *  settings, see "before each" regex above
   */
  it('should return promises for every method', done => {
    const promises = Object.keys(rhsmServices).map(value => rhsmServices[value]());

    Promise.all(promises).then(success => {
      expect(success.length).toEqual(Object.keys(rhsmServices).length);
      done();
    });
  });
});
