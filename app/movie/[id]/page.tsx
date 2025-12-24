'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import MovieDetailClient from '@/components/MovieDetailClient';

export default function Page() {
  const params = useParams<{ id: string | string[] }>();
  const raw = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = Number(raw);

  if (!Number.isFinite(id)) {
    return (
      <div className="min-h-screen bg-neutral-900 text-neutral-200">
        <div className="max-w-3xl mx-auto p-8">
          <h1 className="text-xl font-bold text-yellow-500 mb-4">Neispravan ID</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900">
      <header className="bg-neutral-950 border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-yellow-500 hover:text-yellow-400 text-sm">← Početna</Link>
        </div>
      </header>
      <MovieDetailClient id={id} />
    </div>
  );
}
