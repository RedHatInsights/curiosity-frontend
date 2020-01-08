import { helpers } from '../helpers';

describe('Helpers', () => {
  it('should have specific functions', () => {
    expect(helpers).toMatchSnapshot('helpers');
  });

  it('should support generated IDs', () => {
    expect(helpers.generateId()).toBe('generatedid-');
    expect(helpers.generateId('lorem')).toBe('lorem-');
  });

  it('should determine a promise', () => {
    expect(helpers.isPromise(Promise.resolve())).toBe(true);
    expect(helpers.isPromise(() => 'lorem')).toBe(false);
  });
});
