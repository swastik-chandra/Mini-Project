import React from 'react';

export const EventCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700"></div>
      <div className="p-4">
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="p-4 pt-0">
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  );
};