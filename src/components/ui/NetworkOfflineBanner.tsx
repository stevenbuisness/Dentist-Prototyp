import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export function NetworkOfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 shadow-md animate-in slide-in-from-top-full duration-300">
      <div className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-center gap-2 text-white text-sm">
        <WifiOff size={16} />
        <p className="font-medium">
          <span className="hidden sm:inline">Keine Internetverbindung. Die Applikation befindet sich im Offline-Modus.</span>
          <span className="sm:hidden">Offline-Modus aktiv</span>
        </p>
      </div>
    </div>
  );
}
