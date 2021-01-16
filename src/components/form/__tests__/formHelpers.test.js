import { formHelpers, doesNotHaveMinimumCharacters } from '../formHelpers';

describe('FormHelpers', () => {
  it('should have specific helpers', () => {
    expect(formHelpers).toMatchSnapshot('helpers');
  });

  it('should return a boolean for not having the correct number of characters', () => {
    expect(doesNotHaveMinimumCharacters(null)).toMatchSnapshot('null');
    expect(doesNotHaveMinimumCharacters(undefined)).toMatchSnapshot('undefined');
    expect(doesNotHaveMinimumCharacters({})).toMatchSnapshot('plain object');
    expect(doesNotHaveMinimumCharacters([])).toMatchSnapshot('array');
    expect(doesNotHaveMinimumCharacters('l', 1)).toMatchSnapshot('string, 1 chars expect 1');
    expect(doesNotHaveMinimumCharacters('lo', 2)).toMatchSnapshot('string, 2 chars expect 2');
    expect(doesNotHaveMinimumCharacters('lor', 2)).toMatchSnapshot('string, 3 chars expect 2');
    expect(doesNotHaveMinimumCharacters('lore', 5)).toMatchSnapshot('string, 4 chars expect 5');
    expect(doesNotHaveMinimumCharacters('lorem', 5)).toMatchSnapshot('string, 5 chars expect 5');
  });
});
