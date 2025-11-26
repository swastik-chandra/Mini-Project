
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { EventDetailModal } from './components/EventDetailModal';
import { ToastNotification } from './components/ToastNotification';
import { fetchEvents, fetchRecommendedEvents } from './services/eventService';
import type { Event, User, Notification, Category } from './types';
import { getDistanceInMiles, type Location } from './utils/geo';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { DiscoverPage } from './components/DiscoverPage';
import { MyEventsPage } from './components/MyEventsPage';
import { UserLoginPage } from './components/UserLoginPage';
import { SignupPage } from './components/SignupPage';
import { useDebounce } from './hooks/useDebounce';
import { PaymentModal } from './components/PaymentModal';
import { UserEventForm } from './components/UserEventForm';
import { EventForm } from './components/EventForm';
import { UpgradeCapacityModal } from './components/UpgradeCapacityModal';

type Theme = 'light' | 'dark';

// Version control for local storage data
const APP_VERSION = '2026.1';

try {
    const currentVersion = localStorage.getItem('app_version');
    if (currentVersion !== APP_VERSION) {
        // Clear events to ensure new images are loaded
        localStorage.removeItem('events');
        localStorage.setItem('app_version', APP_VERSION);
    }
} catch (e) {
    console.warn('Failed to check app version', e);
}

