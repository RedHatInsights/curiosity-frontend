import React from 'react';
import { AlertVariant } from '@patternfly/react-core';
import { NotificationsProvider } from '@redhat-cloud-services/frontend-components-notifications';
import { context as NotificationsContext } from './notificationsContext';
import { helpers } from '../../common';

/**
 * Notification functionality
 *
 * @memberof Components
 * @module Notifications
 * @property {module} NotificationsContext
 */

/**
 * Toast notification, or Alert, variants.
 *
 * @type {{success: AlertVariant.success, danger: AlertVariant.danger, warning: AlertVariant.warning,
 *     info: AlertVariant.info, custom: AlertVariant.custom}}
 */
const NotificationVariant = { ...AlertVariant };

/**
 * Expose consoledot toast notifications.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.isDisabled=helpers.UI_DISABLED_NOTIFICATIONS] - Disable the notification provider.
 * @returns {React.ReactNode} Rendered output, either wrapped with NotificationsProvider or plain children.
 */
const Notifications = ({ children, isDisabled = helpers.UI_DISABLED_NOTIFICATIONS }) => {
  if (isDisabled) {
    return children;
  }

  return <NotificationsProvider>{children}</NotificationsProvider>;
};

export { Notifications as default, Notifications, NotificationsContext, NotificationVariant };
