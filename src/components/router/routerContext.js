import React, { useContext } from 'react';
import { helpers } from '../../common/helpers';

/**
 * Route context.
 *
 * @type {React.Context<{}>}
 */
const DEFAULT_CONTEXT = [
  { routeDetail: { baseName: null, errorRoute: null, routes: [], routeItem: {} } },
  helpers.noop
];

const RouterContext = React.createContext(DEFAULT_CONTEXT);

/**
 * Get an updated router context.
 *
 * @returns {React.Context<{}>}
 */
const useRouterContext = () => useContext(RouterContext);

/**
 * Get a route detail from router context.
 *
 * @param {object} hooks
 * @param {Function} hooks.useRouterContext
 * @returns {{routes: Array, routeItem: object, baseName: string, errorRoute: object}}
 */
const useRouteDetail = ({ useRouterContext: useAliasRouterContext = useRouterContext } = {}) => {
  const { routeDetail } = useAliasRouterContext();
  return routeDetail;
};

const context = {
  RouterContext,
  DEFAULT_CONTEXT,
  useRouterContext,
  useRouteDetail
};

export { context as default, context, RouterContext, DEFAULT_CONTEXT, useRouterContext, useRouteDetail };
