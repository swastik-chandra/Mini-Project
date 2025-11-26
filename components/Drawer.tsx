import React, { useEffect, useRef } from 'react';
import { XIcon, UserCircleIcon, LogoutIcon, SunIcon, MoonIcon, PlusIcon } from './Icons';
import type { CurrentPage } from './Header';
import type { User } from '../types';

type NavigablePage = 'discover' | 'myEvents' | 'createUserEvent';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: CurrentPage;
  onNavigate: (page: NavigablePage) => void;
  onSignInClick: () => void;
  currentUser: User | null;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, activePage, onNavigate, onSignInClick, currentUser, onLogout, theme, onThemeToggle }) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      
      if (e.key === 'Tab' && isOpen && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
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

    if (isOpen) {
      const firstButton = drawerRef.current?.querySelector('button');
      if (firstButton) {
        firstButton.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  const linkBaseClasses = "text-xl p-3 rounded-lg transition-colors w-full text-left flex items-center gap-4";
  const activeLinkClasses = "bg-purple-600 text-white font-semibold";
  const inactiveLinkClasses = "hover:bg-gray-200 dark:hover:bg-gray-700";

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ease-in-out ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex justify-end">
          <button 
            onClick={onClose} 
            className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
            aria-label="Close navigation menu"
          >
            <XIcon className="w-7 h-7" />
          </button>
        </div>
        <div className="p-4 flex flex-col justify-between h-[calc(100%-4rem)]">
            <nav className="flex flex-col gap-4 text-gray-800 dark:text-white">
                <button 
                    onClick={() => onNavigate('discover')} 
                    className={`${linkBaseClasses} ${activePage === 'discover' ? activeLinkClasses : inactiveLinkClasses}`}
                >
                    Discover
                </button>
                {currentUser && (
                    <>
                        <button 
                            onClick={() => onNavigate('myEvents')} 
                            className={`${linkBaseClasses} ${activePage === 'myEvents' ? activeLinkClasses : inactiveLinkClasses}`}
                        >
                            My Events
                        </button>
                        <button 
                            onClick={() => onNavigate('createUserEvent')} 
                            className={`${linkBaseClasses} ${activePage === 'createUserEvent' ? activeLinkClasses : inactiveLinkClasses}`}
                        >
                            <PlusIcon className="w-6 h-6" /> Create Event
                        </button>
                    </>
                )}
            </nav>

            <div className="text-gray-800 dark:text-white">
                <button onClick={onThemeToggle} className={`${linkBaseClasses} ${inactiveLinkClasses}`}>
                    {theme === 'dark' ? <SunIcon className="w-8 h-8"/> : <MoonIcon className="w-8 h-8"/>}
                    <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
                </button>

                <hr className="border-gray-200 dark:border-gray-600 my-4" />

                {currentUser ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-lg p-3">
                            <UserCircleIcon className="w-8 h-8"/>
                            <span className="font-semibold">{currentUser.name}</span>
                        </div>
                        <button onClick={onLogout} className={`${linkBaseClasses} ${inactiveLinkClasses}`}>
                            <LogoutIcon className="w-8 h-8"/>
                            <span>Logout</span>
                        </button>
                    </div>
                ) : (
                    <button onClick={onSignInClick} className={`${linkBaseClasses} ${inactiveLinkClasses}`}>
                        <UserCircleIcon className="w-8 h-8"/>
                        <span>Sign In</span>
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};