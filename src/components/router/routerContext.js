import { useCallback, useMemo } from 'react';
import {
  useLocation as useLocationRRD,
  useNavigate as useRRDNavigate,
  useParams,
  useSearchParams as useRRDSearchParams
} from 'react-router-dom';
import { routerHelpers } from './routerHelpers';

/**
 * Combine react-router-dom useLocation with actual window location.
 * Focused on exposing replace and href.
 *
 * @param {Function} useLocation
 * @returns {{search, replace: Function, href, hash}}
 */
const useLocation = ({ useLocation: useAliasLocation = useLocationRRD } = {}) => {
  const location = useAliasLocation();
  const { location: windowLocation } = window;

  return useMemo(
    () => ({
      ...location,
      ...windowLocation,
      replace: path => windowLocation.replace(path),
      hash: location?.hash || '',
      set href(path) {
        windowLocation.href = path;
      },
      search: location?.search || ''
    }),
    [location, windowLocation]
  );
};

/**
 * Return a callback for redirecting, and replacing, towards a new path, or url.
 *
 * @callback redirect
 * @param {object} options
 * @param {Function} options.useLocation
 * @returns {(function(*): void)|*}
 */
const useRedirect = ({ useLocation: useAliasLocation = useLocation } = {}) => {
  const { hash = '', search = '', ...location } = useAliasLocation() || {};
  /**
   * redirect
   *
   * @param {string} route
   * @returns {void}
   */
  return useCallback(
    (route, { isReplace = true } = {}) => {
      const baseName = routerHelpers.dynamicBaseName();
      let isUrl;

      try {
        isUrl = !!new URL(route);
      } catch (e) {
        isUrl = false;
      }

      const updatedRoute = (isUrl && route) || `${routerHelpers.pathJoin(baseName, route)}${search}${hash}`;

      if (isReplace) {
        location.replace(updatedRoute);
        return;
      }

      location.href = updatedRoute;
    },
    [hash, location, search]
  );
};

/**
 * Get a route detail from router context.
 *
 * @param {object} options
 * @param {Function} options.useParams
 * @returns {{baseName: string, errorRoute: object}}
 */
const useRouteDetail = ({ useParams: useAliasParams = useParams } = {}) => {
  const { productPath } = useAliasParams();
  const { allConfigs, configs, firstMatch } = routerHelpers.getRouteConfigByPath({ pathName: productPath });

  return {
    allProductConfigs: allConfigs,
    firstMatch,
    errorRoute: routerHelpers.errorRoute,
    productGroup: firstMatch?.productGroup,
    productConfig: (configs?.length && configs) || []
  };
};

/**
 * useNavigate wrapper, apply application config context routing
 *
 * @param {object} options
 * @param {Function} options.useLocation
 * @param {Function} options.useNavigate
 * @returns {Function}
 */
const useNavigate = ({
  useLocation: useAliasLocation = useLocation,
  useNavigate: useAliasNavigate = useRRDNavigate
} = {}) => {
  const { search, hash } = useAliasLocation();
  const navigate = useAliasNavigate();

  return useCallback(
    (pathLocation, options) => {
      const pathName = (typeof pathLocation === 'string' && pathLocation) || pathLocation?.pathname;
      const { firstMatch } = routerHelpers.getRouteConfigByPath({ pathName });

      return navigate(
        (firstMatch?.productPath && `${routerHelpers.pathJoin('.', firstMatch?.productPath)}${search}${hash}`) ||
          (pathName && `${pathName}${search}${hash}`) ||
          pathLocation,
        options
      );
    },
    [hash, navigate, search]
  );
};

/**
 * Search parameter, return
 *
 * @param {object} options
 * @param {Function} options.useLocation
 * @param {Function} options.useSearchParams
 * @returns {Array}
 */
const useSearchParams = ({
  useSearchParams: useAliasSearchParams = useRRDSearchParams,
  useLocation: useAliasLocation = useLocation
} = {}) => {
  const { search } = useAliasLocation();
  const [, setAliasSearchParams] = useAliasSearchParams();

  /**
   * Alias returned React Router Dom useSearchParams hook to something expected.
   * Defaults to merging search objects instead of overwriting them.
   *
   * @param {object} updatedQuery
   * @param {object} options
   * @param {boolean} options.isMerged Merge search with existing search, or don't
   * @param {string|*} options.currentSearch search returned from useLocation
   */
  const setSearchParams = useCallback(
    (updatedQuery, { isMerged = true, currentSearch = search } = {}) => {
      let updatedSearch = {};

      if (isMerged) {
        Object.assign(updatedSearch, routerHelpers.parseSearchParams(currentSearch), updatedQuery);
      } else {
        updatedSearch = updatedQuery;
      }

      setAliasSearchParams(updatedSearch);
    },
    [search, setAliasSearchParams]
  );

  return [routerHelpers.parseSearchParams(search), setSearchParams];
};

const context = {
  useLocation,
  useNavigate,
  useParams,
  useRedirect,
  useRouteDetail,
  useSearchParams
};

export {
  context as default,
  context,
  useLocation,
  useNavigate,
  useParams,
  useRedirect,
  useRouteDetail,
  useSearchParams
};
