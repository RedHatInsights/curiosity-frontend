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
 * @param {NotificationsContext} [context=NotificationsContext]
 * @returns {{
 *     addNotification: Function,
 *     clearNotifications: Function,
 *     removeNotification: removeNotification }} Add, clear all, or remove a notification.
 *
 *     - `addNotification` - Add a toast notification. A `swatchId` property is exposed to allow for easy removal.
 *     - `clearNotifications` - Clear all notifications
 *     - `removeNotifications` - Remove a toast notification based on ID. If you used a plain text `swatchId` to add
 *         the notification, this can be used to remove it. If `DEV_MODE` is enabled, a warning is logged to the
 *         console when an attempt is made to remove a notification using an invalid or non-existent `swatchId` or `id`.
 */
const useNotifications = ({ context = NotificationsContext } = {}) => {
  const { addNotification, removeNotification, getNotifications, ...contextMethods } = useContext(context);

  return {
    ...contextMethods,
    /**
     * Add a toast notification.
     *
     * A `swatchId` property is exposed to allow for easy removal.
     *
     * @param {object} notification - Notification object to be added.
     * @param {string} [notification.swatchId] - Optional plain language "unique" identifier that allows for
     *     easy removal.
     * @param {string} [variant] - Optional variant to display, defaults to "info"
     * @param {React.ReactNode} title - Notification title
     * @param {React.ReactNode} [description] - Notification description
     * @returns {void}
     */
    addNotification: useCallback(
      notification => {
        const { swatchId, swatchid, ...remainingNotification } = notification;
        return addNotification({ ...remainingNotification, swatchid: swatchId || swatchid });
      },
      [addNotification]
    ),

    /**
     * Remove a toast notification.
     *
     * For convenience IF a `swatchId` property is provided of the notification.
     *
     * @param {id} notification - Unique identifier to remove. This can be the plain language swatchId, or
     *     the generatedId provided by the notification package.
     */
    removeNotification: useCallback(
      id => {
        const notifications = getNotifications();
        const notification = notifications.find(
          ({ swatchid: internalId, id: generatedId }) => internalId === id || generatedId === id
        );

        if (notification) {
          removeNotification(notification.id);
        } else if (helpers.DEV_MODE) {
          console.warn(
            `Notification with id "${id}" not found. Make sure the notification was created with the "swatchId" prop, or you used the generated id provided by notifications.`
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
