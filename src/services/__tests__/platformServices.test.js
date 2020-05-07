import platformServices from '../platformServices';

describe('PlatformServices', () => {
  it('should export a specific number of methods and classes', () => {
    expect(Object.keys(platformServices)).toHaveLength(6);
  });

  it('should have specific methods', () => {
    expect(platformServices.getUser).toBeDefined();
    expect(platformServices.getUserPermissions).toBeDefined();
    expect(platformServices.initializeChrome).toBeDefined();
    expect(platformServices.onNavigation).toBeDefined();
    expect(platformServices.setAppName).toBeDefined();
    expect(platformServices.setNavigation).toBeDefined();
  });

  /**
   *  timeout errors associated with this test sometimes stem from endpoint
   *  settings or missing globals, see "before" above, or the "setupTests" config
   */
  it('should return async for most methods and resolve successfully', done => {
    const promises = Object.keys(platformServices).map(value => platformServices[value]());

    Promise.all(promises).then(success => {
      expect(success.length).toEqual(Object.keys(platformServices).length);
      done();
    });
  });

  it('should return a successful getUser', done => {
    platformServices.getUser().then(value => {
      expect(value).toMatchSnapshot('success authorized user');
      done();
    });
  });

  it('should return a successful getUser with a specific response', done => {
    window.insights.chrome.auth.getUser = jest.fn().mockImplementation(() => Promise.resolve('lorem ipsum'));

    platformServices.getUser().then(value => {
      expect(value).toMatchSnapshot('specific success for authorized user');
      done();
    });
  });

  it('should return a failed getUser', done => {
    window.insights.chrome.auth.getUser = undefined;

    platformServices.getUser().catch(error => {
      expect(error).toMatchSnapshot('failed authorized user');
      done();
    });
  });

  it('should return a failed getUserPermissions', () => {
    window.insights.chrome.getUserPermissions = undefined;

    expect(platformServices.getUserPermissions).toThrowError(
      '{ getUserPermissions } = insights.chrome, insights.chrome.getUserPermissions is not a function'
    );
  });

  it('should return a failed initializeChrome', done => {
    window.insights.chrome.init = undefined;

    platformServices.initializeChrome().catch(error => {
      expect(error).toMatchSnapshot('failed initializeChrome');
      done();
    });
  });

  it('should return a failed onNavigation', () => {
    window.insights.chrome.on = undefined;
    expect(platformServices.onNavigation).toThrowError(
      '{ on } = insights.chrome, insights.chrome.on is not a function'
    );
  });

  it('should return a failed setAppName', done => {
    window.insights.chrome.identifyApp = undefined;

    platformServices.setAppName().catch(error => {
      expect(error).toMatchSnapshot('failed setAppName');
      done();
    });
  });

  it('should return a failed setNavigation', () => {
    window.insights.chrome.navigation = undefined;
    expect(platformServices.setNavigation).toThrowError(
      '{ navigation } = insights.chrome, insights.chrome.navigation is not a function'
    );
  });
});
