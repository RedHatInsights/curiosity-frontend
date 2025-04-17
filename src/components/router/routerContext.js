import { useCallback, useEffect } from 'react';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useLocation } from 'react-use';
import { routerHelpers } from './routerHelpers';
import { helpers } from '../../common/helpers';
import { storeHooks } from '../../redux';
import { translate } from '../i18n/i18n';

/**
 * @memberof Router
 * @module RouterContext
 */

/**
 * useNavigate wrapper. Leverage useNavigate for a modified router with parallel "state"
 * update. Dispatches the same type leveraged by the initialize hook, useSetRouteDetail.
 *
 * @param {object} options
 * @param {useLocation} [options.useLocation=useLocation]
 * @param {*} [options.windowHistory]
 * @returns {Function}
 */
const useNavigate = ({
  useLocation: useAliasLocation = useLocation,
  windowHistory: aliasWindowHistory = window.history
} = {}) => {
  const windowHistory = aliasWindowHistory;
  const { search = '', hash = '' } = useAliasLocation();

  return useCallback(
    (pathLocation, options) => {
      const pathName = (typeof pathLocation === 'string' && pathLocation) || pathLocation?.pathname;
      const { firstMatch } = routerHelpers.getRouteConfigByPath({ pathName });

      if (firstMatch?.productPath) {
        return windowHistory.pushState(
          {},
          '',
          `${routerHelpers.pathJoin(routerHelpers.dynamicBaseName(), firstMatch?.productPath)}${search}${hash}`,
          options
        );
      }

      return windowHistory.pushState({}, '', (pathName && `${pathName}${search}${hash}`) || pathLocation, options);
    },
    [hash, search, windowHistory]
  );
};

/**
 * Set a product config based on routing
 *
 * @param {object} params
 * @param {string} params.productPath
 * @param {boolean} params.disableIsClosestMatch
 * @param {object} params.productVariant
 * @returns {{
 *   firstMatch: object,
 *   productPath: string,
 *   disableIsClosestMatch: boolean,
 *   productGroup: string,
 *   productVariant: string,
 *   isClosest: boolean,
 *   productConfig: Array}}
 */
const setRouteProduct = ({ productPath, disableIsClosestMatch = false, productVariant } = {}) => {
  let routeConfig = routerHelpers.getRouteConfigByPath({
    pathName: productPath,
    isIgnoreClosest: disableIsClosestMatch
  });

  if (productVariant) {
    const selectedVariant = productVariant?.[routeConfig?.firstMatch?.productGroup];
    if (selectedVariant) {
      routeConfig = routerHelpers.getRouteConfigByPath({
        pathName: selectedVariant,
        isIgnoreClosest: disableIsClosestMatch
      });
    }
  }

  const { configs, firstMatch, isClosest, ...config } = routeConfig;

  return {
    ...config,
    firstMatch,
    isClosest,
    productGroup: firstMatch?.productGroup,
    productConfig: (configs?.length && configs) || [],
    productPath,
    productVariant,
    disableIsClosestMatch:
      (disableIsClosestMatch && isClosest) || (disableIsClosestMatch && routerHelpers.dynamicPath() === '/')
  };
};

/**
 * A memoized response for the setProductRoute function. Assigned to a property for testing function.
 *
 * @type {Function}
 */
setRouteProduct.memo = helpers.memo(setRouteProduct, { cacheLimit: 10 });

/**
 * Initialize and store a product path, parameter, in a "state" update parallel to variant detail.
 *
 * @param {object} options
 * @param {boolean} [options.disableIsClosestMatch]
 * @param {setRouteProduct} [options.setProduct=setRouteProduct]
 * @param {useLocation} [options.useLocation=useLocation]
 * @param {storeHooks.reactRedux.useSelector} [options.useSelector=storeHooks.reactRedux.useSelector]
 * @returns {{ firstMatch: unknown, isClosest: boolean, productGroup: string, productConfig: Array,
 *     productPath: string, productVariant: string, disableIsClosestMatch:boolean }}
 */
const useSetRouteProduct = ({
  disableIsClosestMatch = helpers.DEV_MODE === true,
  setProduct = setRouteProduct,
  useLocation: useAliasLocation = useLocation,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector
} = {}) => {
  const { pathname: productPath } = useAliasLocation();
  const productVariant = useAliasSelector(({ view }) => view?.product?.variant, {});

  return setProduct.memo({ disableIsClosestMatch, productPath, productVariant });
};

/**
 * Aggregate display settings and configuration. Get a product route detail.
 * Consumes useSetRouteProduct to return a display configuration for use in productView context.
 *
 * @param {object} options
 * @param {translate} [options.t=translate]
 * @param {useChrome} [options.useChrome=useChrome]
 * @param {useSetRouteProduct} [options.useSetRouteProduct=useSetRouteProduct]
 * @returns {{firstMatch: *, isClosest: boolean, productGroup: string, productConfig: Array, productPath: string,
 *     productVariant: string, disableIsClosestMatch: boolean}}}
 */
const useRouteDetail = ({
  t = translate,
  useChrome: useAliasChrome = useChrome,
  useSetRouteProduct: useAliasSetRouteProduct = useSetRouteProduct
} = {}) => {
  const product = useAliasSetRouteProduct();
  const { getBundleData = helpers.noop, updateDocumentTitle = helpers.noop } = useAliasChrome();
  const bundleData = getBundleData();

  useEffect(() => {
    // Set platform document title, remove pre-baked suffix
    updateDocumentTitle(
      `${t(`curiosity-view.title`, {
        appName: helpers.UI_DISPLAY_NAME,
        context: product?.productGroup
      })} - ${helpers.UI_DISPLAY_NAME}${(bundleData?.bundleTitle && ` | ${bundleData?.bundleTitle}`) || ''}`,
      true
    );
  }, [bundleData?.bundleTitle, product?.productGroup, t, updateDocumentTitle]);

  return product;
};

const context = {
  setRouteProduct,
  useNavigate,
  useRouteDetail,
  useSetRouteProduct
};

export { context as default, context, setRouteProduct, useNavigate, useRouteDetail, useSetRouteProduct };
