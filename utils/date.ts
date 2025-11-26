export const formatDate = (dateString: string, options: Intl.DateTimeFormatOptions): string => {
    // Adding a timeZone to ensure consistency, as the date string doesn't have one.
    return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-US', {
        ...options,
        timeZone: 'UTC' 
    });
};
