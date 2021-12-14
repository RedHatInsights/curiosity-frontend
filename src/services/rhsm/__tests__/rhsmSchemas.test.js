import { rhsmSchemas } from '../rhsmSchemas';

describe('RHSM Schemas', () => {
  it('should have specific RHSM response schemas', () => {
    expect(rhsmSchemas).toMatchSnapshot('specific schemas');
  });

  it('should have valid RHSM schemas that validate API responses', () => {
    expect(rhsmSchemas.errors({})).toMatchSnapshot('error schema');
    expect(rhsmSchemas.tally({})).toMatchSnapshot('tally response schema');
    expect(rhsmSchemas.instances({})).toMatchSnapshot('instances response schema');
    expect(rhsmSchemas.guests({})).toMatchSnapshot('guests response schema');
  });
});
