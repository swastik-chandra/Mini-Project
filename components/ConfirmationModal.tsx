import React, { useEffect, useRef } from 'react';
import { ExclamationIcon } from './Icons';

interface ConfirmationModalProps {
  title: string;
  message: string;
  confirmButtonText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, message, confirmButtonText, onConfirm, onCancel }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            onCancel();
          }

          if (e.key === 'Tab' && modalRef.current) {
            const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
    
            if (e.shiftKey) { // Shift + Tab
              if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
              }
            } else { // Tab
              if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
              }
            }
          }
        };

        document.addEventListener('keydown', handleKeyDown);
        
        // Set initial focus on the confirm button
        const confirmButton = modalRef.current?.querySelector('.bg-red-600');
        if (confirmButton instanceof HTMLElement) {
          confirmButton.focus();
        }

        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        };
      }, [onCancel]);

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-2xl w-full max-w-md animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                    <ExclamationIcon className="w-6 h-6 text-red-500 dark:text-red-400"/>
                </div>
                <div>
                    <h2 id="confirmation-title" className="text-xl font-bold">{title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{message}</p>
                </div>
            </div>
          
          <div className="mt-8 flex justify-end gap-4">
            <button onClick={onCancel} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg font-semibold transition-colors">
              Cancel
            </button>
            <button onClick={onConfirm} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
              {confirmButtonText || 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};