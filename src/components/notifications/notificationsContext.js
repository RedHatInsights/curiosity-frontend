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
 *     hasNotification: Function,
 *     removeNotification: removeNotification }} Add, clear all, or remove a notification.
 *
 *     - `addNotification` - Add a toast notification. A `swatchId` property is exposed to allow for easy removal. If
 *         the `swatchId` is used across multiple notifications, the previous one will be automatically removed.
 *     - `clearNotifications` - Clear all notifications
 *     - `getNotification` - Get a notification object by ID or `swatchId` if it exists. Returns `undefined` or
 *         the notification object.
 *     - `hasNotification` - Check if an ID or `swatchId` notification exists. Returns a `boolean`. Convenience
 *         wrapper for `getNotification`.
 *     - `removeNotifications` - Remove a toast notification based on ID. If you used a plain text `swatchId` to add
 *         the notification, this can be used to remove it. If `DEV_MODE` is enabled, a warning is logged to the
 *         console when an attempt is made to remove a notification using an invalid or non-existent `swatchId` or `id`.
 */
const useNotifications = ({ context = NotificationsContext } = {}) => {
  const {
    addNotification: baseAddNotification,
    removeNotification: baseRemoveNotification,
    getNotifications: baseGetNotifications,
    ...contextMethods
  } = useContext(context);

  /**
   * Get a single notification
   *
   * Check for a matching notification ID or `swatchId` from the collection.
   *
   * @param {string|number} id - Identifier to search for, either the 'swatchId' or 'id'.
   * @returns {object|undefined} Notification match is found or not.
   */
  const getNotification = useCallback(
    id => {
      const notifications = baseGetNotifications();
      return notifications.find(({ swatchId: internalId, id: generatedId }) => internalId === id || generatedId === id);
    },
    [baseGetNotifications]
  );

  /**
   * Does a notification exist?
   *
   * Convenience wrapper for getNotification. Check for a matching notification ID or `swatchId` from the collection.
   *
   * @param {string|number} id - Identifier to search for, either the 'swatchId' or 'id'.
   * @returns {boolean} Notification match is found or not.
   */
  const hasNotification = useCallback(id => getNotification(id) !== undefined, [getNotification]);

  /**
   * Add a toast notification.
   *
   * A `swatchId` property is exposed to allow for easy removal.
   *
   * For convenience if the `swatchId` is used across multiple notifications, the previous notification will
   * be removed before the new one is added.
   *
   * @param {object} notification - Notification object to be added.
   * @param {string} [notification.swatchId] - Optional plain language "unique" identifier that allows for
   *     easy removal.
   * @param {string} [variant] - Optional variant to display, defaults to "info"
   * @param {React.ReactNode} title - Notification title
   * @param {React.ReactNode} [description] - Notification description
   * @returns {void}
   */
  const addNotification = useCallback(
    notification => {
      const { swatchId, ...remainingNotification } = notification;
      const updatedSwatchId = swatchId;
      const existingNotification = getNotification(updatedSwatchId);

      if (existingNotification) {
        baseRemoveNotification(existingNotification.id);
      }

      return baseAddNotification({ ...remainingNotification, swatchId: updatedSwatchId });
    },
    [baseAddNotification, baseRemoveNotification, getNotification]
  );

  /**
   * Remove a toast notification.
   *
   * For convenience IF a `swatchId` property is provided of the notification.
   *
   * @param {id} notification - Unique identifier to remove. This can be the plain language swatchId, or
   *     the generatedId provided by the notification package.
   */
  const removeNotification = useCallback(
    id => {
      const notification = getNotification(id);

      if (notification) {
        baseRemoveNotification(notification.id);
      } else if (helpers.DEV_MODE) {
        console.warn(
          `Notification with id "${id}" not found. Make sure the notification was created with the "swatchId" prop, or you used the generated id provided by notifications.`
        );
      }
    },
    [getNotification, baseRemoveNotification]
  );

  return {
    ...contextMethods,
    addNotification,
    getNotification,
    hasNotification,
    removeNotification
  };
};

const context = {
  useNotifications
};

export { context as default, context, useNotifications };
