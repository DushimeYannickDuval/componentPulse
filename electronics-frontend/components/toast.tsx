"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
}

let toastId = 0
const toastCallbacks: ((toast: Toast) => void)[] = []

export const toast = {
  success: (message: string) => {
    const id = (++toastId).toString()
    const newToast: Toast = { id, message, type: "success" }
    toastCallbacks.forEach((callback) => callback(newToast))
  },
  error: (message: string) => {
    const id = (++toastId).toString()
    const newToast: Toast = { id, message, type: "error" }
    toastCallbacks.forEach((callback) => callback(newToast))
  },
  info: (message: string) => {
    const id = (++toastId).toString()
    const newToast: Toast = { id, message, type: "info" }
    toastCallbacks.forEach((callback) => callback(newToast))
  },
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const callback = (toast: Toast) => {
      setToasts((prev) => [...prev, toast])

      // Auto remove after 3 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id))
      }, 3000)
    }

    toastCallbacks.push(callback)

    return () => {
      const index = toastCallbacks.indexOf(callback)
      if (index > -1) {
        toastCallbacks.splice(index, 1)
      }
    }
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center justify-between p-4 rounded-lg shadow-lg min-w-[300px] max-w-[400px]
            ${toast.type === "success" ? "bg-green-500 text-white" : ""}
            ${toast.type === "error" ? "bg-red-500 text-white" : ""}
            ${toast.type === "info" ? "bg-blue-500 text-white" : ""}
            animate-in slide-in-from-right duration-300
          `}
        >
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="ml-4 p-1 hover:bg-black/10 rounded">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
