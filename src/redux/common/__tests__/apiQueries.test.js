import { apiQueries } from '../apiQueries';
import {
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_TYPES
} from '../../../types/rhsmApiTypes';

describe('ApiQueries', () => {
  it('should have specific functions', () => {
    expect(apiQueries).toMatchSnapshot('apiQueries');
  });

  it('should parse a query object into specific api facets', () => {
    const rhsmApiQuery = {
      [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY,
      [RHSM_API_QUERY_TYPES.LIMIT]: 10,
      [RHSM_API_QUERY_TYPES.OFFSET]: 0
    };
    expect(apiQueries.parseRhsmQuery(rhsmApiQuery)).toMatchSnapshot('rhsm');
  });
});
