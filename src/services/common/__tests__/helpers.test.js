import { serviceHelpers } from '../helpers';

describe('Service Helpers', () => {
  it('should have specific functions', () => {
    expect(Object.keys(serviceHelpers)).toEqual([
      'camelCase',
      'generateHash',
      'memoClone',
      'passDataToCallback',
      'schemaResponse',
      'timeoutFunctionCancel'
    ]);
    Object.values(serviceHelpers).forEach(helper => {
      expect(helper).toEqual(expect.any(Function));
    });
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

    expect(success).toBe('lorem ipsum success');
    expect(error).toBe('dolor sit error');
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
    ).toEqual({
      loremIpsum: [
        {
          dolorSit: [
            {
              helloWorld: 1
            }
          ]
        }
      ]
    });
  });

  it('should support applying data to a supplied callback', () => {
    const mockSchema = jest.fn();

    serviceHelpers.passDataToCallback(mockSchema, { hello: 'world' }, 'lorem ipsum');

    expect(mockSchema).toHaveBeenCalledTimes(1);
    expect(mockSchema).toHaveBeenCalledWith({ hello: 'world' }, 'lorem ipsum');

    const failed = serviceHelpers.passDataToCallback(
      () => {
        throw new Error('hello world');
      },
      { dolor: 'sit' }
    );

    expect(failed.data).toEqual([{ dolor: 'sit' }]);
    expect(failed.error).toBeInstanceOf(Error);
    expect(failed.error.message).toBe('hello world');
  });

  it('should attempt to apply a Joi schema to a response', () => {
    const mockValidate = jest.fn().mockImplementation(response => ({ value: response }));
    const response = { lorem_ipsum: 'dolor_sit' };

    serviceHelpers.schemaResponse({
      schema: { validate: mockValidate },
      response
    });

    expect(mockValidate).toHaveBeenCalledTimes(1);
    expect(mockValidate).toHaveBeenCalledWith(response, { convert: true });

    expect(
      serviceHelpers.schemaResponse({
        schema: { validate: mockValidate },
        response,
        casing: 'camel'
      })
    ).toEqual({ loremIpsum: 'dolor_sit' });
  });
});
