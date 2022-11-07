import { rhsmSchemas } from '../rhsmSchemas';

describe('RHSM Schemas', () => {
  it('should have specific response schemas', () => {
    expect(rhsmSchemas).toMatchSnapshot('specific schemas');
  });

  it('should have valid schemas that validate API responses', () => {
    Object.entries(rhsmSchemas).forEach(([key, value]) => {
      expect(value({})).toMatchSnapshot(`${key} response schema`);
    });
  });
});
