import moxios from 'moxios';
import rhelServices from '../rhelServices';

describe('RhelServices', () => {
  beforeEach(() => {
    moxios.install();

    moxios.stubRequest(/\/cloudigrade.*?/, {
      status: 200,
      responseText: 'success',
      timeout: 1
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should export a specific number of methods and classes', () => {
    expect(Object.keys(rhelServices)).toHaveLength(1);
  });

  it('should have specific methods', () => {
    expect(rhelServices.getGraphReports).toBeDefined();
  });

  it('should return promises for every method', done => {
    const promises = Object.keys(rhelServices).map(value => rhelServices[value]());

    Promise.all(promises).then(success => {
      expect(success.length).toEqual(Object.keys(rhelServices).length);
      done();
    });
  });
});
