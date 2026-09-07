import React from 'react';
import { createRoot } from 'react-dom/client';
import AppEntry from './AppEntry';
import { sanitizeOidcParams } from './components/router/routerHelpers';

/**
 * @memberof Base
 * @module Bootstrap
 */

/**
 * Strip OIDC/Keycloak callback params from the URL fragment before React mounts.
 * Covers the initial page-load case; proxy-mode is handled reactively
 * in useSetRouteProduct via a useEffect watching the URL.
 */
const cleanUrl = sanitizeOidcParams({
  search: window.location.search,
  hash: window.location.hash
});
if (cleanUrl.search !== window.location.search || cleanUrl.hash !== window.location.hash) {
  window.history.replaceState(null, '', window.location.pathname + cleanUrl.search + cleanUrl.hash);
}

/**
 * Find root element within HTML template.
 *
 * @type {HTMLElement}
 */
const element = document.getElementById('root');

/**
 * Attach application to the root element, html
 *
 * @callback Render
 */
if (element) {
  element.setAttribute('data-ouia-safe', true);
  createRoot(element).render(<AppEntry />);
}
