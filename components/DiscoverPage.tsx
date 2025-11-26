


import React from 'react';
import type { Event, Category } from '../types';
import { FilterBar } from './FilterBar';
import { EventGrid } from './EventGrid';
import { EventMapView } from './EventMapView';
import { EventCardSkeleton } from './EventCardSkeleton';
import { CATEGORIES } from '../constants';
import { ContactUs } from './ContactUs';

interface DiscoverPageProps {
    isLoading: boolean;
    recommendedEvents: Event[];
    filteredEvents: Event[];
    onSelectEvent: (event: Event) => void;
    onRsvpToggle: (event: Event) => void;
    onBookmarkToggle: (eventId: number) => void;
    searchTerm: string;
    filterBarProps: {
        searchTerm: string;
        setSearchTerm: (term: string) => void;
        selectedCategory: Category | 'all';
        setSelectedCategory: (category: Category | 'all') => void;
        selectedDate: string;
        setSelectedDate: (date: string) => void;
        selectedDistance: string;
        setSelectedDistance: (distance: string) => void;
        isLocationAvailable: boolean;
    };
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
    isLoading,
    recommendedEvents,
    filteredEvents,
    onSelectEvent,
    onRsvpToggle,
    onBookmarkToggle,
    searchTerm,
    filterBarProps
}) => {
    return (
        <>
            <FilterBar {...filterBarProps} categories={CATEGORIES} />
            {isLoading ? (
            <>
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Upcoming Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, index) => <EventCardSkeleton key={index} />)}
                    </div>
                </section>
                
                <section>
                    <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-600">Recommended For You</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, index) => <EventCardSkeleton key={index} />)}
                    </div>
                </section>
            </>
            ) : (
            <>
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Upcoming Events</h2>
                    {filteredEvents.length > 0 ? (
                        <EventGrid events={filteredEvents} onSelectEvent={onSelectEvent} onRsvpToggle={onRsvpToggle} onBookmarkToggle={onBookmarkToggle} searchTerm={searchTerm} />
                    ) : (
                        <div className="text-center py-16 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400">No events found</h3>
                        <p className="text-gray-500 dark:text-gray-500 mt-2">Try adjusting your search filters.</p>
                        </div>
                    )}
                </section>

                <section>
                    <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-600">Recommended For You</h2>
                    <EventGrid events={recommendedEvents} onSelectEvent={onSelectEvent} onRsvpToggle={onRsvpToggle} onBookmarkToggle={onBookmarkToggle} searchTerm={searchTerm} />
                </section>
                
                {filteredEvents.length > 0 && (
                <section className="mt-12">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Event Map</h2>
                    <EventMapView events={filteredEvents} onSelectEvent={onSelectEvent} />
                </section>
                )}
                <ContactUs />
            </>
            )}
      </>
    );
};
