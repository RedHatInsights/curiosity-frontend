import React from 'react';
import ReactDOM from 'react-dom';
import AppEntry from './AppEntry';

/**
 * @memberof Base
 * @module Bootstrap
 */

/**
 * Root element within HTML template.
 *
 * @type {HTMLElement}
 */
const root = document.getElementById('root');

/**
 * Attach application to the root element, html
 *
 * @callback Render
 */
ReactDOM.render(<AppEntry />, root, () => root.setAttribute('data-ouia-safe', true));
