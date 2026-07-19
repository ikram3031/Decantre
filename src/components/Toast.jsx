import React from 'react';
import { Sparkles, Info, X } from 'lucide-react';

export const Toast = ({ toasts, onClose }) => {
  return (
    <div id="toast-manager" className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          id={`toast-${toast.id}`}
          className={`p-4 rounded-lg shadow-2xl flex items-center justify-between border backdrop-blur-md animate-fade-in transition-all duration-300 ${
            toast.type === 'success' 
              ? 'bg-luxury-dark/95 border-gold/40 text-gold' 
              : toast.type === 'error'
              ? 'bg-luxury-dark/95 border-rose-500/50 text-rose-100'
              : 'bg-luxury-dark/95 border-white/10 text-luxury-white'
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && <Sparkles className="w-5 h-5 text-gold shrink-0 animate-pulse" />}
            {toast.type === 'error' && <Info className="w-5 h-5 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-zinc-400 shrink-0" />}
            <span className="text-xs uppercase tracking-widest font-sans font-light">{toast.text}</span>
          </div>
          <button 
            onClick={() => onClose(toast.id)}
            className="text-zinc-400 hover:text-white p-1 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
