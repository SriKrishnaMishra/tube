/**
 * Cloudflare Real-Time Notification Client
 *
 * Connects to Cloudflare Global Edge Notification Worker (or local fallback SSE stream)
 * and delivers real-time notifications to the UI and mobile OS.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { AppNotification } from '../types';

export function useCloudflareNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('rectracker_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const toastTimeoutRef = useRef<any>(null);

  // Persist notifications
  useEffect(() => {
    try {
      localStorage.setItem('rectracker_notifications', JSON.stringify(notifications.slice(0, 50)));
    } catch (e) {
      console.warn('Could not save notifications to storage', e);
    }
  }, [notifications]);

  // Request native OS/Browser notification permission (Works on Android, iOS Safari PWA, Mac, Windows)
  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Push Notifications are not supported in this browser environment.');
      return 'denied';
    }

    try {
      const perm = await Notification.requestPermission();
      setPushPermission(perm);

      // Register Push Subscription if Service Worker is active
      if (perm === 'granted' && 'serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        if (reg) {
          showNativeNotification({
            id: 'welcome_push',
            title: '🔔 Notifications Enabled',
            message: 'You will receive real-time updates directly on your device!',
            type: 'success',
            timestamp: Date.now(),
          });
        }
      }
      return perm;
    } catch (err) {
      console.warn('Permission request error:', err);
      return 'denied';
    }
  }, []);

  // Show native system/mobile lock screen notification
  const showNativeNotification = (notif: AppNotification) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then((reg) => {
            (reg as any).showNotification(notif.title, {
              body: notif.message,
              icon: '/icon-192.png',
              badge: '/icon-192.png',
              data: { url: notif.url || '/' },
              vibrate: [100, 50, 100],
            });
          });
        } else {
          new Notification(notif.title, {
            body: notif.message,
            icon: '/icon-192.png',
          });
        }
      } catch (e) {
        console.warn('Could not dispatch native notification', e);
      }
    }
  };

  // Dispatch an incoming notification to state, toast, and native OS
  const handleIncomingNotification = useCallback((notif: AppNotification) => {
    setNotifications((prev) => [notif, ...prev.filter((n) => n.id !== notif.id)].slice(0, 50));
    setActiveToast(notif);

    // Audio chime effect (gentle pleasant tone)
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (_) {}

    // Show native OS notification if allowed
    showNativeNotification(notif);

    // Auto-hide toast after 5 seconds
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setActiveToast(null);
    }, 5000);
  }, []);

  // Connect to Cloudflare Worker SSE or local fallback SSE
  useEffect(() => {
    // Check environment variable or fallback to local proxy endpoint
    const cloudflareUrl =
      (import.meta as any).env?.VITE_CLOUDFLARE_NOTIFY_URL || '/api/notifications/stream';

    let retryTimeout: any = null;

    const connect = () => {
      try {
        const es = new EventSource(cloudflareUrl);
        eventSourceRef.current = es;

        es.onopen = () => {
          setIsConnected(true);
        };

        es.addEventListener('notification', (e: MessageEvent) => {
          try {
            const data: AppNotification = JSON.parse(e.data);
            handleIncomingNotification(data);
          } catch (err) {
            console.warn('Failed to parse notification payload:', err);
          }
        });

        es.onerror = () => {
          setIsConnected(false);
          es.close();
          // Retry connection after 5 seconds
          retryTimeout = setTimeout(connect, 5000);
        };
      } catch (e) {
        setIsConnected(false);
        retryTimeout = setTimeout(connect, 5000);
      }
    };

    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (retryTimeout) clearTimeout(retryTimeout);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [handleIncomingNotification]);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    try {
      localStorage.removeItem('rectracker_notifications');
    } catch (_) {}
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    activeToast,
    dismissToast: () => setActiveToast(null),
    unreadCount,
    markAllAsRead,
    clearAll,
    isConnected,
    pushPermission,
    requestPermission,
    sendTestNotification: (title?: string, message?: string) => {
      handleIncomingNotification({
        id: `test_${Date.now()}`,
        title: title || '⚡ Cloudflare Real-Time Notification',
        message: message || 'Real-time edge notification is active and working!',
        type: 'success',
        timestamp: Date.now(),
      });
    },
  };
}
