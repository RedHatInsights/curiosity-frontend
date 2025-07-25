import { platformHelpers, getExportProductId, getExportStatus } from '../platformHelpers';
import { PLATFORM_API_EXPORT_STATUS_TYPES } from '../platformConstants';

describe('PlatformHelpers', () => {
  it('should have specific functions', () => {
    expect(platformHelpers).toMatchSnapshot('platformHelpers');
  });

  it.each([
    {
      description: 'undefined input',
      input: undefined,
      expected: undefined
    },
    {
      description: 'null input',
      input: null,
      expected: undefined
    },
    {
      description: 'empty string',
      input: '',
      expected: undefined
    },
    {
      description: 'string without prefix',
      input: 'some-product-id',
      expected: undefined
    },
    {
      description: 'string with only prefix',
      input: 'swatch-',
      expected: ''
    },
    {
      description: 'string with prefix and product id',
      input: 'swatch-rhel',
      expected: 'rhel'
    },
    {
      description: 'string with prefix and complex product id',
      input: 'swatch-openshift-container-platform',
      expected: 'openshift-container-platform'
    },
    {
      description: 'string with prefix and product id with spaces',
      input: 'swatch-product id with spaces',
      expected: 'product id with spaces'
    },
    {
      description: 'string with prefix and product id with leading/trailing spaces',
      input: 'swatch-  product-id  ',
      expected: 'product-id'
    }
  ])('getExportProductId should normalize product id from export name, $description', ({ input, expected }) => {
    expect(getExportProductId(input)).toBe(expected);
  });

  it.each([
    {
      description: 'FAILED status',
      input: PLATFORM_API_EXPORT_STATUS_TYPES.FAILED,
      expected: PLATFORM_API_EXPORT_STATUS_TYPES.FAILED
    },
    {
      description: 'PARTIAL status should map to FAILED',
      input: PLATFORM_API_EXPORT_STATUS_TYPES.PARTIAL,
      expected: PLATFORM_API_EXPORT_STATUS_TYPES.FAILED
    },
    {
      description: 'COMPLETE status',
      input: PLATFORM_API_EXPORT_STATUS_TYPES.COMPLETE,
      expected: PLATFORM_API_EXPORT_STATUS_TYPES.COMPLETE
    },
    {
      description: 'RUNNING status should map to PENDING',
      input: PLATFORM_API_EXPORT_STATUS_TYPES.RUNNING,
      expected: PLATFORM_API_EXPORT_STATUS_TYPES.PENDING
    },
    {
      description: 'PENDING status',
      input: PLATFORM_API_EXPORT_STATUS_TYPES.PENDING,
      expected: PLATFORM_API_EXPORT_STATUS_TYPES.PENDING
    },
    {
      description: 'undefined input should default to PENDING',
      input: undefined,
      expected: PLATFORM_API_EXPORT_STATUS_TYPES.PENDING
    },
    {
      description: 'null input should default to PENDING',
      input: null,
      expected: PLATFORM_API_EXPORT_STATUS_TYPES.PENDING
    },
    {
      description: 'unknown status should default to PENDING',
      input: 'unknown-status',
      expected: PLATFORM_API_EXPORT_STATUS_TYPES.PENDING
    },
    {
      description: 'empty string should default to PENDING',
      input: '',
      expected: PLATFORM_API_EXPORT_STATUS_TYPES.PENDING
    }
  ])('getExportStatus should normalize export status, $description', ({ input, expected }) => {
    expect(getExportStatus(input)).toBe(expected);
  });
});
