import Cookies from 'js-cookie';
import moxios from 'moxios';
import userServices from '../userServices';

describe('UserServices', () => {
  // Return a promise, or promise like, response for errors
  const returnPromiseAsync = async promiseAsyncCall => {
    let response;

    try {
      response = await promiseAsyncCall();
    } catch (e) {
      response = e;
    }

    return response;
  };

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
  it('should return promises for every method', async () => {
    const promises = Object.keys(userServices).map(value => userServices[value]());
    const response = await Promise.all(promises);

    expect(response.length).toEqual(Object.keys(userServices).length);
  });

  it('should return default locale if no locale cookie is present', async () => {
    const response = await userServices.getLocale();

    expect(response).toMatchSnapshot();
  });

  it('should return a specific locale cookie value', async () => {
    Cookies.get = jest.fn().mockImplementation(() => 'en_US');
    const response = await userServices.getLocale();

    expect(response).toMatchSnapshot();
  });

  it('should return the default locale with an invalid ISO_639 code', async () => {
    Cookies.get = jest.fn().mockImplementation(() => 'test_US');
    const response = await userServices.getLocale();

    expect(response).toMatchSnapshot();
  });

  it('should return a successful authorized user', async () => {
    const response = await userServices.authorizeUser();

    expect(response).toMatchSnapshot('success authorized user');
  });

  it('should return a failed authorized user', async () => {
    window.insights.chrome.auth.getUser = undefined;
    const response = await returnPromiseAsync(userServices.authorizeUser);

    expect(response).toMatchSnapshot('failed authorized user');
  });

  it('should return a failed authorized user on empty response', async () => {
    window.insights.chrome.auth.getUser = jest.fn().mockImplementation(() => ({}));
    const response = await returnPromiseAsync(userServices.authorizeUser);

    expect(response).toMatchSnapshot('failed authorized user: empty object');
  });

  it('should return a failed authorized user on an unexpected response', async () => {
    window.insights.chrome.auth.getUser = jest.fn().mockImplementation(() => 'lorem ipsum');
    const response = await returnPromiseAsync(userServices.authorizeUser);

    expect(response).toMatchSnapshot('failed authorized user: unexpected');
  });
});