const getInitialState = <T,>(key: string, defaultValue: T): T => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key “${key}”:`, error);
      return defaultValue;
    }
};

const defaultUsers: User[] = [
    { name: 'Jane Doe', email: 'user@example.com', mobileNumber: '9876543210', registeredAt: new Date().toISOString() }
];

const USER_EVENT_BOOKING_FEE = 50;
const CAPACITY_UPGRADE_FEE_PERCENTAGE = 0.20;

const App: React.FC = () => {
  type CurrentPage = 'discover' | 'myEvents' | 'login' | 'admin' | 'userLogin' | 'signup' | 'createUserEvent';
  const [currentPage, setCurrentPage] = useState<CurrentPage>('discover');
  const [theme, setTheme] = useState<Theme>('dark');
  
  const [allEvents, setAllEvents] = useState<Event[]>(() => getInitialState<Event[]>('events', []));
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventForPayment, setEventForPayment] = useState<Event | null>(null);
  const [userEditingEvent, setUserEditingEvent] = useState<Event | null>(null);
  const [upgradeInfo, setUpgradeInfo] = useState<{ event: Event; fee: number } | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [selectedCategory, setSelectedCategory] = useState<'all' | Category>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [selectedDistance, setSelectedDistance] = useState<string>('all');
  const [userLocation, setUserLocation] = useState<Location | null>(null);

  const [allUsers, setAllUsers] = useState<User[]>(() => getInitialState<User[]>('allUsers', defaultUsers));
  const [currentUser, setCurrentUser] = useState<User | null>(() => getInitialState<User | null>('currentUser', null));
  const [pendingAction, setPendingAction] = useState<{ action: () => void; reason: string } | null>(null);

  // Notification States
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toast, setToast] = useState<Notification | null>(null);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  
  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      localStorage.setItem('allUsers', JSON.stringify(allUsers));
    } catch (error) {
      console.error('Failed to save user data to localStorage:', error);
    }
  }, [currentUser, allUsers]);

  useEffect(() => {
    if (allEvents.length > 0) {
      try {
        localStorage.setItem('events', JSON.stringify(allEvents));
      } catch (error) {
        console.error('Failed to save events to localStorage:', error);
      }
    }
  }, [allEvents]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);
  
  const addNotification = useCallback((message: string, type: Notification['type']) => {
    const newNotification: Notification = {
        id: Date.now(),
        message,
        type,
        timestamp: new Date().toISOString(),
        read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
    setToast(newNotification);
  }, []);

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleThemeToggle = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const handleToggleNotificationPanel = () => {
    if (!isNotificationPanelOpen) {
        markNotificationsAsRead();
    }
    setIsNotificationPanelOpen(prev => !prev);
  };

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [eventsData, recommendedData] = await Promise.all([
        fetchEvents(),
        fetchRecommendedEvents(),
      ]);
      setAllEvents(eventsData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      setRecommendedEvents(recommendedData);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedEvents = getInitialState<Event[]>('events', []);
    if (storedEvents.length > 0) {
      setAllEvents(storedEvents);
      const approvedEvents = storedEvents.filter(e => e.status === 'approved');
      const recommended = [approvedEvents[0], approvedEvents[1], approvedEvents[3]].filter(Boolean);
      setRecommendedEvents(recommended);
      setIsLoading(false);
    } else {
      loadInitialData();
    }

    const getLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            (error) => {
              console.error("Error getting user location:", error.message);
            }
          );
        }
      };

    getLocation();
  }, [loadInitialData]);

  useEffect(() => {
    if ((currentPage === 'myEvents' || currentPage === 'createUserEvent') && !currentUser) {
      setCurrentPage('discover');
    }
  }, [currentPage, currentUser]);
  
  const protectedAction = (action: () => void, reason: string) => {
    if (!currentUser) {
      setPendingAction({ action, reason });
      setCurrentPage('userLogin');
    } else {
      action();
    }
  };

  const handleRsvpToggle = useCallback((eventId: number) => {
    const updateEventRsvp = (events: Event[]) => 
    events.map(event =>
        event.id === eventId
        ? { ...event, isRsvpd: !event.isRsvpd, attendees: event.isRsvpd ? event.attendees - 1 : event.attendees + 1 }
        : event
    );
    
    setAllEvents(updateEventRsvp);
    setRecommendedEvents(updateEventRsvp);

    if (selectedEvent?.id === eventId) {
    setSelectedEvent(prev => prev ? { ...prev, isRsvpd: !prev.isRsvpd, attendees: prev.isRsvpd ? prev.attendees - 1 : prev.attendees + 1 } : null);
    }
  }, [selectedEvent]);

  const handleInitiatePayment = useCallback((event: Event) => {
    protectedAction(() => {
        if (event.price && event.price > 0 && !event.isRsvpd) {
            setEventForPayment(event);
        } else {
            handleRsvpToggle(event.id);
        }
    }, `Log in to purchase a ticket for "${event.title}"`);
  }, [handleRsvpToggle, currentUser]);

  const handleBookmarkToggle = useCallback((eventId: number) => {
    const event = allEvents.find(e => e.id === eventId);
    protectedAction(() => {
        const updateEventBookmark = (events: Event[]) => 
        events.map(event =>
            event.id === eventId
            ? { ...event, isBookmarked: !event.isBookmarked }
            : event
        );
        
        setAllEvents(updateEventBookmark);
        setRecommendedEvents(updateEventBookmark);

        if (selectedEvent?.id === eventId) {
        setSelectedEvent(prev => prev ? { ...prev, isBookmarked: !prev.isBookmarked } : null);
        }
    }, `Log in to bookmark "${event?.title}"`);
  }, [selectedEvent, currentUser, allEvents]);

  const handleUserLogin = (email: string) => {
    const userToLogin = allUsers.find(user => user.email === email);
    if (userToLogin) {
        setCurrentUser(userToLogin);
        setCurrentPage('discover');
        if (pendingAction) {
            pendingAction.action();
            setPendingAction(null);
        }
        return true;
    }
    return false;
  };

  const handleSignup = (user: User) => {
    setAllUsers(prev => [...prev, user]);
    setCurrentUser(user);
    addNotification(`New user signed up: ${user.name}`, 'newUser');
    setCurrentPage('discover');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedEvent(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('events');
    loadInitialData();
    setCurrentPage('discover');
  };

  const handleCreateEvent = (newEventData: Omit<Event, 'id' | 'status'>) => {
    const newEvent: Event = {
      ...newEventData,
      id: Date.now(),
      status: 'approved',
      createdAt: new Date().toISOString(),
    };
    const updatedEvents = [...allEvents, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setAllEvents(updatedEvents);
    addNotification(`New event "${newEvent.title}" has been added.`, 'newEvent');
  };

  const handleUserCreateEvent = (newEventData: Omit<Event, 'id' | 'status' | 'creator' | 'price' | 'currency'>) => {
    if (!currentUser) return;
    const newEvent: Event = {
      ...newEventData,
      id: Date.now(),
      status: 'approved',
      creator: currentUser,
      price: USER_EVENT_BOOKING_FEE,
      currency: 'INR',
      createdAt: new Date().toISOString(),
    };
    setAllEvents(prev => [...prev, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    addNotification(`New event "${newEvent.title}" was created by ${currentUser.name}.`, 'newEvent');
    setCurrentPage('myEvents');
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    const updateEventInList = (events: Event[]) => 
      events.map(event => event.id === updatedEvent.id ? updatedEvent : event);

    setAllEvents(prevEvents => updateEventInList(prevEvents).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setRecommendedEvents(prevEvents => updateEventInList(prevEvents));

    if (updatedEvent.creator && currentUser && updatedEvent.creator.email === currentUser.email) {
      addNotification(`Your event "${updatedEvent.title}" was updated.`, 'editEvent');
    }
  };
  
  const handleInitiateEdit = (event: Event) => {
    setUserEditingEvent(event);
  };

  const handleUserUpdateEvent = (updatedEvent: Event) => {
    const originalEvent = allEvents.find(e => e.id === updatedEvent.id);
    if (!originalEvent) return;

    if (updatedEvent.capacity > originalEvent.capacity) {
      const capacityIncrease = updatedEvent.capacity - originalEvent.capacity;
      const potentialRevenue = capacityIncrease * (originalEvent.price || USER_EVENT_BOOKING_FEE);
      const upgradeFee = potentialRevenue * CAPACITY_UPGRADE_FEE_PERCENTAGE;
      
      setUpgradeInfo({ event: updatedEvent, fee: upgradeFee });
      setUserEditingEvent(null);
    } else {
      handleUpdateEvent(updatedEvent);
      setUserEditingEvent(null);
    }
  };

  const handleCapacityUpgradePayment = (updatedEvent: Event) => {
    handleUpdateEvent(updatedEvent);
    setUpgradeInfo(null);
  };

  const handleDeleteEvent = (eventId: number) => {
    setAllEvents(allEvents.filter(event => event.id !== eventId));
    setRecommendedEvents(recommendedEvents.filter(event => event.id !== eventId));
  };
  
  const handlePaymentNotification = (event: Event) => {
    addNotification(`Ticket purchased for "${event.title}".`, 'payment');
  }

  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      if (event.status !== 'approved') return false;
        
      const searchWords = debouncedSearchTerm.toLowerCase().split(' ').filter(word => word.length > 0);
      const matchesSearchTerm = () => {
        if (searchWords.length === 0) return true;
        const eventText = [
            event.title,
            event.description,
            event.category,
            event.venue,
            event.organizer
        ].join(' ').toLowerCase();

        return searchWords.every(word => eventText.includes(word));
      };
      
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      
      const matchesDate = () => {
        if (selectedDate === 'all') {
            return true;
        }
        
        const today = new Date();
        const eventDate = new Date(`${event.date}T12:00:00`); // Use noon to avoid timezone issues near midnight
        
        switch (selectedDate) {
            case 'today':
                const todayString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
                return event.date === todayString;
                
            case 'thisWeek': {
                const dayOfWeek = today.getDay(); // 0 = Sunday
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - dayOfWeek);
                startOfWeek.setHours(0, 0, 0, 0);

                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                endOfWeek.setHours(23, 59, 59, 999);

                return eventDate >= startOfWeek && eventDate <= endOfWeek;
            }
            
            case 'thisMonth': {
                const todayYear = today.getFullYear();
                const todayMonth = (today.getMonth() + 1).toString().padStart(2, '0');
                const eventYearMonth = event.date.substring(0, 7); // "YYYY-MM"
                return eventYearMonth === `${todayYear}-${todayMonth}`;
            }
            
            default:
                return true;
        }
      };

      const matchesDistance = () => {
        if (selectedDistance === 'all' || !userLocation) {
          return true;
        }
        const distance = getDistanceInMiles(userLocation, event.location);
        return distance <= parseInt(selectedDistance, 10);
      };

      return matchesSearchTerm() && matchesCategory && matchesDate() && matchesDistance();
    });
  }, [allEvents, debouncedSearchTerm, selectedCategory, selectedDate, selectedDistance, userLocation]);

  const handleSelectEvent = useCallback((event: Event) => {
    setSelectedEvent(event);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedEvent(null);
  }, []);
  

  if (currentPage === 'login') {
    return <LoginPage onBack={() => setCurrentPage('userLogin')} onLoginSuccess={() => setCurrentPage('admin')} />;
  }
  
  if (currentPage === 'userLogin') {
    return <UserLoginPage reason={pendingAction?.reason} onLoginSuccess={handleUserLogin} onNavigateToSignup={() => setCurrentPage('signup')} onNavigateToAdminLogin={() => setCurrentPage('login')} onNavigateToDiscover={() => setCurrentPage('discover')} />;
  }
  
  if (currentPage === 'signup') {
      return <SignupPage reason={pendingAction?.reason} onSignupSuccess={handleSignup} onNavigateToLogin={() => setCurrentPage('userLogin')} onNavigateToDiscover={() => setCurrentPage('discover')} />;
  }

  if (currentPage === 'admin') {
    return (
      <AdminDashboard 
        events={allEvents}
        users={allUsers}
        notifications={notifications}
        onMarkNotificationsAsRead={markNotificationsAsRead}
        onLogout={() => setCurrentPage('discover')}
        onCreateEvent={handleCreateEvent}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    );
  }

  if (currentPage === 'createUserEvent') {
      return (
        <UserEventForm
            onSave={handleUserCreateEvent}
            onClose={() => setCurrentPage('discover')}
        />
      );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-slate-800">
      <Header 
        onSignInClick={() => setCurrentPage('userLogin')} 
        activePage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        currentUser={currentUser}
        onLogout={handleLogout}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        notifications={notifications}
        unreadCount={unreadCount}
        isNotificationPanelOpen={isNotificationPanelOpen}
        onToggleNotificationPanel={handleToggleNotificationPanel}
      />
      <main className="container mx-auto px-4 py-8">
        <div key={currentPage} className="animate-fade-in">
            {currentPage === 'discover' && (
            <DiscoverPage
                isLoading={isLoading}
                recommendedEvents={recommendedEvents}
                filteredEvents={filteredEvents}
                onSelectEvent={handleSelectEvent}
                onRsvpToggle={handleInitiatePayment}
                onBookmarkToggle={handleBookmarkToggle}
                searchTerm={debouncedSearchTerm}
                filterBarProps={{
                    searchTerm,
                    setSearchTerm,
                    selectedCategory: selectedCategory,
                    setSelectedCategory: setSelectedCategory,
                    selectedDate,
                    setSelectedDate,
                    selectedDistance,
                    setSelectedDistance,
                    isLocationAvailable: !!userLocation
                }}
            />
            )}
            {currentPage === 'myEvents' && currentUser && (
            <MyEventsPage
                allEvents={allEvents}
                currentUser={currentUser}
                onSelectEvent={handleSelectEvent}
                onRsvpToggle={handleInitiatePayment}
                onBookmarkToggle={handleBookmarkToggle}
                onInitiateEdit={handleInitiateEdit}
            />
            )}
        </div>
      </main>
      
      {toast && (
        <ToastNotification notification={toast} onClose={() => setToast(null)} />
      )}

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={handleCloseModal}
          onRsvpToggle={handleInitiatePayment}
          onBookmarkToggle={handleBookmarkToggle}
        />
      )}

      {eventForPayment && (
        <PaymentModal 
            event={eventForPayment}
            onClose={() => setEventForPayment(null)}
            onPaymentSuccess={(eventId) => {
                handleRsvpToggle(eventId);
                setEventForPayment(null);
            }}
            onPaymentNotification={handlePaymentNotification}
        />
      )}

      {userEditingEvent && (
        <EventForm 
            event={userEditingEvent}
            onClose={() => setUserEditingEvent(null)}
            onSave={handleUserUpdateEvent}
        />
      )}
      
      {upgradeInfo && (
        <UpgradeCapacityModal
            fee={upgradeInfo.fee}
            currency="INR"
            onClose={() => setUpgradeInfo(null)}
            onConfirm={() => handleCapacityUpgradePayment(upgradeInfo.event)}
        />
      )}
      
    </div>
  );
};

export default App;
