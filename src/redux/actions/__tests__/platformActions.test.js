import { platformActions } from '../platformActions';

describe('PlatformActions', () => {
  it('Should return a dispatch object for the hideGlobalFilter method', () => {
    expect(platformActions.hideGlobalFilter()).toMatchSnapshot('dispatch object');
  });

  it('Should return a dispatch object for the initializeChrome method', () => {
    expect(platformActions.initializeChrome()).toMatchSnapshot('dispatch object');
  });

  it('Should return a function for the onNavigation method', () => {
    expect(platformActions.onNavigation()).toMatchSnapshot('function');

    window.insights.chrome.on = jest.fn().mockImplementation((id, value) => value('lorem'));
    const dispatch = obj => obj;
    expect(platformActions.onNavigation(event => `${event} ipsum`)(dispatch)).toMatchSnapshot('expected process');
  });

  it('Should return a dispatch object for the setAppName method', () => {
    expect(platformActions.setAppName()).toMatchSnapshot('dispatch object');
  });

  it('Should return a function for the setAppNav method', () => {
    expect(platformActions.setAppNav()).toMatchSnapshot('function');

    window.insights.chrome.navigation = jest.fn().mockImplementation(value => value);
    const dispatch = obj => obj;
    expect(platformActions.setAppNav('lorem')(dispatch)).toMatchSnapshot('expected process');
  });
});
