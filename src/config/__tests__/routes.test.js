import { routes } from '../routes';

describe('Routes configuration', () => {
  it('should return generated routes', () => {
    expect(routes.map(({ path }) => path)).toMatchSnapshot('expected paths');
  });
});
