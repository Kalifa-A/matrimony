"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500); // Slightly longer for premium feel
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-[99999] flex flex-col gap-3 max-w-xs w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto
              relative overflow-hidden
              flex items-center gap-4 px-5 py-4 
              rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] 
              backdrop-blur-2xl border
              animate-in slide-in-from-right-10 fade-in duration-700
              ${toast.type === 'success' 
                ? 'bg-white/80 border-[#9AD872]/20 text-gray-900' 
                : toast.type === 'error' 
                ? 'bg-red-50/80 border-red-100 text-red-900' 
                : 'bg-white/80 border-gray-100 text-gray-900'}
            `}
          >
            {/* Soft Glow Background Decor */}
            <div className={`absolute -right-4 -top-4 w-16 h-16 blur-2xl opacity-20 rounded-full
              ${toast.type === 'success' ? 'bg-[#9AD872]' : 'bg-red-400'}`} 
            />

            {/* Premium Icon Container */}
            <div className={`
              w-11 h-11 rounded-[1.25rem] flex items-center justify-center shrink-0
              shadow-lg transform rotate-3
              ${toast.type === 'success' ? 'bg-[#9AD872] shadow-[#9AD872]/20 text-white' : 
                toast.type === 'error' ? 'bg-red-500 shadow-red-500/20 text-white' : 
                'bg-gray-900 shadow-gray-900/20 text-white'}
            `}>
              {toast.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>

            {/* Message Body */}
            <div className="flex-1">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-0.5">
                 {toast.type === 'success' ? 'Confirmation' : 'Attention'}
               </p>
               <p className="text-sm font-bold text-gray-800 leading-tight tracking-tight">
                 {toast.message}
               </p>
            </div>

            {/* Close Button */}
            <button 
              onClick={() => removeToast(toast.id)}
              className="bg-gray-50/50 hover:bg-white p-2 rounded-full transition-all duration-300 group"
            >
              <svg className="w-3 h-3 text-gray-400 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Animated Progress Timer Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-[#9AD872]/20 w-full overflow-hidden">
               <div className={`h-full animate-[progress_4.5s_linear_forwards] 
                 ${toast.type === 'success' ? 'bg-[#9AD872]' : 'bg-red-500'}`} 
               />
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Return a no-op function during SSR/build time if context is not available
    return {
      showToast: (message: string, type?: ToastType) => {
        // No-op fallback
        console.warn('Toast provider not available', message);
      }
    };
  }
  return context;
}