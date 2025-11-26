
import React, { useEffect, useRef } from 'react';
import { XIcon, TicketIcon, SparklesIcon } from './Icons';

interface UpgradeCapacityModalProps {
  fee: number;
  currency: string;
  onClose: () => void;
  onConfirm: () => void;
}

const getCurrencySymbol = (currency?: string) => {
    if (currency === 'INR') return '₹';
    if (currency === 'USD') return '$';
    return '';
}

export const UpgradeCapacityModal: React.FC<UpgradeCapacityModalProps> = ({ fee, currency, onClose, onConfirm }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            onClose();
          }
        };
        document.addEventListener('keydown', handleKeyDown);
        
        const confirmButton = modalRef.current?.querySelector('button.bg-gradient-to-r');
        if (confirmButton instanceof HTMLElement) {
            confirmButton.focus();
        }

        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);
    
    return (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="upgrade-title"
        >
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-2xl w-full max-w-md animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            <header className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <SparklesIcon className="w-7 h-7 text-purple-500 dark:text-purple-400" />
                    <h2 id="upgrade-title" className="text-2xl font-bold">Upgrade Event Capacity</h2>
                </div>
                <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors" aria-label="Close form">
                    <XIcon className="w-6 h-6" />
                </button>
            </header>
            <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    To increase the capacity of your event, a service fee is required. This fee helps us maintain the platform and is calculated based on the potential revenue from the additional seats.
                </p>

                <div className="mt-6 p-4 rounded-lg bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Upgrade Fee:</span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {getCurrencySymbol(currency)}{fee.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="mt-8">
                    <button 
                        onClick={onConfirm}
                        className="w-full py-3 px-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transform hover:scale-105"
                    >
                        Confirm & Pay Fee
                    </button>
                    <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-500">This is a mock payment confirmation.</p>
                </div>
            </div>
          </div>
        </div>
      );
};