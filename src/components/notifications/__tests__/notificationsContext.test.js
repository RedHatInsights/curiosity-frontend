import React from 'react';
import { context, useNotifications } from '../notificationsContext';

describe('NotificationsContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should apply a hook wrapper for notifications', async () => {
    const { result } = await renderHook(() => useNotifications());
    expect(result).toMatchSnapshot('notifications hook');
  });

  it.each([
    {
      description: 'swatchId',
      notification: {
        swatchId: 'loremIpsum',
        title: 'Lorem ipsum'
      }
    },
    {
      description: 'swatchid',
      notification: {
        swatchid: 'dolorSitAmet',
        title: 'Lorem ipsum'
      }
    },
    {
      description: 'id',
      notification: {
        id: 'ametConsectetur',
        title: 'Lorem ipsum'
      }
    },
    {
      description: 'swatchId and existing notification',
      notification: {
        swatchId: 'ametConsectetur',
        title: 'Lorem ipsum'
      },
      notifications: [
        {
          id: 'generated-id-1',
          swatchid: 'ametConsectetur',
          title: 'The original notification'
        },
        {
          id: 'generated-id-2',
          swatchid: 'loremIpsum'
        },
        {
          id: 'generated-id-3',
          swatchid: 'dolorSit'
        }
      ]
    }
  ])('should attempt addNotification with a custom ID: $description', async ({ notification, notifications = [] }) => {
    const mockAddNotification = jest.fn();
    const mockRemoveNotification = jest.fn();
    const mockGetNotifications = jest.fn(() => [...notifications]);
    const mockClearNotifications = jest.fn();

    const mockUseContext = jest.spyOn(React, 'useContext').mockReturnValue({
      addNotification: mockAddNotification,
      removeNotification: mockRemoveNotification,
      getNotifications: mockGetNotifications,
      clearNotifications: mockClearNotifications
    });

    const { result } = await renderHook(() => useNotifications());
    result.addNotification({
      ...notification
    });

    expect({
      addNotifications: mockAddNotification.mock.calls,
      removeNotifications: mockRemoveNotification.mock.calls,
      getNotifications: mockGetNotifications.mock.results
    }).toMatchSnapshot();
    mockUseContext.mockClear();
  });

  it.each([
    {
      description: 'swatchId',
      findNotification: 'loremIpsum',
      notifications: [
        {
          id: 'generated-id-1',
          swatchid: 'loremIpsum',
          title: 'Lorem ipsum'
        }
      ]
    },
    {
      description: 'id',
      findNotification: 'generated-id-2',
      notifications: [
        {
          id: 'generated-id-2',
          swatchid: 'dolorSitAmet',
          title: 'Lorem ipsum'
        }
      ]
    },
    {
      description: 'incorrect id',
      findNotification: 'incorrectId',
      notifications: [
        {
          id: 'generated-id-3',
          swatchid: 'ametConsectetur',
          title: 'Lorem ipsum'
        }
      ]
    }
  ])(
    'should find a notification with getNotification and hasNotification: $description',
    async ({ notifications, findNotification }) => {
      const mockAddNotification = jest.fn();
      const mockRemoveNotification = jest.fn();
      const mockGetNotifications = jest.fn(() => [...notifications]);
      const mockClearNotifications = jest.fn();

      const mockUseContext = jest.spyOn(React, 'useContext').mockReturnValue({
        addNotification: mockAddNotification,
        removeNotification: mockRemoveNotification,
        getNotifications: mockGetNotifications,
        clearNotifications: mockClearNotifications
      });

      const { result } = await renderHook(() => useNotifications());
      expect({
        getNotification: result.getNotification(findNotification),
        hasNotification: result.hasNotification(findNotification)
      }).toMatchSnapshot();
      mockUseContext.mockClear();
    }
  );

  it.each([
    {
      description: 'swatchId',
      removeId: 'loremIpsum',
      notifications: [
        {
          id: 'generated-id-1',
          swatchid: 'loremIpsum',
          title: 'Lorem ipsum'
        }
      ]
    },
    {
      description: 'id',
      removeId: 'generated-id-2',
      notifications: [
        {
          id: 'generated-id-2',
          swatchid: 'dolorSitAmet',
          title: 'Lorem ipsum'
        }
      ]
    },
    {
      description: 'incorrect id',
      removeId: 'incorrectId',
      notifications: [
        {
          id: 'generated-id-3',
          swatchid: 'ametConsectetur',
          title: 'Lorem ipsum'
        }
      ]
    }
  ])('should attempt removeNotification with a custom ID: $description', async ({ notifications, removeId }) => {
    const mockAddNotification = jest.fn();
    const mockRemoveNotification = jest.fn();
    const mockGetNotifications = jest.fn(() => [...notifications]);
    const mockClearNotifications = jest.fn();

    const mockUseContext = jest.spyOn(React, 'useContext').mockReturnValue({
      addNotification: mockAddNotification,
      removeNotification: mockRemoveNotification,
      getNotifications: mockGetNotifications,
      clearNotifications: mockClearNotifications
    });

    const { result } = await renderHook(() => useNotifications());
    result.removeNotification(removeId);

    expect(mockRemoveNotification.mock.calls).toMatchSnapshot();
    mockUseContext.mockClear();
  });
});
