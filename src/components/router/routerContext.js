import { useCallback, useEffect, useState } from 'react';
import {
  useLocation as useLocationRRD,
  useNavigate as useRRDNavigate,
  useSearchParams as useRRDSearchParams
} from 'react-router-dom';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { routerHelpers } from './routerHelpers';
import { helpers } from '../../common/helpers';
import { storeHooks, reduxTypes } from '../../redux';
import { translate } from '../i18n/i18n';

/**
 * Combine react-router-dom useLocation with actual window location.
 * Focused on exposing replace and href.
 *
 * @param {object} options
 * @param {Function} options.useLocation
 * @param {*} options.windowLocation
 * @returns {{_id, search, hash}}
 */
const useLocation = ({
  useLocation: useAliasLocation = useLocationRRD,
  windowLocation: aliasWindowLocation = window.location
} = {}) => {
  const location = useAliasLocation();
  const windowLocation = aliasWindowLocation;
  const [updatedLocation, setUpdatedLocation] = useState({});

  useEffect(() => {
    const _id = helpers.generateHash(windowLocation);
    if (updatedLocation?._id !== _id) {
      setUpdatedLocation({
        ...location,
        ...windowLocation,
        _id,
        hash: location?.hash || '',
        search: location?.search || ''
      });
    }
  }, [location, updatedLocation?._id, windowLocation]);

  return updatedLocation;
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
  const { search = '', hash = '' } = useAliasLocation();
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
 * Get a route detail configuration from state.
 *
 * @param {object} options
 * @param {Function} options.t
 * @param {Function} options.useChrome
 * @param {Function} options.useSelector
 * @returns {{baseName: string, errorRoute: object}}
 */
const useRouteDetail = ({
  t = translate,
  useChrome: useAliasChrome = useChrome,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelectors
} = {}) => {
  const { updateDocumentTitle = helpers.noop } = useAliasChrome();
  const [productPath] = useAliasSelector([({ view }) => view?.product?.config]);
  const [detail, setDetail] = useState({});

  useEffect(() => {
    if (productPath && detail?._passed !== productPath) {
      const { allConfigs, configs, firstMatch, isClosest } = routerHelpers.getRouteConfigByPath({
        pathName: productPath
      });

      // Set document title
      updateDocumentTitle(
        `${helpers.UI_DISPLAY_NAME}: ${t(`curiosity-view.title`, {
          appName: helpers.UI_DISPLAY_NAME,
          context: firstMatch?.productGroup
        })}`
      );

      // Set route detail
      setDetail({
        _passed: productPath,
        allConfigs,
        firstMatch,
        errorRoute: routerHelpers.errorRoute,
        isClosest,
        productGroup: firstMatch?.productGroup,
        productConfig: (configs?.length && configs) || [],
        productPath
      });
    }
  }, [detail?._passed, productPath, t, updateDocumentTitle]);

  return detail;
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
   * This hook defaults to merging search objects instead of overwriting them.
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

/**
 * Store product path, parameter, in state. We're opting to use "window.location.pathname"
 * directly since it appears to be quicker, and returns a similar structured value as useParam.
 *
 * @param {object} options
 * @param {Function} options.useSelector
 * @param {Function} options.useDispatch
 * @param {*} options.windowLocation
 * @returns {*|string}
 */
const useSetRouteDetail = ({
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelectors,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  windowLocation: aliasWindowLocation = window.location
} = {}) => {
  const dispatch = useAliasDispatch();
  const [updatedPath] = useAliasSelector([({ view }) => view?.product?.config]);
  const { pathname: productPath } = aliasWindowLocation;

  useEffect(() => {
    if (productPath && updatedPath !== productPath) {
      dispatch({
        type: reduxTypes.app.SET_PRODUCT,
        config: productPath
      });
    }
  }, [updatedPath, dispatch, productPath]);

  return updatedPath;
};

const context = {
  useLocation,
  useNavigate,
  useRouteDetail,
  useSearchParams,
  useSetRouteDetail
};

export { context as default, context, useLocation, useNavigate, useRouteDetail, useSearchParams, useSetRouteDetail };
