import React from 'react';
import { useSelector } from '../../redux';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { useRouteDetail } from '../router/routerContext';

/**
 * Product context.
 *
 * @type {React.Context<{}>}
 */
const ProductContext = React.createContext({});

/**
 * Expose product context.
 *
 * @returns {*}
 */
const useProductContext = () => React.useContext(ProductContext);

/**
 * Expose a UOM filtered product context.
 *
 * @returns {object}
 */
const useProductContextUom = () => {
  const productConfig = useProductContext();
  const {
    initialGraphFilters = [],
    initialInventoryFilters = [],
    initialSubscriptionsInventoryFilters = [],
    productContextFilterUom
  } = productConfig || {};

  const { viewParameter: viewId } = useRouteDetail();
  const filter = useSelector(({ view }) => view.query?.[viewId]?.[RHSM_API_QUERY_TYPES.UOM], productContextFilterUom);

  if (productContextFilterUom) {
    const applyFilter = () => {
      const filterFilters = ({ id, isOptional }) => {
        if (!isOptional) {
          return true;
        }
        return new RegExp(filter, 'i').test(id);
      };

      return {
        ...productConfig,
        initialGraphFilters: initialGraphFilters.filter(filterFilters),
        initialInventoryFilters: initialInventoryFilters.filter(filterFilters),
        initialSubscriptionsInventoryFilters: initialSubscriptionsInventoryFilters.filter(filterFilters)
      };
    };

    return applyFilter();
  }

  return productConfig;
};

/**
 * Generate queries.
 *
 * @param {string} queryType
 * @returns {object}
 */
const useQueryFactory = queryType => {
  const { [queryType]: initialQuery } = useProductContext() || {};

  const { pathParameter: productId, viewParameter: viewId } = useRouteDetail();
  const queryProduct = useSelector(({ view }) => view?.[queryType]?.[productId]);
  const queryView = useSelector(({ view }) => view?.[queryType]?.[viewId]);

  return {
    ...initialQuery,
    ...queryProduct,
    ...queryView
  };
};

/**
 * Expose query.
 *
 * @returns {object}
 */
const useQuery = () => useQueryFactory('query');

/**
 * Expose query used for tally/capacity graph.
 *
 * @returns {object}
 */
const useGraphTallyQuery = () => ({ ...useQuery(), ...useQueryFactory('graphTallyQuery') });

/**
 * Expose query used for hosts inventory.
 *
 * @returns {object}
 */
const useInventoryHostsQuery = () => ({ ...useQuery(), ...useQueryFactory('inventoryHostsQuery') });

/**
 * Expose query used for subscriptions inventory.
 *
 * @returns {object}
 */
const useInventorySubscriptionsQuery = () => ({ ...useQuery(), ...useQueryFactory('inventorySubscriptionsQuery') });

export {
  ProductContext as default,
  ProductContext,
  useProductContext,
  useProductContextUom,
  useQueryFactory,
  useQuery,
  useGraphTallyQuery,
  useInventoryHostsQuery,
  useInventorySubscriptionsQuery
};
