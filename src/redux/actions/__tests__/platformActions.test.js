import { platformActions } from '../platformActions';
import { helpers } from '../../../common';

describe('PlatformActions', () => {
  beforeAll(() => {
    window.insights = {
      chrome: {
        auth: helpers.noop,
        identifyApp: helpers.noop,
        init: helpers.noop,
        navigation: helpers.noop,
        on: helpers.noop
      }
    };
  });

  it('Should return a dispatch object for the initializeChrome method', () => {
    expect(platformActions.initializeChrome()).toMatchSnapshot('dispatch object');
  });

  it('Should return a dispatch object for the onNavigation method', () => {
    expect(platformActions.onNavigation()).toMatchSnapshot('dispatch object');
  });

  it('Should return a dispatch object for the setAppName method', () => {
    expect(platformActions.setAppName()).toMatchSnapshot('dispatch object');
  });

  it('Should return a dispatch object for the setNavigation method', () => {
    expect(platformActions.setNavigation()).toMatchSnapshot('dispatch object');
  });
});
