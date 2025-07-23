// =============== src/hooks/useAutosave.ts ===============
import { useEffect, useRef } from 'react';

/**
 * A custom hook to automatically save form data to localStorage at a regular interval.
 * @param key The unique key for the localStorage item.
 * @param data The data to be saved.
 * @param interval The save interval in milliseconds (defaults to 10 seconds).
 */
export const useAutosave = <T>(key: string, data: T, interval = 10000) => {
  const dataRef = useRef(data);

  // Update the ref whenever data changes so the interval has the latest data
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    const handler = setInterval(() => {
      if (dataRef.current) {
        localStorage.setItem(key, JSON.stringify(dataRef.current));
      }
    }, interval);

    return () => {
      clearInterval(handler);
    };
  }, [key, interval]);

  const clearSavedDraft = () => {
    localStorage.removeItem(key);
  };

  return { clearSavedDraft };
};

/**
 * Loads a saved draft from localStorage.
 * @param key The unique key for the localStorage item.
 * @returns The parsed data or null if not found.
 */
export const loadDraft = <T>(key: string): T | null => {
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved) as T;
    } catch (e) {
      console.error("Failed to parse draft from localStorage", e);
      return null;
    }
  }
  return null;
};
