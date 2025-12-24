"use client";
import { useEffect, useState } from 'react';
import MovieDetail from './MovieDetail';
import AdUnit from './AdUnit';

export default function MovieDetailClient({ id }: { id: number }) {
  const [movie, setMovie] = useState<any | null>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [resMovie, resSimilar] = await Promise.all([
          fetch(`/api/movie/${id}`),
          fetch(`/api/movie/${id}/similar`)
        ]);
        if (!resMovie.ok) {
          setError(`Greška: ${resMovie.status}`);
          return;
        }
        const data = await resMovie.json();
        setMovie(data);
        if (resSimilar.ok) {
          const s = await resSimilar.json();
          setSimilar(Array.isArray(s.similar) ? s.similar : []);
        }
      } catch (e: any) {
        setError(e?.message || 'Greška pri učitavanju');
      }
    }
    load();
  }, [id]);

  if (error) {
    return <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-neutral-400">{error}</div>;
  }
  if (!movie) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-64 bg-neutral-800/50 rounded-lg animate-pulse mb-6" />
      </div>
    );
  }

  return (
    <>
      <MovieDetail movie={movie} />
      
      {/* Ad between movie details and similar movies */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-xs text-neutral-500 mb-2">Oglas</p>
          <AdUnit adSlot="" adFormat="horizontal" />
        </div>
      </div>

      {similar.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <h2 className="text-lg font-semibold text-yellow-500 mb-3">Slični filmovi</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {similar.map((m: any) => (
              <a key={m.id} href={`/movie/${m.id}`} className="group block">
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-neutral-800 border border-neutral-700">
                  {m.poster_path ? (
                    <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} alt={m.title} className="w-full h-full object-cover group-hover:opacity-90 transition" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-neutral-500 text-sm">Nema postera</div>
                  )}
                </div>
                <div className="mt-2">
                  <div className="text-sm text-neutral-100 truncate">{m.original_title || m.title}</div>
                  <div className="text-xs text-neutral-400">{m.release_date ? m.release_date.slice(0,4) : ''}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
