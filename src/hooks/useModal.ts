import { useState, useCallback, useEffect, useRef } from 'react';

const DEFAULT_OVERFLOW = 'unset';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const previousOverflow = useRef<string>('');

  const setBodyOverflow = useCallback((value: string) => {
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = value;
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    setBodyOverflow('hidden');
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = previousOverflow.current || DEFAULT_OVERFLOW;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = previousOverflow.current || DEFAULT_OVERFLOW;
    };
  }, []);

  return { isOpen, open, close };
};