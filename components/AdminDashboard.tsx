

import React, { useState, useMemo } from 'react';
import type { Event, Notification, User } from '../types';
import { LogoutIcon, PlusIcon, SparklesIcon, PencilIcon, TrashIcon, BellIcon } from './Icons';
import { EventForm } from './EventForm';
import { ConfirmationModal } from './ConfirmationModal';
import { formatDate } from '../utils/date';
import { NotificationPanel } from './NotificationPanel';

interface AdminDashboardProps {
  events: Event[];
  users: User[];
  notifications: Notification[];
  onMarkNotificationsAsRead: () => void;
  onLogout: () => void;
  onCreateEvent: (newEvent: Omit<Event, 'id' | 'status'>) => void;
  onUpdateEvent: (updatedEvent: Event) => void;
  onDeleteEvent: (eventId: number) => void;
}

type AdminView = 'events' | 'users';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ events, users, notifications, onMarkNotificationsAsRead, onLogout, onCreateEvent, onUpdateEvent, onDeleteEvent }) => {
  const [activeView, setActiveView] = useState<AdminView>('events');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<number | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const approvedEvents = useMemo(() => events.filter(event => event.status === 'approved'), [events]);
  
  const handleOpenCreateForm = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };
  
  const handleOpenEditForm = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
  };
  
  const handleSaveEvent = (eventData: Omit<Event, 'id'> | Event) => {
    if ('id' in eventData) {
      onUpdateEvent(eventData);
    } else {
      // The `eventData` from the form includes a `status` property.
      // The `onCreateEvent` prop expects data without a `status`.
      // We destructure to remove `status` and pass the rest of the data.
      const { status, ...restOfEventData } = eventData;
      onCreateEvent(restOfEventData);
    }
    handleCloseForm();
  };
  
  const handleDeleteClick = (eventId: number) => {
    setDeletingEventId(eventId);
  };
  
  const handleConfirmDelete = () => {
    if (deletingEventId) {
      onDeleteEvent(deletingEventId);
    }
    setDeletingEventId(null);
  };

  const handleToggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (!isNotificationsOpen) {
        onMarkNotificationsAsRead();
    }
  }
  
  const tabBaseClasses = "px-4 py-2 font-semibold rounded-md transition-colors";
  const activeTabClasses = "bg-purple-600 text-white";
  const inactiveTabClasses = "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
            <SparklesIcon className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
            <div className="relative">
                <button onClick={handleToggleNotifications} className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full transition-colors" aria-label="Toggle notifications">
                    <BellIcon className="w-6 h-6"/>
                </button>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {unreadCount}
                    </span>
                )}
                {isNotificationsOpen && (
                    <NotificationPanel 
                        notifications={notifications}
                        onClose={() => setIsNotificationsOpen(false)}
                    />
                )}
            </div>

            <button onClick={onLogout} className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">
                <LogoutIcon className="w-5 h-5" />
                <span>Logout</span>
            </button>
        </div>
      </header>
      
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-4">
            <button onClick={() => setActiveView('events')} className={`${tabBaseClasses} ${activeView === 'events' ? activeTabClasses : inactiveTabClasses}`}>
                Manage Events
            </button>
            <button onClick={() => setActiveView('users')} className={`${tabBaseClasses} ${activeView === 'users' ? activeTabClasses : inactiveTabClasses}`}>
                User Management
            </button>
        </nav>
      </div>

      <main>
        {activeView === 'events' && (
            <div className="animate-fade-in">
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">All Events</h2>
                        <button onClick={handleOpenCreateForm} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-5 py-3 rounded-lg font-bold text-white transition-transform transform hover:scale-105">
                            <PlusIcon className="w-6 h-6" />
                            <span>Create New Event</span>
                        </button>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Event Title</th>
                            <th className="p-4 font-semibold hidden md:table-cell text-gray-600 dark:text-gray-300">Date</th>
                            <th className="p-4 font-semibold hidden lg:table-cell text-gray-600 dark:text-gray-300">Venue</th>
                            <th className="p-4 font-semibold text-right text-gray-600 dark:text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {approvedEvents.length > 0 ? approvedEvents.map(event => (
                            <tr key={event.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                                <td className="p-4 font-medium">{event.title}</td>
                                <td className="p-4 text-gray-500 dark:text-gray-400 hidden md:table-cell">{formatDate(event.date, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                <td className="p-4 text-gray-500 dark:text-gray-400 hidden lg:table-cell truncate max-w-xs">{event.venue}</td>
                                <td className="p-4 text-right">
                                <div className="flex justify-end items-center gap-2">
                                    <button onClick={() => handleOpenEditForm(event)} className="p-2 text-blue-500 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full transition-colors" aria-label="Edit event">
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDeleteClick(event.id)} className="p-2 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors" aria-label="Delete event">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                </td>
                            </tr>
                            )) : (
                            <tr>
                                <td colSpan={4} className="text-center p-8 text-gray-500 dark:text-gray-500">
                                No events found.
                                </td>
                            </tr>
                            )}
                        </tbody>
                        </table>
                    </div>
                    </div>
                </section>
            </div>
        )}

        {activeView === 'users' && (
            <section className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Registered Users</h2>
                </div>
                 <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">User Name</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Email</th>
                                    <th className="p-4 font-semibold hidden md:table-cell text-gray-600 dark:text-gray-300">Mobile Number</th>
                                    <th className="p-4 font-semibold hidden lg:table-cell text-gray-600 dark:text-gray-300">Registered On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? users.map(user => (
                                    <tr key={user.email} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                                        <td className="p-4 font-medium">{user.name}</td>
                                        <td className="p-4 text-gray-500 dark:text-gray-400">{user.email}</td>
                                        <td className="p-4 text-gray-500 dark:text-gray-400 hidden md:table-cell">{user.mobileNumber}</td>
                                        <td className="p-4 text-gray-500 dark:text-gray-400 hidden lg:table-cell">{new Date(user.registeredAt).toLocaleString()}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="text-center p-8 text-gray-500 dark:text-gray-500">
                                            No registered users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                 </div>
            </section>
        )}

      </main>

      {isFormOpen && (
        <EventForm
          event={editingEvent}
          onClose={handleCloseForm}
          onSave={handleSaveEvent}
        />
      )}
      
      {deletingEventId !== null && (
        <ConfirmationModal
          title="Delete Event"
          message="Are you sure you want to delete this event? This action cannot be undone."
          confirmButtonText="Confirm Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingEventId(null)}
        />
      )}
    </div>
  );
};
