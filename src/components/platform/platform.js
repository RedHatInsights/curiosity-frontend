import React from 'react';
import { NotificationsProvider } from '@redhat-cloud-services/frontend-components-notifications';
import { helpers } from '../../common';

/**
 * Load platform-specific functionality
 *
 * @memberof Components
 * @module Platform
 */

/**
 * PlatformWrapper is a functional component that conditionally wraps its children with a NotificationsProvider.
 *
 * If UI notifications are not disabled, the children will be wrapped with a NotificationsProvider component.
 * If UI notifications are disabled, the children will be rendered directly without any wrapping.
 *
 * This component relies on the `UI_DISABLED_NOTIFICATIONS` property from the `helpers` object to determine
 * whether notifications are enabled or disabled in the platform.
 *
 * @param {object} props - The prop object for the component.
 * @param {React.ReactNode} props.children - The child components or elements to be rendered.
 * @returns {React.ReactNode} The rendered output, either wrapped with NotificationsProvider or plain children.
 */
const Platform = ({ children }) => {
  if (!helpers.UI_DISABLED_NOTIFICATIONS) {
    return <NotificationsProvider>{children}</NotificationsProvider>;
  }

  return children;
};

export { Platform as default, Platform };
