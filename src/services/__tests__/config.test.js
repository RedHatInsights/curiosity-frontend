import moxios from 'moxios';
import * as service from '../config';

describe('ServiceConfig', () => {
  beforeAll(() => {
    moxios.install();

    moxios.stubRequest(/\/test.*?/, {
      status: 200,
      responseText: 'success',
      timeout: 1
    });
  });

  afterAll(() => {
    moxios.uninstall();
  });

  it('should export a specific number of methods and classes', () => {
    expect(Object.keys(service)).toHaveLength(3);
  });

  it('should export a default services config', () => {
    const configObject = service.serviceConfig();

    expect(Object.keys(configObject.headers).length).toBe(0);
    expect(configObject.timeout).toBe(process.env.REACT_APP_AJAX_TIMEOUT);
  });

  it('should export a customized services config', () => {
    const configObject = service.serviceConfig({
      method: 'post',
      timeout: 3
    });

    expect(configObject.method).toBe('post');
    expect(configObject.timeout).toBe(3);
  });

  it('should handle a bundled authentication and service call', done => {
    service.serviceCall({ url: '/test/' }).then(success => {
      expect(success.data).toBe('success');
      done();
    });
  });
});
