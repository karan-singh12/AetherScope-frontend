"use client";

import { create } from "zustand";

export type ToastType = "success" | "error";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastState {
  toasts: ToastMessage[];
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: string) => void;
}

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const useToast = create<ToastState>((set) => ({
  toasts: [],
  addToast: (type, message) => {
    const id = createId();
    const toast: ToastMessage = { id, type, message };

    set((state) => ({
      toasts: [toast, ...state.toasts],
    }));

    window.setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((item) => item.id !== id),
      }));
    }, 4000);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((item) => item.id !== id),
    }));
  },
}));

export default useToast;
