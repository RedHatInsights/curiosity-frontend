import { closest } from 'fastest-levenshtein';
import { helpers } from '../../common/helpers';
import { productConfig } from '../../config';

/**
 * @memberof Router
 * @module RouterHelpers
 */

/**
 * Platform name/id.
 *
 * @type {string}
 */
const appName = helpers.UI_NAME;

/**
 * OIDC/Keycloak OAuth callback params that the Chrome shell may leave in the URL
 * after a silent token refresh. Used to strip them at bootstrap time and reactively.
 *
 * @type {string[]}
 */
const OIDC_FRAGMENT_PARAMS = [
  'access_token',
  'code',
  'error',
  'error_description',
  'expires_in',
  'id_token',
  'iss',
  'kc_action',
  'kc_action_status',
  'response',
  'session_state',
  'state',
  'token_type'
];

/**
 * Remove OIDC callback parameters from the current URL while preserving
 * application parameters such as global filters and partner links.
 *
 * @param {object} params
 * @param {string} [params.search='']
 * @param {string} [params.hash='']
 * @returns {{search: string, hash: string}}
 */
const sanitizeOidcParams = ({ search = '', hash = '' } = {}) => {
  const searchParams = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  OIDC_FRAGMENT_PARAMS.forEach(param => searchParams.delete(param));

  const rawHash = hash.startsWith('#') ? hash.slice(1) : hash;
  const remainingHash = rawHash
    .split('&')
    .filter(entry => entry.length > 0 && !OIDC_FRAGMENT_PARAMS.includes(entry.split('=')[0]))
    .join('&');

  return {
    search: searchParams.toString() ? `?${searchParams.toString()}` : '',
    hash: remainingHash ? `#${remainingHash}` : ''
  };
};

/**
 * The app baseName. Return an assumed route baseName directory based on existing app name.
 * App name is defined in dotenv and package.json/insights.appname
 * [environment]/[OPTIONAL]/[OPTIONAL]/[APP NAME]
 *
 * @param {object} params
 * @param {string} params.pathName
 * @param {string} params.appName
 * @returns {string}
 */
const dynamicBaseName = ({ pathName = window.location.pathname, appName: applicationName = helpers.UI_NAME } = {}) =>
  `${pathName.split(applicationName)[0]}${applicationName}`;

/**
 * App basePath. Return a base path.
 *
 * @param {object} params
 * @param {string} params.pathName
 * @param {string} params.appName
 * @returns {string}
 */
const dynamicBasePath = ({ pathName = window.location.pathname, appName: applicationName = helpers.UI_NAME } = {}) =>
  pathName.split(applicationName)[0];

/**
 * App basePath. Return a base path.
 *
 * @param {object} params
 * @param {string} params.pathName
 * @param {string} params.appName
 * @returns {string}
 */
const dynamicPath = ({ pathName = window.location.pathname, appName: applicationName = helpers.UI_NAME } = {}) =>
  pathName.split(applicationName)[1];

/**
 * Decode URL-encoded characters and strip irrelevant segments to provide exact product configuration matches.
 *
 * @param {object} params
 * @param {string} params.pathName
 * @param {string} params.appName
 * @returns {string | undefined}
 */
