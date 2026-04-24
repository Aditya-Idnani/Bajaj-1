import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Toast({ message, type = 'error', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl toast-enter bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium">
      {type === 'error' ? (
        <AlertCircle className="text-red-500 w-5 h-5" />
      ) : (
        <CheckCircle2 className="text-emerald-500 w-5 h-5" />
      )}
      <span className="text-gray-800 dark:text-gray-200 mr-2">{message}</span>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
