

export type Category = 'Music' | 'Tech' | 'Art' | 'Food' | 'Sports' | 'Workshop';

export interface Event {
  id: number;
  title: string;
  description: string;
  category: Category;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  image?: string;
  attendees: number;
  capacity: number;
  location: {
    lat: number;
    lng: number;
  };
  price?: number;
  currency?: string;
  isRsvpd?: boolean;
  isBookmarked?: boolean;
  status: 'approved';
  creator?: User;
  createdAt: string; // ISO date string
}

export interface User {
    name: string;
    email: string;
    mobileNumber: string;
    registeredAt: string; // ISO date string
}

export interface Notification {
    id: number;
    message: string;
    type: 'newEvent' | 'payment' | 'newUser' | 'editEvent';
    timestamp: string;
    read: boolean;
}