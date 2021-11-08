import { serviceHelpers } from '../helpers';

describe('Service Helpers', () => {
  it('should have specific functions', () => {
    expect(serviceHelpers).toMatchSnapshot('serviceHelpers');
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
