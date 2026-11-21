import { useCallback, useEffect, useRef, useState } from 'react'
import ToastContext from '../toast/ToastContext.js'

const TOAST_DURATION = 4500

const toastStyles = {
  success: {
    label: 'Success',
    icon: '✓',
    border: 'border-emerald-800',
    iconColor: 'text-emerald-300',
  },
  error: {
    label: 'Error',
    icon: '!',
    border: 'border-red-800',
    iconColor: 'text-red-300',
  },
  warning: {
    label: 'Warning',
    icon: '!',
    border: 'border-amber-700',
    iconColor: 'text-amber-300',
  },
  info: {
    label: 'Information',
    icon: 'i',
    border: 'border-sky-800',
    iconColor: 'text-sky-300',
  },
}

function ToastItem({ toast, onDismiss }) {
  const style = toastStyles[toast.type]

  useEffect(() => {
    const timeoutId = window.setTimeout(() => onDismiss(toast.id), TOAST_DURATION)
    return () => window.clearTimeout(timeoutId)
  }, [toast.id, onDismiss])

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-xl border ${style.border} bg-slate-900 px-4 py-3.5 text-sm text-slate-100 shadow-xl shadow-black/30`}
    >
      <span className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-800 font-semibold ${style.iconColor}`} aria-hidden="true">
        {style.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{style.label}</p>
        <p className="mt-0.5 wrap-break-word leading-5 text-slate-300">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="-mr-1 -mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-lg leading-none text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-amber-400"
      >
        ×
      </button>
    </div>
  )
}

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextToastId = useRef(0)

  const showToast = useCallback((type, message) => {
    if (!toastStyles[type] || !message) return

    setToasts((currentToasts) => {
      const isDuplicate = currentToasts.some(
        (toast) => toast.type === type && toast.message === message,
      )

      if (isDuplicate) return currentToasts

      return [...currentToasts, { id: nextToastId.current++, type, message }]
    })
  }, [])

  const dismissToast = useCallback((toastId) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== toastId))
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6" aria-label="Notifications">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onDismiss={dismissToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider
