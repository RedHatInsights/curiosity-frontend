import { platformSchemas } from '../platformSchemas';

describe('Platform Schemas', () => {
  it('should have specific response schemas', () => {
    expect(platformSchemas).toMatchSnapshot('specific schemas');
  });

  it('should have valid schemas that validate API responses', () => {
    expect(platformSchemas.user({})).toMatchSnapshot('user response schema');
    expect(platformSchemas.permissions({})).toMatchSnapshot('permissions response schema');
  });
});
