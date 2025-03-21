import moxios from 'moxios';
import platformServices from '../platformServices';

describe('PlatformServices', () => {
  beforeEach(() => {
    moxios.install();

    moxios.stubRequest(/\/(export).*?/, {
      status: 200,
      responseText: 'success',
      timeout: 1
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should export a specific  properties, methods and classes', () => {
    expect(platformServices).toMatchSnapshot('properties');
  });

  /**
   *  Notes:
   *  - Timeout errors associated with this test sometimes stem from endpoint
   *      settings or missing globals, see "before" above, or the "setupTests" config
   *  - Reset polling for testing
   */
  it('should return async for most methods and resolve successfully', async () => {
    const promises = Object.keys(platformServices).map(value =>
      platformServices[value](
        undefined,
        { poll: { location: undefined, status: undefined, validate: undefined } },
        { poll: { location: undefined, status: undefined, validate: undefined } }
      )
    );
    const response = await Promise.all(promises);

    expect(response.length).toEqual(Object.keys(platformServices).length);
  });

  it('should return a successful getUser', async () => {
    const { status, statusText, data, message } = await platformServices.getUser({ getUser: Function.prototype });

    expect({ status, statusText, data, message }).toMatchSnapshot('success authorized user');
  });

  it('should return a successful getUser with a specific response', async () => {
    const { status, statusText, data, message } = await platformServices.getUser({
      getUser: jest.fn().mockImplementation(() => Promise.resolve('lorem ipsum'))
    });

    expect({ status, statusText, data, message }).toMatchSnapshot('specific success for authorized user');
  });

  it('should return a failed getUser', async () => {
    await expect(
      platformServices.getUser({
        getUser: null
      })
    ).rejects.toMatchSnapshot('failed authorized user');
  });

  it('should return a failed getUserPermissions', async () => {
    await expect(
      platformServices.getUserPermissions(undefined, {
        getUserPermissions: null
      })
    ).rejects.toMatchSnapshot('failed user permissions');
  });
});
