import React from 'react';
import type { Category } from '../types';
import { SearchIcon, CalendarIcon, TagIcon, GlobeIcon } from './Icons';

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: Category | 'all';
  setSelectedCategory: (category: Category | 'all') => void;
  categories: Category[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedDistance: string;
  setSelectedDistance: (distance: string) => void;
  isLocationAvailable: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  selectedDate,
  setSelectedDate,
  selectedDistance,
  setSelectedDistance,
  isLocationAvailable
}) => {
  return (
    <div className="mb-8 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Search Input */}
        <div className="relative">
          <label htmlFor="search-input" className="sr-only">Search events</label>
          <input
            id="search-input"
            type="text"
            placeholder="Search events or organizers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-3 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-400" />
        </div>

        {/* Category Select */}
        <div className="relative">
          <label htmlFor="category-select" className="sr-only">Filter by category</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as Category | 'all')}
            className="w-full appearance-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-400" />
        </div>

        {/* Date Select */}
        <div className="relative">
          <label htmlFor="date-select" className="sr-only">Filter by date</label>
          <select
            id="date-select"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full appearance-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          >
            <option value="all">Any Date</option>
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
          </select>
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-400 pointer-events-none" />
        </div>

        {/* Distance Select */}
        <div className="relative">
          <label htmlFor="distance-select" className="sr-only">Filter by distance</label>
          <select
            id="distance-select"
            value={selectedDistance}
            onChange={(e) => setSelectedDistance(e.target.value)}
            disabled={!isLocationAvailable}
            className="w-full appearance-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title={!isLocationAvailable ? "Enable location services to use this filter" : "Filter by distance"}
          >
            <option value="all">Any Distance</option>
            <option value="5">Under 5 miles</option>
            <option value="10">Under 10 miles</option>
            <option value="25">Under 25 miles</option>
            <option value="50">Under 50 miles</option>
          </select>
          <GlobeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-400" />
        </div>
      </div>
    </div>
  );
};