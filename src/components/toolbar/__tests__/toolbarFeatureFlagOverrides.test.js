import { useSeparateSlaTypeUsageFiltersEnabled, SEPARATE_SLA_TYPE_USAGE_FILTERS_FLAG } from '../toolbarContext';
import {
  useResolvedSlaUsageFilteringEnabled,
  RESOLVED_SLA_USAGE_FILTERING_FLAG
} from '../../productView/productViewContext';

describe('Local filter feature flag overrides', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, NODE_ENV: 'development' };
    delete process.env.REACT_APP_DEBUG_RESOLVED_SLA_USAGE_FILTERING;
    delete process.env.REACT_APP_DEBUG_SEPARATE_SLA_TYPE_USAGE_FILTERS;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe.each([
    {
      name: 'resolved SLA/Usage',
      envKey: 'REACT_APP_DEBUG_RESOLVED_SLA_USAGE_FILTERING',
      flagKey: RESOLVED_SLA_USAGE_FILTERING_FLAG,
      useFlag: useResolvedSlaUsageFilteringEnabled
    },
    {
      name: 'separate SLA/Type/Usage',
      envKey: 'REACT_APP_DEBUG_SEPARATE_SLA_TYPE_USAGE_FILTERS',
      flagKey: SEPARATE_SLA_TYPE_USAGE_FILTERS_FLAG,
      useFlag: useSeparateSlaTypeUsageFiltersEnabled
    }
  ])('$name', ({ envKey, flagKey, useFlag }) => {
    it.each([
      ['true', false, true],
      ['false', true, false]
    ])('should prefer the %s override to the Unleash value %s', async (override, unleashValue, expected) => {
      process.env[envKey] = override;
      const featureFlag = jest.fn(() => unleashValue);
      const useChrome = jest.fn(() => ({ visibilityFunctions: { featureFlag } }));
      const { result } = await renderHook(() =>
        useFlag({ useChrome, useProductViewContext: () => ({ defaultFilteringEnabled: true }) })
      );

      expect(result).toBe(expected);
      expect(useChrome).toHaveBeenCalled();
      expect(featureFlag).not.toHaveBeenCalled();
    });

    it.each([
      [undefined, true],
      [undefined, false],
      ['', true],
      ['', false],
      ['TRUE', false],
      ['FALSE', true],
      ['1', false],
      ['0', true]
    ])('should fall back to Unleash for the value %s', async (override, unleashValue) => {
      if (override !== undefined) {
        process.env[envKey] = override;
      }
      const featureFlag = jest.fn(() => unleashValue);
      const { result } = await renderHook(() =>
        useFlag({
          useChrome: () => ({ visibilityFunctions: { featureFlag } }),
          useProductViewContext: () => ({ defaultFilteringEnabled: true })
        })
      );

      expect(result).toBe(unleashValue);
      expect(featureFlag).toHaveBeenCalledWith(flagKey, true);
    });

    it.each([
      ['production', 'true', false],
      ['production', 'false', true],
      ['test', 'true', false],
      ['test', 'false', true]
    ])('should ignore the %s override %s', async (nodeEnv, override, unleashValue) => {
      process.env.NODE_ENV = nodeEnv;
      process.env.REACT_APP_ENV = 'development';
      process.env[envKey] = override;
      const featureFlag = jest.fn(() => unleashValue);
      const { result } = await renderHook(() =>
        useFlag({
          useChrome: () => ({ visibilityFunctions: { featureFlag } }),
          useProductViewContext: () => ({ defaultFilteringEnabled: true })
        })
      );

      expect(result).toBe(unleashValue);
      expect(featureFlag).toHaveBeenCalledWith(flagKey, true);
    });
  });

  it.each([
    ['true', 'true', true],
    ['true', 'false', false],
    ['false', 'true', false],
    ['false', 'false', false]
  ])('should require both overrides without Chrome: resolved=%s, separate=%s', async (resolved, separate, expected) => {
    process.env.REACT_APP_DEBUG_RESOLVED_SLA_USAGE_FILTERING = resolved;
    process.env.REACT_APP_DEBUG_SEPARATE_SLA_TYPE_USAGE_FILTERS = separate;
    const useChrome = () => ({});
    const { result } = await renderHook(() => {
      const defaultFilteringEnabled = useResolvedSlaUsageFilteringEnabled({ useChrome });
      return useSeparateSlaTypeUsageFiltersEnabled({
        useChrome,
        useProductViewContext: () => ({ defaultFilteringEnabled })
      });
    });

    expect(result).toBe(expected);
  });
});
