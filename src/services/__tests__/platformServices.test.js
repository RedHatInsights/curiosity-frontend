import { helpers } from '../../common';
import platformServices from '../platformServices';

describe('PlatformServices', () => {
  beforeAll(() => {
    window.insights = {
      chrome: {
        auth: helpers.noop,
        identifyApp: helpers.noop,
        init: helpers.noop,
        navigation: helpers.noop,
        on: helpers.noop
      }
    };
  });

  it('should export a specific number of methods and classes', () => {
    expect(Object.keys(platformServices)).toHaveLength(5);
  });

  it('should have specific methods', () => {
    expect(platformServices.getUser).toBeDefined();
    expect(platformServices.initializeChrome).toBeDefined();
    expect(platformServices.onNavigation).toBeDefined();
    expect(platformServices.setAppName).toBeDefined();
    expect(platformServices.setNavigation).toBeDefined();
  });

  /**
   *  timeout errors associated with this test sometimes stem from endpoint
   *  settings or missing globals, see "before" above
   */
  it('should return promises for every method', done => {
    const promises = Object.keys(platformServices).map(value => platformServices[value]());

    Promise.all(promises).then(success => {
      expect(success.length).toEqual(Object.keys(platformServices).length);
      done();
    });
  });

  it('should return a successful authorized user', done => {
    window.insights.chrome.auth.getUser = jest.fn().mockImplementation(() => Promise.resolve('lorem ipsum'));

    platformServices.getUser().then(value => {
      expect(value).toMatchSnapshot('success authorized user');
      done();
    });
  });

  it('should return a failed authorized user', done => {
    window.insights.chrome.auth.getUser = jest.fn().mockImplementation(() => undefined);

    platformServices.getUser().catch(error => {
      expect(error).toMatchSnapshot('failed authorized user');
      done();
    });
  });
});
