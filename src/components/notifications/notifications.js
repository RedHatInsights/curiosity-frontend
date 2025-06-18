import React from 'react';
import { NotificationsProvider } from '@redhat-cloud-services/frontend-components-notifications';
import { helpers } from '../../common';

/**
 * Notification functionality
 *
 * @memberof Components
 * @module Notifications
 * @property {module} NotificationsContext
 */

/**
 * Expose consoledot toast notifications.
 *
 * @param {object} props - The prop object for the component.
 * @param {React.ReactNode} props.children - The child components or elements to be rendered.
 * @returns {React.ReactNode} The rendered output, either wrapped with NotificationsProvider or plain children.
 */
const Notifications = ({ children }) => {
  if (!helpers.UI_DISABLED_NOTIFICATIONS) {
    return <NotificationsProvider>{children}</NotificationsProvider>;
  }

  return children;
};

export { Notifications as default, Notifications };
