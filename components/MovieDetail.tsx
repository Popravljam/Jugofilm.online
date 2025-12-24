import Image from 'next/image';
import Link from 'next/link';
import { MovieWithCast } from '@/lib/queries';
import { getImageUrl } from '@/lib/tmdb';

interface Props {
  movie: MovieWithCast;
}

export default function MovieDetail({ movie }: Props) {
  const year = movie.release_date ? movie.release_date.slice(0,4) : '';
  const title = movie.original_title || movie.title;
  const hasMoney = (movie.budget || 0) > 0 || (movie.revenue || 0) > 0;
  const rating = movie.vote_average || 0;

  return (
    <div className="bg-neutral-900">
      {/* HERO with backdrop */}
      <section className="relative h-64 sm:h-80 md:h-96 overflow-hidden border-b border-neutral-800">
        {movie.backdrop_path && (
          <Image
            src={getImageUrl(movie.backdrop_path, 'original')}
            alt={title}
            fill
            priority
            className="object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/70 to-transparent" />
        <div className="relative h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-6">
          <div className="flex items-end gap-4">
            {/* Poster */}
            <div className="hidden sm:block">
              <div className="relative w-[160px] h-[240px] rounded-lg overflow-hidden border border-neutral-700 bg-neutral-800 shadow-lg">
                {movie.poster_path ? (
                  <Image src={getImageUrl(movie.poster_path)} alt={title} fill className="object-cover" />
                ) : (
                  <div className="h-full flex items-center justify-center text-neutral-500">Nema postera</div>
                )}
              </div>
            </div>
            {/* Title and meta */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-100">
                {title} {year && <span className="text-neutral-400">({year})</span>}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                {movie.runtime ? (
                  <span className="inline-flex items-center rounded-full border border-neutral-700 px-3 py-1 text-neutral-300">
                    ⏱️ {movie.runtime} min
                  </span>
                ) : null}
                {rating ? (
                  <span className="inline-flex items-center rounded-full border border-yellow-600/40 bg-yellow-500/10 px-3 py-1 text-yellow-400">
                    ★ {rating.toFixed(1)}
                  </span>
                ) : null}
                {hasMoney ? (
                  <span className="inline-flex items-center rounded-full border border-neutral-700 px-3 py-1 text-neutral-300">
                    ${((movie.budget||0)/1_000_000).toFixed(1)}M / ${((movie.revenue||0)/1_000_000).toFixed(1)}M
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Credits + overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
          {movie.overview && (
            <p className="text-neutral-300 leading-relaxed">{movie.overview}</p>
          )}

          {/* Genres */}
          {Array.isArray((movie as any).genres) && (movie as any).genres.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {(movie as any).genres.map((g: string) => (
                <span key={g} className="inline-flex items-center rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-300">{g}</span>
              ))}
            </div>
          )}

          {/* Trailer */}
          {(movie as any).youtube_key && (
            <div className="mt-4">
              <div className="aspect-video rounded-lg overflow-hidden border border-neutral-700 bg-neutral-800">
                <iframe
                  src={`https://www.youtube.com/embed/${(movie as any).youtube_key}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          )}

          {/* Cast */}
          {Array.isArray(movie.cast) && movie.cast.length > 0 && (
            <div>
                <h2 className="text-lg font-semibold text-yellow-500 mb-2">Glavne uloge</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm">
                  {movie.cast.slice(0,12).map((c: any) => (
                    <Link
                      key={c.id}
                      href={`/browse?actors=${encodeURIComponent(c.name)}`}
                      className="block rounded-lg border border-neutral-700 bg-neutral-800 p-3 hover:border-yellow-500/40 hover:shadow-md transition"
                    >
                      <div className="font-medium text-neutral-100 truncate">{c.name}</div>
                      {c.character && (
                        <div className="text-xs text-neutral-400 truncate">{c.character}</div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Facts */}
          <aside className="space-y-3">
            {movie.directors && movie.directors.length > 0 && (
              <div className="rounded-lg border border-neutral-700 bg-neutral-800 p-4">
                <div className="text-xs uppercase tracking-wider text-neutral-400 mb-1">Režija</div>
                <div className="text-sm text-neutral-200">{movie.directors.join(', ')}</div>
              </div>
            )}
            {movie.writers && movie.writers.length > 0 && (
              <div className="rounded-lg border border-neutral-700 bg-neutral-800 p-4">
                <div className="text-xs uppercase tracking-wider text-neutral-400 mb-1">Scenario</div>
                <div className="text-sm text-neutral-200">{movie.writers.join(', ')}</div>
              </div>
            )}
            <div className="rounded-lg border border-neutral-700 bg-neutral-800 p-4">
              <div className="text-xs uppercase tracking-wider text-neutral-400 mb-1">Eksterni linkovi</div>
              <div className="flex items-center gap-4 text-sm">
                {movie.imdb_id && (
                  <a
                    className="text-yellow-500 hover:text-yellow-400"
                    href={`https://www.imdb.com/title/${movie.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >IMDb</a>
                )}
                {movie.tmdb_id && (
                  <a
                    className="text-yellow-500 hover:text-yellow-400"
                    href={`https://www.themoviedb.org/movie/${movie.tmdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >TMDb</a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
