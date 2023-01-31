import { useHistory as useHistoryRRD, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import { useRouteDetail } from '../components/router/routerContext';
import { routerHelpers } from '../components/router/routerHelpers';

/**
 * Pass useHistory methods. Proxy useHistory push with Platform specific navigation update.
 *
 * @param {object} options
 * @param {Function} options.useHistory
 * @returns {object}
 */
const useHistory = ({ useHistory: useAliasHistory = useHistoryRRD } = {}) => {
  const history = useAliasHistory();

  return {
    ...history,
    push: (pathLocation, historyState) => {
      const pathName = (typeof pathLocation === 'string' && pathLocation) || pathLocation?.pathname;
      const { firstMatch } = routerHelpers.getRouteConfigByPath({ pathName });
      const { hash, search } = window.location;

      return history?.push(
        (firstMatch?.productPath && `${routerHelpers.pathJoin('/', firstMatch?.productPath)}${search}${hash}`) ||
          (pathName && `${pathName}${search}${hash}`) ||
          pathLocation,
        historyState
      );
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
