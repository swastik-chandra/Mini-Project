import React, { useState } from 'react';
import type { Event, Category } from '../types';
import { SparklesIcon, ArrowLeftIcon, CloudUploadIcon } from './Icons';
import { CATEGORIES } from '../constants';

interface UserEventFormProps {
  onClose: () => void;
  onSave: (event: Omit<Event, 'id' | 'status' | 'creator' | 'price' | 'currency'>) => void;
}

const initialFormData = {
    title: '',
    description: '',
    category: 'Music' as Category,
    date: '',
    time: '',
    venue: '',
    organizer: '',
    image: '',
    attendees: 0,
    capacity: 100,
    lat: 0,
    lng: 0,
};

export const UserEventForm: React.FC<UserEventFormProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, image: reader.result as string }));
            setFormError(null);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image) {
      setFormError("Please upload an image for the event.");
      return;
    }

    const eventData = {
      ...formData,
      attendees: 0, // New events start with 0 attendees
      capacity: Number(formData.capacity),
      location: {
        lat: Number(formData.lat),
        lng: Number(formData.lng),
      }
    };
    const { lat, lng, ...finalData } = eventData;

    onSave(finalData as Omit<Event, 'id' | 'status' | 'creator' | 'price' | 'currency'>);
  };

  const inputClass = "w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4 relative animate-fade-in">
      <button 
        onClick={onClose} 
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span>Back to Events</span>
      </button>
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
            <SparklesIcon className="w-12 h-12 text-purple-500 mx-auto mb-2" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Your Event</h1>
            <p className="text-gray-500 dark:text-gray-400">Fill out the details below. All events will have a fixed booking fee of ₹50.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-[75vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Title</label>
              <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} className={inputClass} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select name="category" id="category" value={formData.category} onChange={handleChange} className={inputClass} required>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="organizer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name / Organization</label>
                <input type="text" name="organizer" id="organizer" value={formData.organizer} onChange={handleChange} className={inputClass} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                <input type="time" name="time" id="time" value={formData.time} onChange={handleChange} className={inputClass} required />
              </div>
            </div>
            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Venue / Location Name</label>
              <input type="text" name="venue" id="venue" value={formData.venue} onChange={handleChange} className={inputClass} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lat" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Latitude</label>
                <input type="number" step="any" name="lat" id="lat" value={formData.lat} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label htmlFor="lng" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Longitude</label>
                <input type="number" step="any" name="lng" id="lng" value={formData.lng} onChange={handleChange} className={inputClass} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity</label>
                    <input type="number" name="capacity" id="capacity" value={formData.capacity} onChange={handleChange} className={inputClass} required />
                </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Image</label>
              <div className="mt-1 flex items-center gap-4">
                {formData.image && <img src={formData.image} alt="Event preview" className="w-24 h-24 object-cover rounded-lg" />}
                <label htmlFor="image-upload" className="cursor-pointer bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors flex items-center gap-2">
                  <CloudUploadIcon className="w-5 h-5" />
                  <span>{formData.image ? 'Change Image' : 'Upload Image'}</span>
                  <input id="image-upload" name="image" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/gif, image/webp" />
                </label>
              </div>
            </div>
            {formError && <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-500 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm">{formError}</div>}
            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg font-semibold transition-colors">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-transform transform hover:scale-105">Submit Event</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};