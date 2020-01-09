import { navigation, platformRedirect, routes } from '../routerTypes';

describe('RouterTypes', () => {
  it('should return specific properties', () => {
    expect(navigation).toMatchSnapshot('navigation');
    expect(platformRedirect).toMatchSnapshot('platformRedirect');
    expect(routes).toMatchSnapshot('routes');
  });
});
