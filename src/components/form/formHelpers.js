import { helpers } from '../../common/helpers';

/**
 * A consistent mock event object to "help" PF.
 *
 * @memberof Form
 * @module FormHelpers
 */

/**
 * Create a consistent mock event object modeled on JS behavior.
 *
 * @param {object} event
 * @param {boolean} persistEvent
 * @returns {{keyCode, currentTarget: {}, name, checked: *, id: *, persist: Function, value, target: {}}}
 */
const createMockEvent = (event, persistEvent = false) => {
  const { checked, currentTarget = {}, keyCode, persist = helpers.noop, target = {} } = { ...event };
  if (persistEvent) {
    persist();
  }

  return {
    checked: checked ?? currentTarget?.checked,
    currentTarget,
    keyCode,
    id: currentTarget.id || currentTarget.name,
    name: currentTarget.name,
    persist,
    value: currentTarget.value,
    target
  };
};

/**
 * Confirm a string has minimum length.
 *
 * @param {string} value
 * @param {number} characters
 * @returns {boolean}
 */
const doesNotHaveMinimumCharacters = (value, characters = 1) =>
  (typeof value === 'string' && value.length < characters) || typeof value !== 'string';

const formHelpers = {
  createMockEvent,
  doesNotHaveMinimumCharacters
};

export { formHelpers as default, formHelpers, createMockEvent, doesNotHaveMinimumCharacters };
