import { normalizeSlaUsageQuery } from '../slaUsageHelpers';
import {
  RHSM_API_QUERY_SET_TYPES as QUERY_TYPES,
  RHSM_API_QUERY_SLA_TYPES as SLA_TYPES,
  RHSM_API_QUERY_USAGE_TYPES as USAGE_TYPES
} from '../../../services/rhsm/rhsmConstants';

describe('normalizeSlaUsageQuery', () => {
  it.each([
    ['undefined', undefined],
    ['null', null],
    ['blank', ''],
    ['whitespace', '  '],
    ['invalid', 'unsupported']
  ])('should default missing or invalid values (%s)', (_description, value) => {
    expect(
      normalizeSlaUsageQuery(
        {
          [QUERY_TYPES.SLA]: value,
          [QUERY_TYPES.USAGE]: value
        },
        undefined,
        true
      )
    ).toEqual({
      [QUERY_TYPES.SLA]: SLA_TYPES.PREMIUM,
      [QUERY_TYPES.USAGE]: USAGE_TYPES.PRODUCTION
    });
  });

  it.each([
    [SLA_TYPES.PREMIUM, USAGE_TYPES.PRODUCTION],
    [SLA_TYPES.STANDARD, USAGE_TYPES.DEVELOPMENT],
    [SLA_TYPES.SELF, USAGE_TYPES.DISASTER]
  ])('should preserve valid selections: %s, %s', (sla, usage) => {
    expect(
      normalizeSlaUsageQuery(
        {
          [QUERY_TYPES.SLA]: sla,
          [QUERY_TYPES.USAGE]: usage
        },
        undefined,
        true
      )
    ).toEqual({
      [QUERY_TYPES.SLA]: sla,
      [QUERY_TYPES.USAGE]: usage
    });
  });

  it('should apply defaults to an empty query and preserve unrelated filters', () => {
    expect(normalizeSlaUsageQuery({ category: 'physical' }, undefined, true)).toEqual({
      category: 'physical',
      [QUERY_TYPES.SLA]: SLA_TYPES.PREMIUM,
      [QUERY_TYPES.USAGE]: USAGE_TYPES.PRODUCTION
    });

    expect(normalizeSlaUsageQuery(null, undefined, true)).toEqual({
      [QUERY_TYPES.SLA]: SLA_TYPES.PREMIUM,
      [QUERY_TYPES.USAGE]: USAGE_TYPES.PRODUCTION
    });
  });

  it('should resolve only filters supported by the product config', () => {
    expect(
      normalizeSlaUsageQuery(
        {
          [QUERY_TYPES.SLA]: SLA_TYPES.STANDARD,
          [QUERY_TYPES.USAGE]: USAGE_TYPES.DEVELOPMENT,
          category: 'physical'
        },
        [{ id: QUERY_TYPES.SLA }],
        true
      )
    ).toEqual({
      [QUERY_TYPES.SLA]: SLA_TYPES.STANDARD,
      category: 'physical'
    });

    expect(
      normalizeSlaUsageQuery(
        {
          [QUERY_TYPES.SLA]: null,
          [QUERY_TYPES.USAGE]: null
        },
        [],
        true
      )
    ).toEqual({});
  });

  it('leaves query values unchanged when the feature is disabled', () => {
    const query = {
      [QUERY_TYPES.SLA]: null,
      [QUERY_TYPES.USAGE]: 'unsupported',
      category: 'physical'
    };

    expect(normalizeSlaUsageQuery(query)).toEqual(query);
    expect(normalizeSlaUsageQuery(query, [{ id: QUERY_TYPES.SLA }], false)).toEqual(query);
  });
});
