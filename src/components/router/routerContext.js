import React from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';

/**
 * Router context.
 *
 * @type {React.Context<{}>}
 */
const RouterContext = React.createContext({});

/**
 * Expose router context.
 *
 * @returns {*}
 */
const useRouteContext = () => React.useContext(RouterContext);

/**
 * Expose custom router detail object.
 *
 * @param {*} value
 * @returns {{}|null}
 */
const useRouteDetail = (value = {}) => {
  const { routeDetail = value } = useRouteContext();
  return routeDetail;
};

/**
 * Expose custom router location object.
 *
 * @param {*} value
 * @returns {{}|null}
 */
const useLocation = (value = {}) => {
  const { location = value } = useRouteContext();
  return location;
};

export {
  RouterContext as default,
  RouterContext,
  useHistory,
  useLocation,
  useParams,
  useRouteContext,
  useRouteDetail,
  useRouteMatch
};
