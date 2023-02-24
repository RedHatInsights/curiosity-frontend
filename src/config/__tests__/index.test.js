import _isPlainObject from 'lodash/isPlainObject';
import { config } from '../index';

describe('Configuration', () => {
  it('should have specific config properties', () => {
    expect(Object.keys(config)).toMatchSnapshot('config');
  });

  it('should have consistent product configuration', () => {
    expect(Object.keys(config.products)).toMatchSnapshot('products');

    const inconsistentEntries = [];

    Object.values(config.products.configs).forEach((value, index) => {
      const {
        productGroup,
        productId,
        productLabel,
        productPath,
        viewId,
        query,
        graphTallyQuery,
        inventoryHostsQuery,
        initialGraphFilters,
        initialInventoryFilters
      } = value;

      const entryCheck = {
        productGroup: typeof productGroup === 'string' ? 'PASS' : 'FAIL',
        productId: typeof productId === 'string' || productId === null ? 'PASS' : 'FAIL',
        productLabel: typeof productLabel === 'string' || productLabel === null ? 'PASS' : 'FAIL',
        productPath: typeof productPath === 'string' ? 'PASS' : 'FAIL',
        viewId: typeof viewId === 'string' ? 'PASS' : 'FAIL',
        query: _isPlainObject(query) ? 'PASS' : 'FAIL',
        graphTallyQuery: _isPlainObject(graphTallyQuery) ? 'PASS' : 'FAIL',
        inventoryHostsQuery: _isPlainObject(inventoryHostsQuery) ? 'PASS' : 'FAIL',
        initialGraphFilters: Array.isArray(initialGraphFilters) ? 'PASS' : 'FAIL',
        initialInventoryFilters: Array.isArray(initialInventoryFilters) ? 'PASS' : 'FAIL'
      };

      if (Object.values(entryCheck).indexOf('FAIL') > -1) {
        inconsistentEntries.push({ [`Entry ${index}, ${productId} inconsistent`]: entryCheck });
      }
    });

    expect(inconsistentEntries).toMatchSnapshot('inconsistent entries');
  });

  it('should have a consistent rbac configuration', () => {
    Object.values(config.rbac).forEach(({ permissions }) => {
      expect(Array.isArray(permissions)).toBe(true);

      permissions.forEach((value, index) => {
        expect(`${index}, ${Object.keys(permissions[index]).join(', ')}`).toBe(`${index}, resource, operation`);
      });
    });
  });

  it('should have a consistent route configuration', () => {
    expect(Array.isArray(config.routes)).toBe(true);

    const inconsistentEntries = [];

    config.routes.forEach((value, index) => {
      const entryCheck = {
        path: typeof value.path === 'string' ? 'PASS' : 'FAIL',
        redirect: typeof value.redirect === 'string' || value.redirect === null ? 'PASS' : 'FAIL',
        activateOnError: typeof value.activateOnError === 'boolean' ? 'PASS' : 'FAIL',
        disabled: typeof value.disabled === 'boolean' ? 'PASS' : 'FAIL',
        default: typeof value.default === 'boolean' ? 'PASS' : 'FAIL',
        component: typeof value.component === 'string' || value.component === null ? 'PASS' : 'FAIL'
      };

      if (Object.values(entryCheck).indexOf('FAIL') > -1) {
        inconsistentEntries.push({ [`Entry ${index}, ${value.path} inconsistent`]: entryCheck });
      }
    });

    expect(inconsistentEntries).toMatchSnapshot('inconsistent entries');
  });
});
