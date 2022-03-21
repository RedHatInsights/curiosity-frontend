import { serviceHelpers } from '../helpers';

describe('Service Helpers', () => {
  it('should have specific functions', () => {
    expect(serviceHelpers).toMatchSnapshot('serviceHelpers');
  });

  it('should support cancelling function calls', async () => {
    const mockTimeout = async (successMessage, errorMessage, pause, timeout) => {
      const testFn = async () => {
        await new Promise(resolve => {
          window.setTimeout(resolve, pause);
        });

        return successMessage;
      };

      let value;

      try {
        value = await serviceHelpers.timeoutFunctionCancel(testFn, { timeout, errorMessage });
      } catch (e) {
        value = e.message;
      }

      return value;
    };

    const success = await mockTimeout('lorem ipsum success', 'dolor sit error', 50, 100);
    const error = await mockTimeout('lorem ipsum success', 'dolor sit error', 100, 50);

    expect({ success, error }).toMatchSnapshot('timeout error');
  });

  it('should support camel casing obj keys', () => {
    expect(
      serviceHelpers.camelCase({
        lorem_ipsum: [
          {
            dolor_sit: [
              {
                hello_world: 1
              }
            ]
          }
        ]
      })
    ).toMatchSnapshot('camelCase');
  });

  it('should support applying data to a supplied callback', () => {
    const mockSchema = jest.fn();

    serviceHelpers.passDataToCallback({ hello: 'world' }, mockSchema);

    expect(mockSchema.mock.calls).toMatchSnapshot('passDataToCallback, success');

    mockSchema.mockClear();
  });

  it('should attempt to apply a Joi schema to a response', () => {
    const mockValidate = jest.fn().mockImplementation(response => ({ value: response }));

    serviceHelpers.schemaResponse({ schema: { validate: mockValidate }, response: { lorem_ipsum: 'dolor_sit' } });
    expect(mockValidate.mock.calls).toMatchSnapshot('schemaResponse, parameters');

    expect(
      serviceHelpers.schemaResponse({
        schema: { validate: mockValidate },
        response: { lorem_ipsum: 'dolor_sit' },
        casing: 'camel'
      })
    ).toMatchSnapshot('schemaResponse, camelCasing');
  });
});
