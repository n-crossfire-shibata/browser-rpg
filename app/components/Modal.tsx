'use client';

import { ReactNode } from 'react';

interface ModalProps {
  is_open: boolean;
  on_close: () => void;
  children: ReactNode;
}

export default function Modal({ is_open, on_close, children }: ModalProps) {
  if (!is_open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={on_close}
        />
        <div className="relative w-full max-w-md transform rounded-lg bg-white p-6 text-left shadow-xl transition-all">
          {children}
        </div>
      </div>
    </div>
  );
}