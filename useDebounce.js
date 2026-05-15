import { useState, useEffect } from 'react';

/**
 * Debounce hook - Delays searching until user stops typing
 * @param {string} value - Search value
 * @param {number} delay - Delay in milliseconds
 * @returns {string} - Debounced value
 */
export function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}