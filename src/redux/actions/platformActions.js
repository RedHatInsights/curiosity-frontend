import {
  addNotification as RcsAddNotification,
  removeNotification as RcsRemoveNotification,
  clearNotifications as RcsClearNotifications
} from '@redhat-cloud-services/frontend-components-notifications';
import { platformTypes } from '../types';
import { platformServices } from '../../services/platformServices';

const addNotification = data => RcsAddNotification(data);

const removeNotification = id => RcsRemoveNotification(id);

const clearNotifications = () => RcsClearNotifications();

const initializeChrome = () => ({
  type: platformTypes.PLATFORM_INIT,
  payload: platformServices.initializeChrome()
});

const onNavigation = callback => dispatch => {
  dispatch({
    type: platformTypes.PLATFORM_ON_NAV
  });
  return platformServices.onNavigation(callback);
};

const setAppName = name => ({
  type: platformTypes.PLATFORM_APP_NAME,
  payload: platformServices.setAppName(name),
  meta: {
    data: { name }
  }
});

const setNavigation = data => dispatch => {
  dispatch({
    type: platformTypes.PLATFORM_SET_NAV
  });
  return platformServices.setNavigation(data);
};

const platformActions = {
  addNotification,
  removeNotification,
  clearNotifications,
  initializeChrome,
  onNavigation,
  setAppName,
  setNavigation
};

export {
  platformActions as default,
  platformActions,
  addNotification,
  removeNotification,
  clearNotifications,
  initializeChrome,
  onNavigation,
  setAppName,
  setNavigation
};
