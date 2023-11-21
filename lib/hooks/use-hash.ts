'use client';

import { useEffect, useState } from 'react';

function getHash() {
  return typeof window !== 'undefined'
    ? decodeURIComponent(window.location.hash.replace('#', ''))
    : undefined;
}

export function useHash() {
  const [hash, setHash] = useState(getHash());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const handleHashChange = () => {
      setHash(getHash());
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return isClient ? hash : null;
}
