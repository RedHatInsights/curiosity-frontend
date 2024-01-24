import { platformSchemas } from '../platformSchemas';

describe('Platform Schemas', () => {
  it('should have specific response schemas', () => {
    expect(platformSchemas).toMatchSnapshot('specific schemas');
  });

  it('should have valid schemas that validate API responses', () => {
    Object.entries(platformSchemas).forEach(([key, value]) => {
      expect(value({})).toMatchSnapshot(`${key} response schema`);
    });
  });
});
