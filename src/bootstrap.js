import React from 'react';
import { createRoot } from 'react-dom/client';
import AppEntry from './AppEntry';

/**
 * @memberof Base
 * @module Bootstrap
 */

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
