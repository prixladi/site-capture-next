import { useEffect } from 'react';

const useBeforeUnload = (fc: () => void): void => {
  useEffect(() => {
    window.addEventListener('beforeunload', fc);
    return () => {
      window.removeEventListener('beforeunload', fc);
    };
  }, [fc]);
};

export default useBeforeUnload;
