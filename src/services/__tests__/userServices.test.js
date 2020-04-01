import Cookies from 'js-cookie';
import moxios from 'moxios';
import userServices from '../userServices';

describe('UserServices', () => {
  beforeEach(() => {
    moxios.install();

    moxios.stubRequest(/\/(opt-in).*?/, {
      status: 200,
      responseText: 'success',
      timeout: 1
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should export a specific number of methods and classes', () => {
    expect(Object.keys(userServices)).toHaveLength(6);
  });

  it('should have specific methods', () => {
    expect(userServices.authorizeUser).toBeDefined();
    expect(userServices.getLocale).toBeDefined();
    expect(userServices.logoutUser).toBeDefined();
    expect(userServices.deleteAccountOptIn).toBeDefined();
    expect(userServices.getAccountOptIn).toBeDefined();
    expect(userServices.updateAccountOptIn).toBeDefined();
  });

  /**
   *  timeout errors associated with this test sometimes stem from endpoint
   *  settings or missing globals, see "before" above, or the "setupTests" config
   */
  it('should return promises for every method', done => {
    const promises = Object.keys(userServices).map(value => userServices[value]());

    Promise.all(promises).then(success => {
      expect(success.length).toEqual(Object.keys(userServices).length);
      done();
    });
  });

  it('should return default locale if no locale cookie is present', done => {
    userServices.getLocale().then(locale => {
      expect(locale).toMatchSnapshot();
      done();
    });
  });

  it('should return a specific locale cookie value', done => {
    Cookies.get = jest.fn().mockImplementation(() => 'en_US');
    userServices.getLocale().then(locale => {
      expect(locale).toMatchSnapshot();
      done();
    });
  });

  it('should return the default locale with an invalid ISO_639 code', done => {
    Cookies.get = jest.fn().mockImplementation(() => 'test_US');
    userServices.getLocale().then(locale => {
      expect(locale).toMatchSnapshot();
      done();
    });
  });

  it('should return a successful authorized user', done => {
    userServices.authorizeUser().then(value => {
      expect(value).toMatchSnapshot('success authorized user');
      done();
    });
  });

  it('should return a failed authorized user', done => {
    window.insights.chrome.auth.getUser = undefined;

    userServices.authorizeUser().catch(error => {
      expect(error).toMatchSnapshot('failed authorized user');
      done();
    });
  });

  it('should return a failed authorized user on empty response', done => {
    window.insights.chrome.auth.getUser = jest.fn().mockImplementation(() => ({}));

    userServices.authorizeUser().catch(error => {
      expect(error).toMatchSnapshot('failed authorized user: empty object');
      done();
    });
  });

  it('should return a failed authorized user on an unexpected response', done => {
    window.insights.chrome.auth.getUser = jest.fn().mockImplementation(() => 'lorem ipsum');

    userServices.authorizeUser().catch(error => {
      expect(error).toMatchSnapshot('failed authorized user: unexpected');
      done();
    });
  });
});
