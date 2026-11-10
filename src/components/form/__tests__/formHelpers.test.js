import { createMockEvent, doesNotHaveMinimumCharacters, formHelpers } from '../formHelpers';
import { helpers } from '../../../common';

describe('FormHelpers', () => {
  it('exports the named helpers through the helper object', () => {
    expect(Object.keys(formHelpers).sort()).toEqual(['createMockEvent', 'doesNotHaveMinimumCharacters']);
    expect(formHelpers.createMockEvent).toBe(createMockEvent);
    expect(formHelpers.doesNotHaveMinimumCharacters).toBe(doesNotHaveMinimumCharacters);
  });

  it('returns the supplied mock event values', () => {
    const persist = jest.fn();
    const event = {
      checked: true,
      currentTarget: {
        checked: false,
        id: 'current-id',
        name: 'current-name',
        value: 'current-value'
      },
      keyCode: 13,
      persist,
      target: {
        checked: false,
        id: 'target-id',
        name: 'target-name',
        value: 'target-value'
      }
    };
    const expectedCurrentTarget = helpers.TEST_MODE ? event.target : event.currentTarget;

    expect(createMockEvent()).toEqual({
      checked: undefined,
      currentTarget: {},
      id: undefined,
      keyCode: undefined,
      name: undefined,
      persist: expect.any(Function),
      target: {},
      value: undefined
    });
    expect(createMockEvent(event)).toEqual({
      checked: true,
      currentTarget: expectedCurrentTarget,
      id: expectedCurrentTarget.id || expectedCurrentTarget.name,
      keyCode: 13,
      name: expectedCurrentTarget.name,
      persist,
      target: event.target,
      value: event.currentTarget.value
    });
    expect(persist).not.toHaveBeenCalled();

    createMockEvent(event, true);
    expect(persist).toHaveBeenCalledTimes(1);
  });

  it('uses one character as the default minimum', () => {
    expect(doesNotHaveMinimumCharacters('')).toBe(true);
    expect(doesNotHaveMinimumCharacters('l')).toBe(false);
  });

  it.each([
    { value: null, characters: 5, expected: true, description: 'null input' },
    { value: undefined, characters: 5, expected: true, description: 'undefined input' },
    { value: {}, characters: 5, expected: true, description: 'object input' },
    { value: [], characters: 5, expected: true, description: 'array input' },
    { value: 1, characters: 1, expected: true, description: 'number input' },
    { value: 'l', characters: 2, expected: true, description: 'short string' },
    { value: 'lo', characters: 2, expected: false, description: 'string at the minimum' },
    { value: 'lor', characters: 2, expected: false, description: 'string longer than the minimum' },
    { value: 'lorem', characters: 5, expected: false, description: 'string at the minimum length' },
    { value: 'lorem', characters: 6, expected: true, description: 'string below the minimum length' }
  ])('reports minimum-character state for $description', ({ value, characters, expected }) => {
    expect(doesNotHaveMinimumCharacters(value, characters)).toBe(expected);
  });
});
