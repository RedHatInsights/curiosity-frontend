import * as service from '../config';

describe('ServiceConfig', () => {
  it('should export a specific number of methods and classes', () => {
    expect(Object.keys(service)).toHaveLength(2);
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
});
