'use client';

import Script from 'next/script';

export default function GoogleAdsense({ publisherId }: { publisherId: string }) {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
