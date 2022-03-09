import moxios from 'moxios';
import { config } from '../config';

describe('Services Configuration', () => {
  // Return a promise, or promise like, response for errors
  const returnPromiseAsync = async promiseAsyncCall => {
    let response;

    try {
      response = await promiseAsyncCall();
    } catch (e) {
      response = e.response || e.message || e;
    }

    return response;
  };

  beforeAll(() => {
    moxios.install();

    moxios.stubRequest(/\/test.*?/, {
      status: 200,
      responseText: 'success',
      timeout: 1
    });

    moxios.stubRequest(/\/error.*?/, {
      status: 404,
      responseText: 'error',
      timeout: 1
    });
  });

  afterAll(() => {
    moxios.uninstall();
  });

  it('should have specific properties and methods', () => {
    expect(Object.keys(config)).toMatchSnapshot('specific props and methods');
  });

  it('should export a default and customized services config', () => {
    const defaultObj = config.serviceConfig();
    const customObj = config.serviceConfig({
      method: 'post',
      timeout: 3
    });

    expect(defaultObj.headers).toBeDefined();
    expect(customObj.method).toBe('post');
    expect(customObj.timeout).toBe(3);
  });

  it('should handle a bundled authentication and service call', async () => {
    const responses = [];

    const { data: responseOneData } = await returnPromiseAsync(async () => config.serviceCall({ url: '/test/' }));
    responses.push({ data: responseOneData });

    const { data: responseTwoData } = await returnPromiseAsync(async () => config.serviceCall({ url: '/error/' }));
    responses.push({ data: responseTwoData });

    expect(responses).toMatchSnapshot('responses');
  });
});
