import moxios from 'moxios';
import Cookies from 'js-cookie';
import userServices from '../userServices';

describe('UserServices', () => {
  beforeEach(() => {
    moxios.install();

    moxios.stubRequest(/\/(version).*?/, {
      status: 200,
      responseText: 'success',
      timeout: 1
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should export a specific number of methods and classes', () => {
    expect(Object.keys(userServices)).toHaveLength(4);
  });

  it('should have specific methods', () => {
    expect(userServices.authorizeUser).toBeDefined();
    expect(userServices.getApiVersion).toBeDefined();
    expect(userServices.getLocale).toBeDefined();
    expect(userServices.logoutUser).toBeDefined();
  });

  /**
   *  timeout errors associated with this test sometimes stem from endpoint
   *  settings, see "before each" regex above
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
});
