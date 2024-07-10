/**
 * Global app related hooks.
 *
 * @memberof Hooks
 * @module UseApp
 */

/**
 * Simplistic "is the app loaded" hook.
 *
 * @returns {Function}
 */
const useAppLoad =
  () =>
  (target = document.querySelector('.curiosity')) =>
    target !== null;

const appHooks = {
  useAppLoad
};

export { appHooks as default, appHooks, useAppLoad };
