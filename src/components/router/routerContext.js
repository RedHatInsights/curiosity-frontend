import { useCallback, useEffect, useState } from 'react';
// import _memoize from 'lodash/memoize';
// import { useShallowCompareEffect } from 'react-use';
import {
  useLocation as useLocationRRD,
  useNavigate as useRRDNavigate,
  // useParams,
  // useParams as useRRDParams,
  useSearchParams as useRRDSearchParams
} from 'react-router-dom';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { routerHelpers } from './routerHelpers';
import { helpers } from '../../common/helpers';
import { storeHooks, reduxTypes } from '../../redux';
import { translate } from '../i18n/i18n';

/**
 * ToDo: Review react-router-dom useParams once v6 updates are in env
 * During implementation testing react-router-dom "useParams" was helping spawn multiple
 * component refreshes so we rolled our own.
 *
 * We were unable to tell if this was a combination of
 * using the proxy combined with v5 of router. The most noticeable double (to sometimes triple)
 * refresh is jumping between OpenShift Subs and RHEL Subs, unclear if there's some
 * special left navigation at play here, or simply the lazy load of the component associated with
 * the path.
 *
 * On a personal note...
 * react-router has always been between the category of "close enough" and "[roll your own router or ... not]"...
 * this new version doesn't do itself any favors, it tries to do more and ends up just
 * offsetting some of the odd original loading issues we had. The current goal is to just
 * get something working close enough.
 */
/**
 * We ignore react router doms useParams.
 *
 * @returns {{productPath: string}}
 */
/*
const useParams = () => {
  const productPath = routerHelpers.dynamicProductParameter();
  console.log('>>>> run set params', productPath);
  return { productPath };
};
*/
/* using the outside cache busts the reload...
const testParamsCache = {};
const useParams = () => {
  // const productPath = routerHelpers.dynamicProductParameter();
  // console.log('>>>> run set params', productPath);
  // return { productPath };
  const [params, setParams] = useState({});
  const productPath = routerHelpers.dynamicProductParameter();

  useEffect(() => {
    if (testParamsCache.productPath !== productPath) {
      console.log('>>>> run set params', testParamsCache.productPath, productPath);
      setParams({ productPath });
      testParamsCache.productPath = productPath;
    }
  }, [productPath]);

  return params;
};
*/
const useParams = () => {
  // const productPath = routerHelpers.dynamicProductParameter();
  // console.log('>>>> run set params', productPath);
  // return { productPath };
  const [params, setParams] = useState({});
  const productPath = routerHelpers.dynamicProductParameter();

  useEffect(() => {
    if (productPath && params.productPath !== productPath) {
      console.log('>>>> run set params', params.productPath, productPath);
      setParams({ productPath });
    }
  }, [params.productPath, productPath]);

  return params;
};

