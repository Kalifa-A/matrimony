'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-hot-toast';

const NotificationContext = createContext<{ unread: number; setUnread: React.Dispatch<React.SetStateAction<number>> }>(null!);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [unread, setUnread] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      auth: { token },
    });
    socketRef.current = socket;

    socket.on('admin-notification', (payload) => {
      // Increment badge count
      setUnread((c) => c + 1);
      // Show in‑app toast
      toast.success(`New ${payload.type} from ${payload.user.name}`);
      // Show native notification if page not focused
      if (document.hidden && Notification.permission === 'granted') {
        new Notification('New admin notification', {
          body: `${payload.type} – ${payload.user.name}`,
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Register service worker and subscribe to push
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    console.log('NotificationProvider: Token check', !!token);
    
    const subscribeToPush = async () => {
      console.log('NotificationProvider: Checking Service Worker compatibility');
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('NotificationProvider: Service Worker or Push Manager not supported');
        return;
      }
      
      try {
        console.log('NotificationProvider: Registering /sw.js');
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('NotificationProvider: Service Worker registered', registration.scope);

        if (!token) {
          console.log('NotificationProvider: No token, skipping subscription');
          return;
        }

        let subscription = await registration.pushManager.getSubscription();
        console.log('NotificationProvider: Existing subscription', !!subscription);
        
        if (!subscription) {
          console.log('NotificationProvider: No subscription, creating new one');
          const publicVapidKey = 'BM4ByLfrpcNSh4SNhSvfKIT6Sc0AuXG6z1T11-FlqDH3m3-VDtMIQyIU6nrsckRHThoXI47BcmJ9RlHD_mRadEs';
          
          // Helper to convert VAPID key
          const urlBase64ToUint8Array = (base64String: string) => {
            const padding = '='.repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);
            for (let i = 0; i < rawData.length; ++i) {
              outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
          };

          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
          });
          console.log('NotificationProvider: New subscription created');
        }

        // Send subscription to backend
        console.log('NotificationProvider: Sending subscription to backend');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/subscribe`, {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('NotificationProvider: Backend response status', response.status);
      } catch (err) {
        console.error('NotificationProvider: Push subscription failed:', err);
      }
    };

    console.log('NotificationProvider: Current permission status:', Notification.permission);
    if (Notification.permission === 'granted') {
       subscribeToPush();
    } else if (Notification.permission === 'default') {
      console.log('NotificationProvider: Requesting permission');
      Notification.requestPermission().then(permission => {
        console.log('NotificationProvider: Permission result:', permission);
        if (permission === 'granted') subscribeToPush();
      });
    }
  }, []); // Re-run if mount, check for token inside

  return (
    <NotificationContext.Provider value={{ unread, setUnread }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useAdminNotification = () => useContext(NotificationContext);