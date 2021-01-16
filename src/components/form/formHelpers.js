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
  doesNotHaveMinimumCharacters
};

export { formHelpers as default, formHelpers, doesNotHaveMinimumCharacters };
