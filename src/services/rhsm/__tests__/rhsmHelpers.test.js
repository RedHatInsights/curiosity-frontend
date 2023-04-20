import { rhsmHelpers } from '../rhsmHelpers';
import { RHSM_API_QUERY_SET_TYPES } from '../rhsmConstants';

describe('RHSM Helpers', () => {
  it('should have specific functions', () => {
    expect(rhsmHelpers).toMatchSnapshot('helpers');
  });

  it('filterArchitectureVariant, should filter architectures, variants from an object', () => {
    expect(rhsmHelpers.filterArchitectureVariant('passThroughId')).toMatchSnapshot('passed id');

    expect(
      rhsmHelpers.filterArchitectureVariant('passThroughId', { [RHSM_API_QUERY_SET_TYPES.VARIANT]: 'ipsum' })
    ).toMatchSnapshot('updated id, variant');
  });
});
