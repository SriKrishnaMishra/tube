import { useState, useRef, useEffect } from 'react';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Play,
  X,
  Radio,
  ExternalLink,
  Trash2,
  Check,
  Send,
  Sparkles,
} from 'lucide-react';
import { useCloudflareNotifications } from '../utils/cloudflareNotifications';
import { AppNotification } from '../types';

interface NotificationCenterProps {
  onOpenVideo?: (url: string) => void;
}

export function NotificationCenter({ onOpenVideo }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    activeToast,
    dismissToast,
    unreadCount,
    markAllAsRead,
    clearAll,
    isConnected,
    pushPermission,
    requestPermission,
    sendTestNotification,
  } = useCloudflareNotifications();

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const toggleOpen = () => {
    if (!isOpen && unreadCount > 0) {
      markAllAsRead();
    }
    setIsOpen(!isOpen);
  };

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'video':
        return <Play size={14} className="text-emerald-400" />;
      case 'success':
        return <CheckCircle size={14} className="text-emerald-400" />;
      case 'warning':
      case 'alert':
        return <AlertTriangle size={14} className="text-amber-400" />;
      default:
        return <Info size={14} className="text-cyan-400" />;
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Header Notification Bell Trigger */}
      <button
        onClick={toggleOpen}
        className="relative p-2 rounded-xl border border-white/10 hover:bg-white/10 transition-colors text-gray-300 hover:text-white cursor-pointer"
        title="Real-Time Cloudflare Notifications"
      >
        <Bell size={16} />

        {/* Live SSE / Edge connection indicator dot */}
        <span
          className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${
            isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
          }`}
          title={isConnected ? 'Connected to Cloudflare Real-Time Edge' : 'Connecting to Notification Edge...'}
        />

        {/* Unread Counter Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center justify-center animate-in zoom-in">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-white/15 bg-[#0f111a] shadow-2xl z-[9999] overflow-hidden text-gray-200 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="p-3.5 border-b border-white/10 bg-slate-900/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
                <Radio size={14} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Cloudflare Real-Time Notifications</span>
                </h4>
                <div className="text-[10px] flex items-center gap-1 text-gray-400">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isConnected ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                  <span>{isConnected ? 'Connected to Edge Stream' : 'Reconnecting...'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-rose-400 transition-colors"
                  title="Clear all notifications"
                >
                  <Trash2 size={13} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Mobile / Native Push Notification Banner */}
          {pushPermission !== 'granted' && (
            <div className="p-2.5 bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border-b border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[11px] text-indigo-200">
                <Sparkles size={13} className="text-indigo-400 shrink-0" />
                <span>Get alerts on your phone lock screen</span>
              </div>
              <button
                onClick={requestPermission}
                className="px-2 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold shrink-0 transition-colors cursor-pointer"
              >
                Enable Push
              </button>
            </div>
          )}

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Bell size={24} className="mx-auto mb-2 text-gray-600" />
                <p className="text-xs font-semibold">No notifications yet</p>
                <p className="text-[10px] text-gray-500 mt-1">
                  Alerts from Cloudflare Worker, video updates, and verification tasks appear here in real-time.
                </p>
                <button
                  onClick={() => sendTestNotification()}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-emerald-300 font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send size={11} />
                  <span>Send Test Notification</span>
                </button>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 transition-colors hover:bg-white/[0.03] flex items-start gap-2.5 ${
                    !item.read ? 'bg-indigo-950/15' : ''
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/10 shrink-0 mt-0.5">
                    {getNotificationIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-bold text-white truncate">{item.title}</span>
                      <span className="text-[10px] text-gray-500 shrink-0">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-300 leading-snug">{item.message}</p>
                    {item.url && (
                      <button
                        onClick={() => {
                          if (onOpenVideo && item.url) onOpenVideo(item.url);
                          else if (item.url) window.open(item.url, '_blank');
                        }}
                        className="mt-1.5 text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                      >
                        <span>View details</span>
                        <ExternalLink size={10} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Test Notification Trigger */}
          <div className="p-2.5 bg-black/40 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400">
            <span className="font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Edge Active
            </span>
            <button
              onClick={() => sendTestNotification()}
              className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Send size={10} />
              <span>Trigger Test</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Real-Time Toast Alert (Pops up when a live notification arrives) */}
      {activeToast && (
        <div className="fixed top-20 right-4 sm:right-6 z-[999999] max-w-sm w-full bg-[#10131f] border border-emerald-500/40 shadow-2xl rounded-2xl p-4 text-white flex items-start gap-3 animate-in slide-in-from-top-4 duration-200">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            {getNotificationIcon(activeToast.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs font-bold text-white truncate">{activeToast.title}</span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">NOW</span>
            </div>
            <p className="text-xs text-gray-300 leading-snug">{activeToast.message}</p>
          </div>
          <button
            onClick={dismissToast}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

