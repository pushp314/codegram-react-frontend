// =============== src/hooks/useKeyPress.ts ===============
import { useEffect } from 'react';

/**
 * A custom hook to execute a callback function when a specific key is pressed.
 * @param targetKey The key to listen for (e.g., 'k', 'Enter').
 * @param callback The function to call when the key is pressed.
 */
export const useKeyPress = (targetKey: string, callback: () => void) => {
  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      // Check for modifier keys like Ctrl or Cmd
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === targetKey.toLowerCase()) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', downHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [targetKey, callback]);
};
