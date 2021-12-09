import { useHistory as useHistoryRRD, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import { useRouteDetail } from '../components/router/routerContext';
import { routerHelpers } from '../components/router/routerHelpers';
import { reduxActions, storeHooks } from '../redux';

/**
 * Pass useHistory methods. Proxy useHistory push with Platform specific navigation update.
 *
 * @param {object} options
 * @param {boolean} options.isSetAppNav Allow setting the Platform's left navigation if conditions are met, or fallback to  history.push.
 * @param {Function} options.useHistory
 * @param {Function} options.useDispatch
 * @returns {object}
 */
const useHistory = ({
  isSetAppNav = false,
  useHistory: useAliasHistory = useHistoryRRD,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch
} = {}) => {
  const history = useAliasHistory();
  const dispatch = useAliasDispatch();

  return {
    ...history,
    push: (pathLocation, historyState) => {
      const pathName = (typeof pathLocation === 'string' && pathLocation) || pathLocation?.pathname;
      const { productParameter, id, routeHref } = routerHelpers.getRouteConfig({ pathName, id: pathName });
      const { hash, search } = window.location;

      if (isSetAppNav && productParameter) {
        return dispatch(reduxActions.platform.setAppNav(id));
      }

      return history?.push(routeHref || (pathName && `${pathName}${search}${hash}`) || pathLocation, historyState);
    }
  };
};

const routerHooks = {
  useHistory,
  useLocation,
  useParams,
  useRouteDetail,
  useRouteMatch
};

export { routerHooks as default, routerHooks, useHistory, useLocation, useParams, useRouteDetail, useRouteMatch };
