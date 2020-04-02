import { appName, navigation, platformLandingRedirect, platformModalRedirect, routes } from '../routerTypes';

describe('RouterTypes', () => {
  it('should return specific properties', () => {
    expect(appName).toMatchSnapshot('appName');
    expect(navigation).toMatchSnapshot('navigation');
    expect(platformLandingRedirect).toMatchSnapshot('platformLandingRedirect');
    expect(platformModalRedirect).toMatchSnapshot('platformModalRedirect');
    expect(routes).toMatchSnapshot('routes');
  });
});
