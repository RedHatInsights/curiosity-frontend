import { baseName, routes } from '../routerTypes';

describe('RouterTypes', () => {
  it('should return specific properties', () => {
    expect(baseName).toMatchSnapshot('baseName');
    expect(routes).toMatchSnapshot('routes');
  });
});
