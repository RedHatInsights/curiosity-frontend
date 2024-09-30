import { useCallback, useEffect, useState } from 'react';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useShallowCompareEffect, useLocation } from 'react-use';
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
 * @param {Function} options.useLocation
 * @param {*} options.windowHistory
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
 * Initialize and store a product path, parameter, in a "state" update parallel to variant detail.
 * We're opting to use "window.location.pathname" directly because its faster.
 * and returns a similar structured value as useParam.
 *
 * @param {object} options
 * @param {boolean} options.disableIsClosestMatch
 * @param {Function} options.useLocation
 * @param {Function} options.useSelector
 * @returns {{ firstMatch: unknown, isClosest: boolean, productGroup: string, productConfig: Array,
 *     productPath: string, productVariant: string, disableIsClosestMatch:boolean }}
 */
const useSetRouteProduct = ({
  disableIsClosestMatch = helpers.DEV_MODE === true,
  useLocation: useAliasLocation = useLocation,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector
} = {}) => {
  const [product, setProduct] = useState({});
  const { pathname: productPath } = useAliasLocation();
  const productVariant = useAliasSelector(({ view }) => view?.product?.variant, {});

  useShallowCompareEffect(() => {
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

    setProduct(() => ({
      ...config,
      firstMatch,
      isClosest,
      productGroup: firstMatch?.productGroup,
      productConfig: (configs?.length && configs) || [],
      productPath,
      productVariant,
      disableIsClosestMatch:
        (disableIsClosestMatch && isClosest) || (disableIsClosestMatch && routerHelpers.dynamicPath() === '/')
    }));
  }, [disableIsClosestMatch, productPath, productVariant]);

  return product;
};

/**
 * Aggregate display settings and configuration. Get a product route detail.
 * Consumes useSetRouteProduct to return a display configuration for use in productView context.
 *
 * @param {object} options
 * @param {Function} options.t
 * @param {Function} options.useChrome
 * @param {useSetRouteProduct} options.useSetRouteProduct
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
  const productGroup = product?.productGroup;

  useEffect(() => {
    // Set platform document title, remove pre-baked suffix
    updateDocumentTitle(
      `${t(`curiosity-view.title`, {
        appName: helpers.UI_DISPLAY_NAME,
        context: productGroup
      })} - ${helpers.UI_DISPLAY_NAME}${(bundleData?.bundleTitle && ` | ${bundleData?.bundleTitle}`) || ''}`,
      true
    );
  }, [bundleData?.bundleTitle, productGroup, t, updateDocumentTitle]);

  return product;
};

const context = {
  useNavigate,
  useRouteDetail,
  useSetRouteProduct
};

export { context as default, context, useNavigate, useRouteDetail, useSetRouteProduct };