/*
const useParams = ({ useParams: useAliasParams = useRRDParams } = {}) => {
  const { productPath } = useAliasParams();
  // return { productPath };
  /*
  const { productPath } = useAliasParams();
  const [updatedProductPath, setUpdatedProductPath] = useState(productPath);
  console.log('>>>> run set params', productPath);

  useEffect(() => {
    if (productPath !== updatedProductPath) {
      console.log('>>>> UPDATE SET PARAMS', productPath);
      setUpdatedProductPath(productPath);
    }
  }, [productPath, updatedProductPath]);

  return { productPath: updatedProductPath };
  * /

  console.log('>>>> run params', productPath);

  return useMemo(() => {
    console.log('>>>> SET PARAMS', productPath);
    return { productPath };
  }, [productPath]);

  /*
  useShallowCompareEffect(() => {
    // useShallowCompare
    // useDeepCompare
    // if (!_isEqual(updatedParams, params)) {
    console.log('>>>> UPDATE SET PARAMS', params);
    setUpdatedParams(params);
    // }
  }, [params]);
  * /
};
 */

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
  const [updatedLocation, setUpdatedLocation] = useState({});

  useEffect(() => {
    const _id = helpers.generateHash(windowLocation);
    if (updatedLocation?._id !== _id) {
      console.log('>>>> set use location', _id);
      setUpdatedLocation({
        ...location,
        ...windowLocation,
        _id,
        replace: path => windowLocation.replace(path),
        hash: location?.hash || '',
        set href(path) {
          windowLocation.href = path;
        },
        search: location?.search || ''
      });
    }
  }, [location, updatedLocation?._id, windowLocation]);

  return updatedLocation;

  /*
  const { location: windowLocation } = window;
  console.log('>>>> set use location', useAliasLocation.toString());
  return useMemo(
    () => ({
      ...windowLocation,
      replace: path => windowLocation.replace(path),
      set href(path) {
        windowLocation.href = path;
      }
    }),
    [windowLocation]
  );
  */
  /*
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
  */
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
  const { hash = '', search = '', ...location } = useAliasLocation();

  /**
   * redirect
   *
   * @param {string} route
   * @returns {void}
   */
  return useCallback(
    (route, { isReplace = true } = {}) => {
      console.log('>>> use redirect fired', route);
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

const useSetRouteDetail = ({
  useParams: useAliasParams = useParams,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelectors,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch
} = {}) => {
  const dispatch = useAliasDispatch();
  const { productPath } = useAliasParams();
  const [updatedPath] = useAliasSelector([({ view }) => view?.product?.config]);

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

/**
 * Get a route detail from router context.
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
  const { updateDocumentTitle } = useAliasChrome();
  const [productPath] = useAliasSelector([({ view }) => view?.product?.config]);
  const [detail, setDetail] = useState({});
  console.log('>>> use route detail', productPath);

  useEffect(() => {
    if (productPath && detail?._passed !== productPath) {
      const { allConfigs, configs, firstMatch } = routerHelpers.getRouteConfigByPath({ pathName: productPath });
      console.log('>>> SET ROUTE DETAIL', firstMatch?.productGroup, detail?._passed, productPath);
      const updateDetail = {
        _passed: productPath,
        allProductConfigs: allConfigs,
        firstMatch,
        errorRoute: routerHelpers.errorRoute,
        productGroup: firstMatch?.productGroup,
        productConfig: (configs?.length && configs) || [],
        productPath
      };
      updateDocumentTitle(
        `${helpers.UI_DISPLAY_NAME}: ${t(`curiosity-view.title`, {
          appName: helpers.UI_DISPLAY_NAME,
          context: firstMatch?.productGroup
        })}`
      );
      setDetail(updateDetail);
    }
  }, [detail?._passed, productPath, t, updateDocumentTitle]);

  return detail;

  /* 3x same
  const [productPath] = useAliasSelector([({ view }) => view?.product?.config]);

  return useMemo(() => {
    const { allConfigs, configs, firstMatch } = routerHelpers.getRouteConfigByPath({ pathName: productPath });
    console.log('>>> SET ROUTE DETAIL', firstMatch?.productGroup, firstMatch?.productId);
    return {
      allProductConfigs: allConfigs,
      firstMatch,
      errorRoute: routerHelpers.errorRoute,
      productGroup: firstMatch?.productGroup,
      productConfig: (configs?.length && configs) || [],
      productPath
    };
  }, [productPath]);
   */

  /* 3x, possibly more due to set state
  const [productPath] = useAliasSelector([({ view }) => view?.product?.config]);
  const [detail, setDetail] = useState({});
  console.log('>>> use route detail', productPath);

  useEffect(() => {
    if (productPath && detail?._passed !== productPath) {
      const { allConfigs, configs, firstMatch } = routerHelpers.getRouteConfigByPath({ pathName: productPath });
      console.log('>>> SET ROUTE DETAIL', firstMatch?.productGroup, detail?._passed, productPath);
      const updateDetail = {
        _passed: productPath,
        allProductConfigs: allConfigs,
        firstMatch,
        errorRoute: routerHelpers.errorRoute,
        productGroup: firstMatch?.productGroup,
        productConfig: (configs?.length && configs) || [],
        productPath
      };
      setDetail(updateDetail);
    }
  }, [detail?._passed, productPath]);

  return detail;
  */
  /* same 3x redraw
  const [productPath] = useAliasSelector([({ view }) => view?.product?.config]);
  const { allConfigs, configs, firstMatch } = routerHelpers.getRouteConfigByPath({ pathName: productPath });
  console.log('>>> SET ROUTE DETAIL', firstMatch?.productGroup, firstMatch?.productId);
  const [detail] = useState({
    allProductConfigs: allConfigs,
    firstMatch,
    errorRoute: routerHelpers.errorRoute,
    productGroup: firstMatch?.productGroup,
    productConfig: (configs?.length && configs) || [],
    productPath
  });

  return detail;
  */
  /* same 3x redraw
  const [productPath] = useAliasSelector([({ view }) => view?.product?.config]);
  const { allConfigs, configs, firstMatch } = routerHelpers.getRouteConfigByPath({ pathName: productPath });
  console.log('>>> SET ROUTE DETAIL', firstMatch?.productGroup, firstMatch?.productId);
  const detail = {
    allProductConfigs: allConfigs,
    firstMatch,
    errorRoute: routerHelpers.errorRoute,
    productGroup: firstMatch?.productGroup,
    productConfig: (configs?.length && configs) || [],
    productPath
  };

  return { ...detail };
  */
  /*
  const [detail, setDetail] = useState({});
  console.log('>>> use route detail', productPath);

  useEffect(() => {
    if (productPath && detail?.productPath !== productPath) {
      const { allConfigs, configs, firstMatch } = routerHelpers.getRouteConfigByPath({ pathName: productPath });
      console.log('>>> SET ROUTE DETAIL', firstMatch?.productGroup, firstMatch?.productId);
      const updateDetail = {
        allProductConfigs: allConfigs,
        firstMatch,
        errorRoute: routerHelpers.errorRoute,
        productGroup: firstMatch?.productGroup,
        productConfig: (configs?.length && configs) || [],
        productPath
      };
      setDetail(updateDetail);
    }
  }, [detail?.productPath, productPath]);
  */
};

const useRouteDetailWorkingish = ({
  useParams: useAliasParams = useParams,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelectors,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch
} = {}) => {
  const dispatch = useAliasDispatch();
  const { productPath } = useAliasParams();
  const [detail = {}] = useAliasSelector([({ view }) => view?.product?.config]);
  // const [detail, setDetail] = useState();
  console.log('>>> use route detail', productPath);

  useEffect(() => {
    if (productPath && detail?.productPath !== productPath) {
      const { allConfigs, configs, firstMatch } = routerHelpers.getRouteConfigByPath({ pathName: productPath });
      console.log(
        '>>> SET ROUTE DETAIL',
        `det.prodPath=${detail?.productPath}`,
        `prodPath=${productPath}`,
        configs.length,
        firstMatch?.productGroup
      );
      const updateDetail = {
        allProductConfigs: allConfigs,
        firstMatch,
        errorRoute: routerHelpers.errorRoute,
        productGroup: firstMatch?.productGroup,
        productConfig: (configs?.length && configs) || [],
        productPath
      };
      // setDetail(updateDetail);
      dispatch({
        type: reduxTypes.app.SET_PRODUCT,
        config: updateDetail
      });
    }
  }, [detail?.productPath, dispatch, productPath]);

  return detail;

  /*
  const doIt = _memoize(pp => {
    const { allConfigs, configs, firstMatch } = routerHelpers.getRouteConfigByPath({ pathName: pp });
    console.log('>>> SET ROUTE DETAIL', pp, configs.length, firstMatch?.productGroup);
    return {
      allProductConfigs: allConfigs,
      firstMatch,
      errorRoute: routerHelpers.errorRoute,
      productGroup: firstMatch?.productGroup,
      productConfig: (configs?.length && configs) || []
    };
  });

  return doIt(productPath);
  */
  /*
  return useMemo(() => {
    const { allConfigs, configs, firstMatch } = routerHelpers.getRouteConfigByPath({ pathName: productPath });
    console.log('>>> SET ROUTE DETAIL', productPath, configs.length, firstMatch?.productGroup);
    return {
      allProductConfigs: allConfigs,
      firstMatch,
      errorRoute: routerHelpers.errorRoute,
      productGroup: firstMatch?.productGroup,
      productConfig: (configs?.length && configs) || []
    };
  }, [productPath]);
  */
  /*
  const { productPath } = useAliasParams();
  const { allConfigs, configs, firstMatch } = routerHelpers.getRouteConfigByPath({ pathName: productPath });
  console.log('>>> USE ROUTE DETAIL', productPath, configs.length, firstMatch?.productGroup);

  return {
    allProductConfigs: allConfigs,
    firstMatch,
    errorRoute: routerHelpers.errorRoute,
    productGroup: firstMatch?.productGroup,
    productConfig: (configs?.length && configs) || []
  };
  */
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
  useSetRouteDetail,
  useRouteDetailWorkingish,
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
  useSetRouteDetail,
  useRouteDetail,
  useSearchParams
};
