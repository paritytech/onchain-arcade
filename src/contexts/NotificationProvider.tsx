import React, { createContext, useContext, useState, useCallback } from 'react'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface Notification {
  id: string
  type: NotificationType
  message: string
  duration?: number
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (type: NotificationType, message: string, duration?: number) => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((type: NotificationType, message: string, duration = 5000) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setNotifications(prev => [...prev, { id, type, message, duration }])

    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id))
      }, duration)
    }
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-white text-body-sm font-medium animate-slide-in-right ${
              notification.type === 'success' ? 'bg-success' :
              notification.type === 'error' ? 'bg-error' :
              notification.type === 'warning' ? 'bg-warning' :
              'bg-accent'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span>{notification.message}</span>
              <button
                onClick={() => removeNotification(notification.id)}
                className="opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Dismiss notification"
              >
                x
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}
