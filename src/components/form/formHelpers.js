import { helpers } from '../../common/helpers';

/**
 * A consistent mock event object to enhance PF and testing.
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
  let updatedCurrentTarget = currentTarget;
  if (persistEvent) {
    persist();
  }

  if (helpers.TEST_MODE) {
    updatedCurrentTarget = target;
  }

  return {
    checked: checked ?? updatedCurrentTarget?.checked,
    currentTarget: updatedCurrentTarget,
    keyCode,
    id: updatedCurrentTarget.id || updatedCurrentTarget.name,
    name: updatedCurrentTarget.name,
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
