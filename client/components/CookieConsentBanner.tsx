import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (consent !== 'given') {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'given');
    setShowBanner(false);
  };

  const handleReject = () => {
    // You can implement logic for rejecting cookies here if needed
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-50 flex items-center justify-between">
      <p className="text-sm">
        We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
      </p>
      <div className="flex gap-4">
        <Button variant="secondary" onClick={handleAccept}>Accept</Button>
        <Button variant="outline" onClick={handleReject}>Reject</Button>
      </div>
    </div>
  );
}