const cleanPath = ({ pathName, appName: applicationName = helpers.UI_NAME } = {}) => {
  let updatedPathName = pathName;

  if (updatedPathName) {
    try {
      updatedPathName = decodeURIComponent(updatedPathName);
      updatedPathName = new URL(updatedPathName).pathname;
    } catch {
      // ignore
    }
  }

  return updatedPathName
    ?.toLowerCase()
    ?.split('#')?.[0]
    ?.split('?')?.[0]
    ?.replace(/^\/*|\/*$/g, '')
    ?.replace(new RegExp(applicationName, 'i'), '')
    ?.replace(/\/\//g, '/');
};

/**
 * Match pre-sorted route config entries with a path, or match with a fallback.
 * This is the primary engine for curiosity routing. It can account for a full window.location.pathname
 * given the appropriate alias, group, product, and/or path identifiers provided with product configuration.
 *
 * @param {object} params
 * @param {string} params.pathName
 * @param {Array} [params.configs]
 * @param {cleanPath} [params.cleanPath]
 * @returns {{configs: *, firstMatch: *, isClosest: boolean, allConfigs: Array}}
 */
const getRouteConfigByPath = helpers.memo(
  ({ pathName, configs = productConfig.sortedConfigs, cleanPath: aliasCleanPath = cleanPath } = {}) => {
    const { byAnything, byAnythingPathIds, byAnythingVariants, byProductIdConfigs } = configs();
    const trimmedPathName = aliasCleanPath({ pathName });

    // Do a known comparison against alias, group, product, path identifiers
    const focusedStr = byAnythingPathIds.find(value => value.toLowerCase() === trimmedPathName?.split('/')?.pop());

    // Fallback attempt, match pathName with the closest string
    const closestStr = trimmedPathName && closest(trimmedPathName, byAnythingPathIds);
    const configsByAnything = byAnything?.[focusedStr || closestStr];
    const availableVariants = byAnythingVariants?.[focusedStr || closestStr];

    return {
      isClosest: !focusedStr,
      allConfigs: Object.values(byProductIdConfigs),
      availableVariants,
      configs: configsByAnything,
      firstMatch: configsByAnything?.[0]
    };
  }
);

/**
 * Confirm a path segment is an exact, known product identifier.
 *
 * Compares against the same identifier listing getRouteConfigByPath uses for exact matching, i.e. productGroups,
 * productIds, productLabels, productPaths, aliases, and productVariants. Segments that only resolve through the
 * Levenshtein "closest match" fallback are intentionally excluded, they are not canonical identifiers.
 *
 * @param {object} params
 * @param {string} params.pathId
 * @param {Array} [params.configs]
 * @returns {boolean}
 */
const isProductPathId = ({ pathId, configs = productConfig.sortedConfigs } = {}) => {
  let decodedPathId = pathId;

  try {
    decodedPathId = decodeURIComponent(pathId);
  } catch {
    // ignore
  }

  const comparePathId = decodedPathId?.toLowerCase();

  return (comparePathId && configs().byAnythingPathIds.some(value => value.toLowerCase() === comparePathId)) || false;
};

/**
 * Return a path for a product identifier, relative to the application's current mount point.
 *
 * The identifier is nested below its product group, i.e. "/subscriptions/usage/rhel/RHEL%20for%20ARM". The
 * platform "Chroming" navigation resolves its active item by prefix matching the pathname against its
 * registered nav links, see deploy/frontend.yaml. Keeping the group path as a prefix leaves the left
 * navigation expanded, the item highlighted, and the breadcrumb trail intact. A sibling path, i.e.
 * "/subscriptions/usage/<variant>", matches no nav item and collapses them.
 *
 * Any product identifiers already on the path are rewound first, so repeated selections replace rather than
 * accumulate, and alias paths are canonicalized. Working from the live pathname, instead of a generated
 * baseName, keeps every deployed mount point intact, i.e. "/subscriptions/usage", "/insights/subscriptions",
 * "/openshift/subscriptions", plus any environment prefix such as "/beta".
 *
 * Note: product identifiers can contain spaces, i.e. "RHEL for ARM", and are encoded accordingly.
 *
 * @param {object} params
 * @param {string} [params.pathName]
 * @param {string} params.productId
 * @param {getRouteConfigByPath} [params.getRouteConfigByPath]
 * @param {isProductPathId} [params.isProductPathId]
 * @returns {string}
 */
const getProductPath = ({
  pathName = window.location.pathname,
  productId,
  getRouteConfigByPath: aliasGetRouteConfigByPath = getRouteConfigByPath,
  isProductPathId: aliasIsProductPathId = isProductPathId
} = {}) => {
  if (!productId) {
    return pathName;
  }

  const segments = `${pathName}`.replace(/\/+$/, '').split('/');

  // Rewind past any product identifiers, back to the application mount point
  while (segments.length > 1 && aliasIsProductPathId({ pathId: segments[segments.length - 1] })) {
    segments.pop();
  }

  const productPath = aliasGetRouteConfigByPath({ pathName: productId })?.firstMatch?.productPath;

  if (productPath && productPath.toLowerCase() !== productId.toLowerCase()) {
    segments.push(encodeURIComponent(productPath));
  }

  segments.push(encodeURIComponent(productId));

  return segments.join('/');
};

/**
 * Parse search parameters from a string, using a set for "uniqueness"
 *
 * @param {string} currentPathAndOrSearch
 * @returns {{}}
 */
const parseSearchParams = helpers.memo((currentPathAndOrSearch = window.location.search) => {
  const { decodeURIComponent, URLSearchParams } = window;
  const parsedSearch = {};

  [
    ...new Set(
      [...new URLSearchParams(decodeURIComponent(currentPathAndOrSearch))].map(([param, value]) => `${param}~${value}`)
    )
  ].forEach(v => {
    const [param, value] = v.split('~');
    parsedSearch[param] = value;
  });

  return parsedSearch;
});

/**
 * Basic path join, minor emulation for path.join. Related to the webpack 5 migration.
 *
 * @param {object} paths
 * @returns {string}
 */
const pathJoin = helpers.memo((...paths) => {
  let updatedPath = Array.from(paths);
  const hasLead = /^\/\//.test(updatedPath[0]);
  updatedPath = updatedPath
    .join('/')
    .replace(/(\/\/)+/g, '~')
    .replace(/~/g, '/')
    .replace(/\/\//g, '/');

  if (hasLead) {
    updatedPath = `/${updatedPath}`;
  }

  return updatedPath;
});

const routerHelpers = {
  appName,
  cleanPath,
  dynamicBaseName,
  dynamicBasePath,
  dynamicPath,
  getProductPath,
  getRouteConfigByPath,
  isProductPathId,
  OIDC_FRAGMENT_PARAMS,
  sanitizeOidcParams,
  parseSearchParams,
  pathJoin
};

export {
  routerHelpers as default,
  routerHelpers,
  appName,
  cleanPath,
  dynamicBaseName,
  dynamicBasePath,
  dynamicPath,
  getProductPath,
  getRouteConfigByPath,
  isProductPathId,
  OIDC_FRAGMENT_PARAMS,
  sanitizeOidcParams,
  parseSearchParams,
  pathJoin
};
