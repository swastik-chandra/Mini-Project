

import React, { useEffect, useRef } from 'react';
import type { Event } from '../types';
import { XIcon, TicketIcon, CalendarIcon, ClockIcon } from './Icons';
import { formatDate } from '../utils/date';

interface PaymentModalProps {
  event: Event;
  onClose: () => void;
  onPaymentSuccess: (eventId: number) => void;
  onPaymentNotification: (event: Event) => void;
}

const getCurrencySymbol = (currency?: string) => {
    if (currency === 'INR') return '₹';
    if (currency === 'USD') return '$';
    return '';
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ event, onClose, onPaymentSuccess, onPaymentNotification }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            onClose();
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
        
        const confirmButton = modalRef.current?.querySelector('button.bg-gradient-to-r');
        if (confirmButton instanceof HTMLElement) {
            confirmButton.focus();
        }

        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);
    
    const handleConfirm = () => {
        // Trigger both success actions: updating the user's state and notifying the admin
        onPaymentSuccess(event.id);
        onPaymentNotification(event);
    };

    return (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="payment-title"
        >
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-2xl w-full max-w-md animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            <header className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <TicketIcon className="w-7 h-7 text-purple-500 dark:text-purple-400" />
                    <h2 id="payment-title" className="text-2xl font-bold">Confirm Your Ticket</h2>
                </div>
                <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors" aria-label="Close payment form">
                    <XIcon className="w-6 h-6" />
                </button>
            </header>
            <div className="p-6">
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{event.title}</p>
                <div className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-3">
                        <CalendarIcon className="w-5 h-5"/>
                        <span>{formatDate(event.date, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <ClockIcon className="w-5 h-5"/>
                        <span>{event.time}</span>
                    </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Ticket Price:</span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {getCurrencySymbol(event.currency)}{event.price}
                        </span>
                    </div>
                </div>

                <div className="mt-8">
                    <button 
                        onClick={handleConfirm}
                        className="w-full py-3 px-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transform hover:scale-105"
                    >
                        Confirm Payment
                    </button>
                    <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-500">This is a mock payment confirmation.</p>
                </div>
            </div>
          </div>
        </div>
      );
};