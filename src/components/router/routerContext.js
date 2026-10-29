import { useCallback, useEffect, useLayoutEffect } from 'react';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useLocation } from 'react-use';
import { routerHelpers, sanitizeOidcParams } from './routerHelpers';
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
 * The variant is pushed as a path segment nested below its product group, i.e.
 * "/subscriptions/usage/rhel/RHEL%20for%20ARM", instead of a search parameter. Variants are already exact,
 * routable identifiers, see sortedProductConfigs "byAnythingPathIds", so every existing URL format continues
 * to resolve. For why the group path is kept as a prefix, see routerHelpers.getProductPath.
 *
 * When Chrome history is available, chromeHistory.push() is used to keep the platform router in sync.
 * Otherwise, windowHistory.pushState() is used as a fallback; useLocation patches windowHistory.pushState()
 * so fallback navigation re-renders without a page reload.
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
 * The URL outranks stored state whenever it names a variant, which is what lets browser back and forward
 * restore a prior selection. A remembered variant is applied only when the URL stops at a group or alias
 * path, i.e. the platform left navigation links to "/subscriptions/usage/rhel", so moving between product
 * groups returns to the variant last viewed in each. That restore is skipped for "popstate" so the back and
 * forward buttons always land on exactly what the URL describes.
 *
 * "restoreVariantPath" carries the canonical path for whatever resolved, see useRouteDetail, so the URL
 * always names the variant on display. When productVariant restoration is enabled, a group or alias path
 * resolves to its remembered variant when one exists; otherwise it resolves to the group's default variant.
 * The URL is rewritten accordingly, which keeps the address bar copyable without using the dropdown first.
 *
 * @param {object} params
 * @param {string} params.productPath
 * @param {boolean} params.disableIsClosestMatch
 * @param {object} [params.productVariant] Last viewed variant, keyed by productGroup
 * @param {boolean} [params.isRestoreVariant]
 * @returns {{
 *   firstMatch: object,
 *   productPath: string,
 *   disableIsClosestMatch: boolean,
 *   productGroup: string,
 *   productVariant: string,
 *   restoreVariantPath: string|undefined,
 *   isClosest: boolean,
 *   productConfig: Array}}
 */
const setRouteProduct = ({
  productPath,
  disableIsClosestMatch = false,
  productVariant,
  isRestoreVariant = false
} = {}) => {
  let routeConfig = routerHelpers.getRouteConfigByPath({
    pathName: productPath,
    isIgnoreClosest: disableIsClosestMatch
  });

  // Does the path stop at a group or alias, or does it name one of the group's variants outright
  const trailingPathId = routerHelpers.cleanPath({ pathName: productPath })?.split('/')?.pop();
  const isVariantInPath =
    routeConfig?.availableVariants?.some(variant => variant.toLowerCase() === trailingPathId) || false;

  /**
   * Only an exact group or alias match is a restore point. A "closest match" is a Levenshtein guess, so
   * layering stored state on top of one would mask a bad URL, leave the address bar disagreeing with the
   * view, since canonicalPath below skips closest matches, and in DEV_MODE suppress ProductViewMissing by
   * swapping in an exact config.
   */
  const isExactMatch = routeConfig?.isClosest === false;

  if (isExactMatch && !isVariantInPath && isRestoreVariant) {
    const lastViewedVariant = productVariant?.[routeConfig?.firstMatch?.productGroup];

    if (lastViewedVariant) {
      routeConfig = routerHelpers.getRouteConfigByPath({
        pathName: lastViewedVariant,
        isIgnoreClosest: disableIsClosestMatch
      });
    }
  }

  const { configs, firstMatch, isClosest, ...config } = routeConfig;

  /**
   * The canonical path for whatever product resolved, i.e. a group or alias path settles on its default
   * variant. Returned whenever it differs from the current path so the URL always names the variant on
   * display, see useRouteDetail, making the address bar copyable without touching the dropdown first.
   *
   * Skipped for a "closest match" so a Levenshtein guess is never written back as though it were exact,
   * and so the bare mount point is left alone.
   */
  const canonicalPath =
    (!isClosest &&
      firstMatch?.productId &&
      routerHelpers.getProductPath({ pathName: productPath, productId: firstMatch.productId })) ||
    undefined;
  const restoreVariantPath = (canonicalPath !== productPath && canonicalPath) || undefined;

  return {
    ...config,
    firstMatch,
    isClosest,
    productGroup: firstMatch?.productGroup,
    productConfig: (configs?.length && configs) || [],
    productPath,
    productVariant: firstMatch?.productId,
    restoreVariantPath,
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
 *     productPath: string, productVariant: string, restoreVariantPath: string|undefined,
 *     disableIsClosestMatch:boolean }}
 */
const useSetRouteProduct = ({
  disableIsClosestMatch = helpers.DEV_MODE === true,
  setProduct = setRouteProduct,
  useLocation: useAliasLocation = useLocation,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector
} = {}) => {
  const { pathname: productPath, trigger } = useAliasLocation();
  const productVariant = useAliasSelector(({ view }) => view?.product?.variant, {});

  return setProduct.memo({
    disableIsClosestMatch,
    productPath,
    productVariant,
    isRestoreVariant: trigger !== 'popstate'
  });
};

/**
 * Aggregate display settings and configuration. Get a product route detail.
 * Consumes useSetRouteProduct to return a display configuration for use in productView context.
 *
 * @param {object} options
 * @param {translate} [options.t=translate]
 * @param {useChrome} [options.useChrome=useChrome]
 * @param {useSetRouteProduct} [options.useSetRouteProduct=useSetRouteProduct]
 * @param {*} [options.windowHistory=window.history]
 * @returns {{firstMatch: *, isClosest: boolean, productGroup: string, productConfig: Array, productPath: string,
 *     productVariant: string, restoreVariantPath: string|undefined, disableIsClosestMatch: boolean}}}
 */
const useRouteDetail = ({
  t = translate,
  useChrome: useAliasChrome = useChrome,
  useSetRouteProduct: useAliasSetRouteProduct = useSetRouteProduct,
  windowHistory: aliasWindowHistory = window.history
} = {}) => {
  const product = useAliasSetRouteProduct();
  const { getBundleData = helpers.noop, updateDocumentTitle = helpers.noop } = useAliasChrome();
  const bundleTitle = getBundleData()?.bundleTitle;
  const productGroup = product?.productGroup;
  const restoreVariantPath = product?.restoreVariantPath;

  /**
   * Align the URL with a restored variant. Replaces, instead of pushes, so the platform navigation click
   * that landed on the group path remains a single history entry.
   */
  useLayoutEffect(() => {
    if (restoreVariantPath && restoreVariantPath !== window.location.pathname) {
      aliasWindowHistory.replaceState({}, '', `${restoreVariantPath}${window.location.search}${window.location.hash}`);
    }
  }, [aliasWindowHistory, restoreVariantPath]);

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
