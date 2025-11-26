
import React, { useState } from 'react';
import { Drawer } from './Drawer';
import { SparklesIcon, BellIcon } from './Icons';
import type { User, Notification } from '../types';
import { NotificationPanel } from './NotificationPanel';

type NavigablePage = 'discover' | 'myEvents' | 'createUserEvent';
export type CurrentPage = NavigablePage | 'login' | 'admin' | 'userLogin' | 'signup';


interface HeaderProps {
  onSignInClick: () => void;
  activePage: CurrentPage;
  onNavigate: (page: NavigablePage) => void;
  currentUser: User | null;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  notifications: Notification[];
  unreadCount: number;
  isNotificationPanelOpen: boolean;
  onToggleNotificationPanel: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSignInClick, activePage, onNavigate, currentUser, onLogout, theme, onThemeToggle, notifications, unreadCount, isNotificationPanelOpen, onToggleNotificationPanel }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const handleSignIn = () => {
    setIsDrawerOpen(false);
    onSignInClick();
  }

  const handleLogout = () => {
    setIsDrawerOpen(false);
    onLogout();
  }

  const handleNavigate = (page: NavigablePage) => {
    onNavigate(page);
    setIsDrawerOpen(false);
  }

  return (
    <>
      <header className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          
          <button 
            onClick={() => setIsDrawerOpen(true)} 
            className="flex items-center gap-2 group"
            aria-label="Open navigation menu"
          >
            <SparklesIcon className="w-8 h-8 text-purple-500 group-hover:text-purple-400 transition-colors" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors">
              Event<span className="text-purple-500 dark:text-purple-400 group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors">Finder</span>
            </h1>
          </button>

          <div className="flex items-center gap-4">
            {currentUser && (
              <div className="relative">
                <button 
                  onClick={onToggleNotificationPanel} 
                  className="p-2 bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-300/70 dark:hover:bg-gray-600/70 rounded-full transition-colors" 
                  aria-label={`Toggle notifications (${unreadCount} unread)`}
                >
                    <BellIcon className="w-6 h-6"/>
                </button>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white pointer-events-none">
                        {unreadCount}
                    </span>
                )}
                {isNotificationPanelOpen && <NotificationPanel notifications={notifications} onClose={onToggleNotificationPanel} />}
              </div>
            )}
          </div>
        </div>
      </header>

      <Drawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        activePage={activePage}
        onNavigate={handleNavigate}
        onSignInClick={handleSignIn}
        currentUser={currentUser}
        onLogout={handleLogout}
        theme={theme}
        onThemeToggle={onThemeToggle}
      />
    </>
  );
};