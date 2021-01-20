import { formHelpers } from '../formHelpers';

describe('FormHelpers', () => {
  it('should have specific helpers', () => {
    expect(formHelpers).toMatchSnapshot('helpers');
  });

  it('should return a mocked event object', () => {
    expect(formHelpers.createMockEvent()).toMatchSnapshot('mock event');
  });

  it('should return a boolean for not having the correct number of characters', () => {
    expect(formHelpers.doesNotHaveMinimumCharacters(null)).toMatchSnapshot('null');
    expect(formHelpers.doesNotHaveMinimumCharacters(undefined)).toMatchSnapshot('undefined');
    expect(formHelpers.doesNotHaveMinimumCharacters({})).toMatchSnapshot('plain object');
    expect(formHelpers.doesNotHaveMinimumCharacters([])).toMatchSnapshot('array');
    expect(formHelpers.doesNotHaveMinimumCharacters('l', 1)).toMatchSnapshot('string, 1 chars expect 1');
    expect(formHelpers.doesNotHaveMinimumCharacters('lo', 2)).toMatchSnapshot('string, 2 chars expect 2');
    expect(formHelpers.doesNotHaveMinimumCharacters('lor', 2)).toMatchSnapshot('string, 3 chars expect 2');
    expect(formHelpers.doesNotHaveMinimumCharacters('lore', 5)).toMatchSnapshot('string, 4 chars expect 5');
    expect(formHelpers.doesNotHaveMinimumCharacters('lorem', 5)).toMatchSnapshot('string, 5 chars expect 5');
  });
});
