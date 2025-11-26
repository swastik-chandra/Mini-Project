import React, { useState, useEffect, useRef } from 'react';
import type { Event, Category } from '../types';
import { XIcon, CloudUploadIcon } from './Icons';
import { CATEGORIES } from '../constants';

interface EventFormProps {
  event: Event | null; // null for creating, Event object for editing
  onClose: () => void;
  onSave: (event: Omit<Event, 'id'> | Event) => void;
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
    price: 0,
    currency: 'INR',
};

export const EventForm: React.FC<EventFormProps> = ({ event, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [isPaid, setIsPaid] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (event) {
      const isEventPaid = !!event.price && event.price > 0;
      setIsPaid(isEventPaid);
      setFormData({
        title: event.title,
        description: event.description,
        category: event.category,
        date: event.date,
        time: event.time,
        venue: event.venue,
        organizer: event.organizer,
        image: event.image || '',
        attendees: event.attendees,
        capacity: event.capacity,
        lat: event.location.lat,
        lng: event.location.lng,
        price: event.price || 0,
        currency: event.currency || 'INR',
      });
    } else {
        setIsPaid(false);
        setFormData(initialFormData);
    }
  }, [event]);

  // Accessibility: Escape to close and Focus Trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
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
    
    // Set initial focus on the first input
    const firstInput = modalRef.current?.querySelector('input, select, textarea');
    if (firstInput instanceof HTMLElement) {
        firstInput.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

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
            setFormError(null); // Clear error when a file is selected
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
      price: isPaid ? formData.price : undefined,
      currency: isPaid ? formData.currency : undefined,
      attendees: Number(formData.attendees),
      capacity: Number(formData.capacity),
      location: {
        lat: Number(formData.lat),
        lng: Number(formData.lng),
      }
    };
    // remove lat and lng from top level
    const { lat, lng, ...finalData } = eventData;

    if (event) {
      // FIX: Spread the original event object to preserve properties like 'createdAt', 'creator', etc.,
      // and then spread 'finalData' to apply form updates. This satisfies the 'Event' type for onSave.
      onSave({ ...event, ...finalData });
    } else {
      // FIX: Add 'status' and 'createdAt' for new events to satisfy the 'Omit<Event, "id">' type for onSave.
      onSave({ ...finalData, status: 'approved', createdAt: new Date().toISOString() });
    }
  };

  const inputClass = "w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all";

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-title"
    >
      <div 
        ref={modalRef}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in"
      >
        <header className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
            <h2 id="form-title" className="text-2xl font-bold">{event ? 'Edit Event' : 'Create New Event'}</h2>
            <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors" aria-label="Close form">
                <XIcon className="w-6 h-6" />
            </button>
        </header>
        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
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
                <label htmlFor="organizer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Owner / Organizer</label>
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
              <label htmlFor="venue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Venue</label>
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

            {/* Payment Section */}
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                    <label htmlFor="isPaid" className="font-medium text-gray-700 dark:text-gray-300">Paid Event?</label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input 
                            type="checkbox" 
                            name="isPaid" 
                            id="isPaid" 
                            checked={isPaid}
                            onChange={() => setIsPaid(!isPaid)}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white dark:bg-gray-500 border-4 appearance-none cursor-pointer"
                        />
                        <label htmlFor="isPaid" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"></label>
                    </div>
                </div>
                {isPaid && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-fade-in">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ticket Price</label>
                            <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className={inputClass} required={isPaid} min="0" />
                        </div>
                        <div>
                            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
                            <select name="currency" id="currency" value={formData.currency} onChange={handleChange} className={inputClass} required={isPaid}>
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Image</label>
              <div className="mt-1 flex items-center gap-4">
                {formData.image && (
                  <img src={formData.image} alt="Event preview" className="w-24 h-24 object-cover rounded-lg" />
                )}
                <label htmlFor="image-upload" className="cursor-pointer bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors flex items-center gap-2">
                  <CloudUploadIcon className="w-5 h-5" />
                  <span>{formData.image ? 'Change Image' : 'Upload Image'}</span>
                  <input id="image-upload" name="image" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/gif, image/webp" />
                </label>
              </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity</label>
                <input type="number" name="capacity" id="capacity" value={formData.capacity} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label htmlFor="attendees" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attendees (current)</label>
                <input type="number" name="attendees" id="attendees" value={formData.attendees} onChange={handleChange} className={inputClass} required />
              </div>
            </div>

            {formError && (
                <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-500 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm">
                    {formError}
                </div>
            )}

            <footer className="flex justify-end gap-4 pt-4 flex-shrink-0">
              <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg font-semibold transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-transform transform hover:scale-105">
                {event ? 'Save Changes' : 'Create Event'}
              </button>
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
};