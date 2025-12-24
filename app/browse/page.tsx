'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import AdUnit from '@/components/AdUnit';

const MovieBrowser = dynamic(() => import('@/components/MovieBrowser'), { ssr: false });

export default function BrowsePage() {
  return (
    <div className="min-h-screen bg-neutral-900">
      <header className="bg-neutral-950 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-yellow-500">Pretraga filmova po glumcima</h1>
            <p className="text-neutral-400">Filtriraj po glumcima, sortiraj rezultate</p>
          </div>
          <Link href="/" className="text-yellow-500 hover:text-yellow-400 transition-colors">Početna</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Banner Ad */}
        <div className="mb-8">
          <div className="text-center">
            <p className="text-xs text-neutral-500 mb-2">Oglas</p>
            <AdUnit adSlot="" adFormat="horizontal" />
          </div>
        </div>

        <MovieBrowser />
      </main>
    </div>
  );
}
