import { appName, navigation, platformLandingRedirect, platformModalRedirect, routes } from '../routerConfig';

describe('RouterConfig', () => {
  it('should return specific properties', () => {
    expect(appName).toMatchSnapshot('appName');
    expect(navigation).toMatchSnapshot('navigation');
    expect(platformLandingRedirect).toMatchSnapshot('platformLandingRedirect');
    expect(platformModalRedirect).toMatchSnapshot('platformModalRedirect');
    expect(routes).toMatchSnapshot('routes');
  });

  it('should return a lazy loaded view for every route', () => {
    const lazyLoadComponents = [];

    routes.forEach(({ component, to }) => {
      const routeComponent = Object.getOwnPropertyNames(component)
        .map(prop => (component[prop] || '').toString())
        .find(val => /react/i.test(val));

      if (/lazy/.test(routeComponent)) {
        lazyLoadComponents.push({ routeComponentType: routeComponent, route: to });
      }
    });

    expect(lazyLoadComponents.length).toBe(5);
  });
});
