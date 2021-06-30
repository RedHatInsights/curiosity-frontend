import _isPlainObject from 'lodash/isPlainObject';
import { config } from '../index';

describe('Configuration', () => {
  it('should have specific config properties', () => {
    expect(Object.keys(config)).toMatchSnapshot('config');
  });

  it('should have consistent product configuration', () => {
    expect(Object.keys(config.products)).toMatchSnapshot('products');

    const inconsistentEntries = [];

    Object.values(config.products).forEach((value, index) => {
      const {
        productGroup,
        productId,
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
        viewId: typeof viewId === 'string' ? 'PASS' : 'FAIL',
        query: _isPlainObject(query) ? 'PASS' : 'FAIL',
        graphTallyQuery: _isPlainObject(graphTallyQuery) ? 'PASS' : 'FAIL',
        inventoryHostsQuery: _isPlainObject(inventoryHostsQuery) ? 'PASS' : 'FAIL',
        initialGraphFilters: Array.isArray(initialGraphFilters) ? 'PASS' : 'FAIL',
        initialInventoryFilters: Array.isArray(initialInventoryFilters) ? 'PASS' : 'FAIL'
      };

      if (Object.values(entryCheck).indexOf('FAIL') > -1) {
        inconsistentEntries.push({ [`Entry ${index} inconsistent`]: entryCheck });
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
        redirect:
          typeof config.routes[index].redirect === 'string' || config.routes[index].redirect === null ? 'PASS' : 'FAIL',
        isSearchable: typeof config.routes[index].isSearchable === 'boolean' ? 'PASS' : 'FAIL',
        aliases: Array.isArray(config.routes[index].aliases) ? 'PASS' : 'FAIL',
        activateOnError: typeof config.routes[index].activateOnError === 'boolean' ? 'PASS' : 'FAIL',
        disabled: typeof config.routes[index].disabled === 'boolean' ? 'PASS' : 'FAIL',
        default: typeof config.routes[index].default === 'boolean' ? 'PASS' : 'FAIL',
        component:
          typeof config.routes[index].component === 'string' || config.routes[index].component === null
            ? 'PASS'
            : 'FAIL'
      };

      if (Object.values(entryCheck).indexOf('FAIL') > -1) {
        inconsistentEntries.push({ [`Entry ${index} inconsistent`]: entryCheck });
      }
    });

    expect(inconsistentEntries).toMatchSnapshot('inconsistent entries');
  });
});
