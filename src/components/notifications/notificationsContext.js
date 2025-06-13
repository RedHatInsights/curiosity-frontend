import { useContext, useCallback } from 'react';
import { NotificationsContext } from '@redhat-cloud-services/frontend-components-notifications';
import { helpers } from '../../common';

/**
 * @memberof Notifications
 * @module NotificationsContext
 */

/**
 * Use platform notifications. Apply a convenience wrapper for easily removing notifications based on an internal
 * "swatchId"
 *
 * If `DEV_MODE` is enabled, a warning is logged to the console when an attempt is made to remove a notification using
 * an invalid or non-existent `swatchId`.
 *
 * @param {NotificationsContext} [context=NotificationsContext]
 * @returns {{ addNotification: Function, clearNotifications: Function, removeNotification: Function }}
 */
const useNotifications = ({ context = NotificationsContext } = {}) => {
  const { removeNotification, getNotifications, ...contextMethods } = useContext(context);

  return {
    ...contextMethods,
    removeNotification: useCallback(
      swatchId => {
        const notifications = getNotifications();
        const notification = notifications.find(({ swatchId: id }) => id === swatchId);

        if (notification) {
          removeNotification(notification.id);
        } else if (helpers.DEV_MODE) {
          console.warn(
            `Notification with swatchId "${swatchId}" not found. Make sure the notification is created with the "swatchId" prop.`
          );
        }
      },
      [getNotifications, removeNotification]
    )
  };
};

const context = {
  useNotifications
};

export { context as default, context, useNotifications };
