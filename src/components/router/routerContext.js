import { useCallback, useEffect, useLayoutEffect } from 'react';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useLocation } from 'react-use';
import { routerHelpers, sanitizeOidcParams } from './routerHelpers';
import { helpers } from '../../common/helpers';
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
  const cleanUrl = sanitizeOidcParams({ search, hash });

  return useCallback(
    (pathLocation, options) => {
      const pathName = (typeof pathLocation === 'string' && pathLocation) || pathLocation?.pathname;
      const { firstMatch } = routerHelpers.getRouteConfigByPath({ pathName });
      const targetPath = firstMatch?.productPath
        ? routerHelpers.pathJoin(routerHelpers.dynamicBaseName(), firstMatch?.productPath)
        : pathName;

      if (firstMatch?.productPath) {
        return windowHistory.pushState({}, '', `${targetPath}${cleanUrl.search}${cleanUrl.hash}`, options);
      }

      return windowHistory.pushState(
        {},
        '',
        (pathName && `${pathName}${cleanUrl.search}${cleanUrl.hash}`) || pathLocation,
        options
      );
    },
    [cleanUrl.hash, cleanUrl.search, windowHistory]
  );
};

/**
 * Reflect a product variant selection in the browser URL.
 *
 * The variant is pushed as the trailing path identifier, i.e. "/subscriptions/usage/RHEL%20for%20ARM", instead of
 * a search parameter. Variants are already exact, routable identifiers, see sortedProductConfigs
 * "byAnythingPathIds", so this introduces no new URL format and every existing format continues to resolve.
 *
 * Chrome's history is preferred when it is available so the platform router stays in sync. It delegates to
 * window.history.pushState, which is the method useLocation patches, so either path re-renders without a
 * page reload.
 *
 * Note: re-selecting the variant already in the URL is a no-op, avoiding duplicate history entries that would
 * otherwise require multiple back presses to escape.
 *
 * @param {object} options
 * @param {routerHelpers.getProductPath} [options.getProductPath=routerHelpers.getProductPath]
 * @param {useChrome} [options.useChrome=useChrome]
 * @param {useLocation} [options.useLocation=useLocation]
 * @param {*} [options.windowHistory=window.history]
 * @returns {Function}
 */
const useNavigateVariant = ({
  getProductPath: aliasGetProductPath = routerHelpers.getProductPath,
  useChrome: useAliasChrome = useChrome,
  useLocation: useAliasLocation = useLocation,
  windowHistory: aliasWindowHistory = window.history
} = {}) => {
  const { chromeHistory } = useAliasChrome() || {};
  const { pathname = window.location.pathname, search = '', hash = '' } = useAliasLocation();
  const cleanUrl = sanitizeOidcParams({ search, hash });

  return useCallback(
    productId => {
      if (!productId) {
        return undefined;
      }

      const targetUrl = `${aliasGetProductPath({ pathName: pathname, productId })}${cleanUrl.search}${cleanUrl.hash}`;

      if (targetUrl === `${pathname}${search}${hash}`) {
        return undefined;
      }

      if (typeof chromeHistory?.push === 'function') {
        return chromeHistory.push(targetUrl);
      }

      return aliasWindowHistory.pushState({}, '', targetUrl);
    },
    [aliasGetProductPath, aliasWindowHistory, chromeHistory, cleanUrl.hash, cleanUrl.search, hash, pathname, search]
  );
};

/**
 * Remove OIDC callback parameters whenever the application URL changes.
 *
 * @param {object} options
 * @param {useLocation} [options.useLocation=useLocation]
 * @param {*} [options.windowHistory=window.history]
 * @returns {void}
 */
const useSanitizeOidcParams = ({
  useLocation: useAliasLocation = useLocation,
  windowHistory: aliasWindowHistory = window.history
} = {}) => {
  const windowHistory = aliasWindowHistory;
  const { pathname = window.location.pathname, search = '', hash = '' } = useAliasLocation();

  useLayoutEffect(() => {
    const cleanUrl = sanitizeOidcParams({ search, hash });
    if (cleanUrl.search !== search || cleanUrl.hash !== hash) {
      windowHistory.replaceState(null, '', pathname + cleanUrl.search + cleanUrl.hash);
    }
  }, [hash, pathname, search, windowHistory]);
};

/**
 * Set a product config based on routing
 *
 * @param {object} params
 * @param {string} params.productPath
 * @param {boolean} params.disableIsClosestMatch
 * @returns {{
 *   firstMatch: object,
 *   productPath: string,
 *   disableIsClosestMatch: boolean,
 *   productGroup: string,
 *   productVariant: string,
 *   isClosest: boolean,
 *   productConfig: Array}}
 */
const setRouteProduct = ({ productPath, disableIsClosestMatch = false } = {}) => {
  const routeConfig = routerHelpers.getRouteConfigByPath({
    pathName: productPath,
    isIgnoreClosest: disableIsClosestMatch
  });

  const { configs, firstMatch, isClosest, ...config } = routeConfig;

  return {
    ...config,
    firstMatch,
    isClosest,
    productGroup: firstMatch?.productGroup,
    productConfig: (configs?.length && configs) || [],
    productPath,
    productVariant: firstMatch?.productId,
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
 * @returns {{ firstMatch: unknown, isClosest: boolean, productGroup: string, productConfig: Array,
 *     productPath: string, productVariant: string, disableIsClosestMatch:boolean }}
 */
const useSetRouteProduct = ({
  disableIsClosestMatch = helpers.DEV_MODE === true,
  setProduct = setRouteProduct,
  useLocation: useAliasLocation = useLocation
} = {}) => {
  const { pathname: productPath } = useAliasLocation();

  return setProduct.memo({ disableIsClosestMatch, productPath });
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
  const bundleTitle = getBundleData()?.bundleTitle;
  const productGroup = product?.productGroup;

  useEffect(() => {
    // Set platform document title, remove pre-baked suffix
    updateDocumentTitle(
      `${t(`curiosity-view.title`, {
        appName: helpers.UI_DISPLAY_NAME,
        context: productGroup
      })} - ${helpers.UI_DISPLAY_NAME}${(bundleTitle && ` | ${bundleTitle}`) || ''}`,
      true
    );
  }, [bundleTitle, productGroup, t, updateDocumentTitle]);

  return product;
};

const context = {
  setRouteProduct,
  useNavigate,
  useNavigateVariant,
  useSanitizeOidcParams,
  useRouteDetail,
  useSetRouteProduct
};

export {
  context as default,
  context,
  setRouteProduct,
  useNavigate,
  useNavigateVariant,
  useSanitizeOidcParams,
  useRouteDetail,
  useSetRouteProduct
};
