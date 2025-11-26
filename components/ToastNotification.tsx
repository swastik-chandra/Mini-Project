
import React, { useEffect, useState } from 'react';
import type { Notification } from '../types';
import { BellIcon, PlusIcon, TicketIcon, UserIcon, PencilIcon, XIcon } from './Icons';

interface ToastNotificationProps {
  notification: Notification;
  onClose: () => void;
}

const getIconForType = (type: Notification['type']) => {
    switch(type) {
        case 'newEvent':
            return <PlusIcon className="w-5 h-5 text-purple-500 dark:text-purple-400" />;
        case 'payment':
            return <TicketIcon className="w-5 h-5 text-green-500 dark:text-green-400" />;
        case 'newUser':
            return <UserIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
        case 'editEvent':
            return <PencilIcon className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />;
        default:
            return <BellIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
    }
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ notification, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  return (
    <div 
      className={`fixed top-6 right-6 w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-[100] transition-all duration-300 ease-in-out ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
      }`}
      role="alert"
      aria-live="assertive"
    >
      <div className="p-4 flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
          {getIconForType(notification.type)}
        </div>
        <div className="flex-grow">
          <p className="font-semibold text-gray-800 dark:text-gray-200">New Notification</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
        </div>
        <button 
          onClick={handleClose} 
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors" 
          aria-label="Close notification"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
