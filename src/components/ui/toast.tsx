"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  type?: "success" | "error" | "info";
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

type ToastAction =
  | { type: "ADD_TOAST"; payload: Toast }
  | { type: "REMOVE_TOAST"; payload: string };

function toastReducer(state: Toast[], action: ToastAction): Toast[] {
  switch (action.type) {
    case "ADD_TOAST":
      return [...state, action.payload];
    case "REMOVE_TOAST":
      return state.filter((toast) => toast.id !== action.payload);
    default:
      return state;
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    dispatch({ type: "ADD_TOAST", payload: { ...toast, id } });
  };

  const removeToast = (id: string) => {
    dispatch({ type: "REMOVE_TOAST", payload: id });
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) {
  return (
    <div className='fixed top-4 right-4 z-50 flex flex-col gap-2'>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  useEffect(() => {
    const duration = toast.duration || 5000;
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "info":
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-sm",
        getToastStyles()
      )}
    >
      <div className='flex-1'>
        {toast.title && (
          <div className='font-semibold text-sm'>{toast.title}</div>
        )}
        {toast.description && (
          <div className='text-sm opacity-90 mt-1'>{toast.description}</div>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className='opacity-70 hover:opacity-100 transition-opacity'
      >
        <X className='h-4 w-4' />
      </button>
    </div>
  );
}
