

import React from 'react';
import type { Notification } from '../types';
import { BellIcon, PlusIcon, TicketIcon, UserIcon, PencilIcon } from './Icons';

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
}

const timeAgo = (timestamp: string): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

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

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onClose }) => {
    return (
        <div 
            className="absolute top-12 right-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 animate-fade-in-down"
            onClick={e => e.stopPropagation()}
        >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <div key={notification.id} className={`p-4 flex items-start gap-3 border-b border-gray-200 dark:border-gray-700 ${notification.read ? 'opacity-60' : ''}`}>
                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                {getIconForType(notification.type)}
                            </div>
                            <div>
                                <p className="text-sm text-gray-800 dark:text-gray-200">{notification.message}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{timeAgo(notification.timestamp)}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        <BellIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>You have no new notifications.</p>
                    </div>
                )}
            </div>
        </div>
    );
};