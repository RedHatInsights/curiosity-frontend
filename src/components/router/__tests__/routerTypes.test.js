import { appName, navigation, platformRedirect, routes } from '../routerTypes';

describe('RouterTypes', () => {
  it('should return specific properties', () => {
    expect(appName).toMatchSnapshot('appName');
    expect(navigation).toMatchSnapshot('navigation');
    expect(platformRedirect).toMatchSnapshot('platformRedirect');
    expect(routes).toMatchSnapshot('routes');
  });
});
