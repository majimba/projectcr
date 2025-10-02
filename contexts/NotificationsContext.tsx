'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Notification } from '@/types/database';
import { useAuth } from './AuthContext';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: (limit?: number, unreadOnly?: boolean) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAsUnread: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch notifications from API
  const fetchNotifications = useCallback(async (limit = 50, unreadOnly = false) => {
    console.log('[Notifications] Starting fetch, user:', user ? 'authenticated' : 'not authenticated');
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: '0',
        unread_only: unreadOnly.toString()
      });

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('[Notifications] Request timeout after 5s');
        controller.abort();
      }, 5000); // 5 second timeout

      console.log('[Notifications] Fetching from API...');
      const response = await fetch(`/api/notifications?${params}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('[Notifications] Response status:', response.status);
      
      if (!response.ok) {
        // If it's a 500 error, it's likely a database connection issue
        if (response.status === 500) {
          console.warn('Database not available - notifications will be disabled');
          setNotifications([]);
          setUnreadCount(0);
          setError('Notifications temporarily unavailable');
          return;
        }
        throw new Error(`Failed to fetch notifications: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[Notifications] Data received:', { 
        notificationCount: data.notifications?.length, 
        unreadCount: data.unreadCount,
        hasError: !!data.error 
      });
      
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
      
      // Set error if API returned one, otherwise clear it
      if (data.error) {
        setError(data.error);
        console.warn('[Notifications] API returned error:', data.error);
      } else {
        setError(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notifications';
      
      // Handle timeout specifically
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out');
        console.warn('Notifications request timed out');
      } else {
        setError(errorMessage);
        console.error('Error fetching notifications:', err);
      }
      
      // Set empty state on error to prevent UI issues
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      console.log('[Notifications] Fetch complete, loading set to false');
      setLoading(false);
    }
  }, [user]);

  // Mark a notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_read: true }),
      });

      if (!response.ok) {
        if (response.status === 500) {
          console.warn('Database not available - skipping notification update');
          return;
        }
        throw new Error(`Failed to mark notification as read: ${response.statusText}`);
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true, read_at: new Date().toISOString() }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark notification as read';
      setError(errorMessage);
      console.error('Error marking notification as read:', err);
    }
  }, []);

  // Mark a notification as unread
  const markAsUnread = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_read: false }),
      });

      if (!response.ok) {
        throw new Error(`Failed to mark notification as unread: ${response.statusText}`);
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: false, read_at: null }
            : notification
        )
      );
      setUnreadCount(prev => prev + 1);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark notification as unread';
      setError(errorMessage);
      console.error('Error marking notification as unread:', err);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    const unreadNotifications = notifications.filter(n => !n.is_read);
    if (unreadNotifications.length === 0) return;

    try {
      const response = await fetch('/api/notifications/batch', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'mark_read',
          notification_ids: unreadNotifications.map(n => n.id)
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to mark all notifications as read: ${response.statusText}`);
      }

      // Update local state
      const now = new Date().toISOString();
      setNotifications(prev => 
        prev.map(notification => 
          !notification.is_read 
            ? { ...notification, is_read: true, read_at: now }
            : notification
        )
      );
      setUnreadCount(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark all notifications as read';
      setError(errorMessage);
      console.error('Error marking all notifications as read:', err);
    }
  }, [notifications]);

  // Delete a notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete notification: ${response.statusText}`);
      }

      // Update local state
      const deletedNotification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
      
      // Update unread count if the deleted notification was unread
      if (deletedNotification && !deletedNotification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete notification';
      setError(errorMessage);
      console.error('Error deleting notification:', err);
    }
  }, [notifications]);

  // Delete all notifications
  const deleteAllNotifications = useCallback(async () => {
    if (notifications.length === 0) return;

    try {
      const response = await fetch('/api/notifications/batch', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          notification_ids: notifications.map(n => n.id)
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete all notifications: ${response.statusText}`);
      }

      // Clear local state
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete all notifications';
      setError(errorMessage);
      console.error('Error deleting all notifications:', err);
    }
  }, [notifications]);

  // Refresh notifications (alias for fetchNotifications)
  const refreshNotifications = useCallback(() => {
    return fetchNotifications();
  }, [fetchNotifications]);

  // Load notifications on mount, but only if user is authenticated
  useEffect(() => {
    if (user) {
      console.log('[Notifications] User authenticated, fetching notifications on mount');
      fetchNotifications();
    } else {
      console.log('[Notifications] No user, clearing notifications');
      // Clear notifications when user logs out
      setNotifications([]);
      setUnreadCount(0);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Only depend on user, not fetchNotifications to prevent loops

  // Set up periodic refresh (every 2 minutes) - only when user is authenticated
  // Reduced frequency to prevent constant refreshing
  useEffect(() => {
    if (!user) return;

    console.log('[Notifications] Setting up periodic refresh (2min interval)');
    const interval = setInterval(() => {
      console.log('[Notifications] Periodic refresh triggered');
      fetchNotifications(50, false); // Refresh with current settings
    }, 120000); // Changed from 30s to 2 minutes

    return () => {
      console.log('[Notifications] Clearing periodic refresh interval');
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Only depend on user to prevent setting up multiple intervals

  const value: NotificationsContextType = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    refreshNotifications,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}
