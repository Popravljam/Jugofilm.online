'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
    
    // Optionally: disable tracking scripts here
    // For now, we just store the preference
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-950 border-t border-neutral-700 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-neutral-300 mb-2">
              🍪 Ovaj sajt koristi kolačiće (cookies) za analitiku i oglašavanje kako bi poboljšao korisničko iskustvo.
            </p>
            <p className="text-xs text-neutral-400">
              Prihvatanjem kolačića dozvoljavate korišćenje Google Analytics i Google AdSense kolačića.{' '}
              <Link href="/privacy" className="text-yellow-500 hover:text-yellow-400 underline">
                Politika privatnosti
              </Link>
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={declineCookies}
              className="px-4 py-2 text-sm text-neutral-300 border border-neutral-700 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Odbij
            </button>
            <button
              onClick={acceptCookies}
              className="px-4 py-2 text-sm bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Prihvati
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
