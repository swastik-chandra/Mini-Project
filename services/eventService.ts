
import type { Event, User } from '../types';

const adminUser: User = {
  name: 'Admin',
  email: 'admin@example.com',
  mobileNumber: '1234567890',
  registeredAt: new Date('2026-01-01T00:00:00Z').toISOString(),
};

const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Synthwave Nights Delhi',
    description: 'An immersive night of retro-futuristic synthwave music. Featuring live DJs, laser shows, and 80s themed cocktails. Dress to impress in your best cyberpunk attire!',
    category: 'Music',
    date: '2026-08-15',
    time: '20:00',
    venue: 'Hauz Khas Social, Delhi',
    organizer: 'Retrograde Events',
    image: 'https://images.unsplash.com/photo-1571266066716-c6695d510890?q=80&w=800&auto=format&fit=crop',
    attendees: 150,
    capacity: 200,
    location: { lat: 28.5535, lng: 77.1945 }, // Delhi
    price: 500,
    currency: 'INR',
    status: 'approved',
    creator: adminUser,
    createdAt: new Date('2026-07-01T10:00:00Z').toISOString(),
  },
  {
    id: 2,
    title: 'React Horizon Bangalore',
    description: 'A full-day conference for frontend developers. Explore the latest trends in React, state management, and component architecture with talks from industry experts.',
    category: 'Tech',
    date: '2026-09-10',
    time: '09:00',
    venue: 'Bangalore Int. Centre',
    organizer: 'DevConnect',
    image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=800&auto=format&fit=crop',
    attendees: 450,
    capacity: 500,
    location: { lat: 12.9716, lng: 77.5946 }, // Bangalore
    price: 1500,
    currency: 'INR',
    status: 'approved',
    creator: adminUser,
    createdAt: new Date('2026-07-02T11:00:00Z').toISOString(),
  },
  {
    id: 3,
    title: 'Digital Art Fest Mumbai',
    description: 'Celebrate the fusion of art and technology. This festival showcases stunning digital artworks, animated shorts, and VR experiences from artists around the globe.',
    category: 'Art',
    date: '2026-08-20',
    time: '11:00',
    venue: 'Jehangir Art Gallery, Mumbai',
    organizer: 'Pixel Perfect Collective',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
    attendees: 280,
    capacity: 350,
    location: { lat: 18.9276, lng: 72.8329 }, // Mumbai
    price: 250,
    currency: 'INR',
    status: 'approved',
    creator: adminUser,
    createdAt: new Date('2026-07-03T12:00:00Z').toISOString(),
  },
  {
    id: 4,
    title: 'Delhi Street Food Fair',
    description: 'Embark on a culinary journey through Old Delhi! Taste authentic dishes from dozens of stalls, with live music and cultural performances.',
    category: 'Food',
    date: '2026-09-01',
    time: '12:00',
    venue: 'Chandni Chowk, Delhi',
    organizer: 'Global Bites',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
    attendees: 1200,
    capacity: 1500,
    location: { lat: 28.6562, lng: 77.2410 }, // Delhi
    status: 'approved',
    creator: adminUser,
    createdAt: new Date('2026-07-04T13:00:00Z').toISOString(),
  },
  {
    id: 5,
    title: 'Mumbai Marathon Challenge',
    description: 'Test your limits in the annual city marathon. A scenic route through the heart of Mumbai, with categories for all fitness levels.',
    category: 'Sports',
    date: '2026-10-05',
    time: '07:00',
    venue: 'Marine Drive Start Line',
    organizer: 'City Athletics Dept.',
    image: 'https://images.unsplash.com/photo-1552674605-469523170d98?q=80&w=800&auto=format&fit=crop',
    attendees: 5000,
    capacity: 5000,
    location: { lat: 18.9440, lng: 72.8245 }, // Mumbai
    status: 'approved',
    creator: adminUser,
    createdAt: new Date('2026-07-05T14:00:00Z').toISOString(),
  },
  {
    id: 6,
    title: 'Blue Pottery Workshop Jaipur',
    description: 'Get your hands dirty and unleash your creativity. A beginner-friendly workshop where you will learn the basics of Jaipur\'s famous blue pottery art.',
    category: 'Workshop',
    date: '2026-08-25',
    time: '14:00',
    venue: 'Jawahar Kala Kendra, Jaipur',
    organizer: 'Artful Hands',
    image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?q=80&w=800&auto=format&fit=crop',
    attendees: 15,
    capacity: 20,
    location: { lat: 26.8839, lng: 75.8083 }, // Jaipur
    status: 'approved',
    creator: adminUser,
    createdAt: new Date('2026-07-06T15:00:00Z').toISOString(),
  },
  {
    id: 7,
    title: 'Sufi Nights in Kolkata',
    description: 'An elegant evening of live Sufi music by the Hooghly river. Bring a picnic and enjoy soulful melodies from the city\'s best artists.',
    category: 'Music',
    date: '2026-09-14',
    time: '19:30',
    venue: 'Prinsep Ghat, Kolkata',
    organizer: 'The Music Society',
    image: 'https://images.unsplash.com/photo-1514320291940-7c5846664a42?q=80&w=800&auto=format&fit=crop',
    attendees: 300,
    capacity: 400,
    location: { lat: 22.5594, lng: 88.3371 }, // Kolkata
    status: 'approved',
    creator: adminUser,
    createdAt: new Date('2026-07-07T16:00:00Z').toISOString(),
  },
  {
    id: 8,
    title: 'AI & The Future - Hyderabad',
    description: 'A thought-provoking seminar on the impact of artificial intelligence. Network with tech leaders from HITECH City and gain insights into the future of work.',
    category: 'Tech',
    date: '2026-10-20',
    time: '18:00',
    venue: 'T-Hub, Hyderabad',
    organizer: 'Innovate Forward',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop',
    attendees: 200,
    capacity: 250,
    location: { lat: 17.4475, lng: 78.3762 }, // Hyderabad
    status: 'approved',
    creator: adminUser,
    createdAt: new Date('2026-07-08T17:00:00Z').toISOString(),
  },
];

export const fetchEvents = (): Promise<Event[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockEvents);
    }, 1000); // Simulate network delay
  });
};


export const fetchRecommendedEvents = (): Promise<Event[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        // Simple logic: return first 3 events of different categories
        const recommended = [mockEvents[0], mockEvents[1], mockEvents[3]];
        resolve(recommended);
      }, 500);
    });
  };
