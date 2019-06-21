import { helpers } from '../helpers';

describe('Helpers', () => {
  it('should have specific functions', () => {
    expect(helpers).toMatchSnapshot('helpers');
  });

  it('should support generated IDs', () => {
    expect(helpers.generateId()).toBe('generatedid-');
    expect(helpers.generateId('lorem')).toBe('lorem-');
  });
});
