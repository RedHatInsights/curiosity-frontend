import { platformTypes } from '../types';
import { platformServices } from '../../services/platformServices';

const initializeChrome = () => ({
  type: platformTypes.PLATFORM_INIT,
  payload: platformServices.initializeChrome()
});

const onNavigation = callback => ({
  type: platformTypes.PLATFORM_ON_NAV,
  payload: platformServices.onNavigation(callback),
  meta: {
    data: { callback }
  }
});

const setAppName = name => ({
  type: platformTypes.PLATFORM_APP_NAME,
  payload: platformServices.setAppName(name),
  meta: {
    data: { name }
  }
});

const setNavigation = data => ({
  type: platformTypes.PLATFORM_SET_NAV,
  payload: platformServices.setNavigation(data),
  meta: { data }
});

const platformActions = { initializeChrome, onNavigation, setAppName, setNavigation };

export { platformActions as default, platformActions, initializeChrome, onNavigation, setAppName, setNavigation };
