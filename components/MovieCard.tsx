import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types/tmdb';
import { getImageUrl } from '@/lib/tmdb';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.id}`} className="group block">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-neutral-800 shadow-md transition-transform group-hover:scale-105 border border-neutral-700">
        {movie.poster_path ? (
          <Image
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-500">
            Nema slike
          </div>
        )}
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium text-neutral-100 line-clamp-2">
          {movie.original_title || (movie as any).title_local || (movie as any).title_en || movie.title}
        </h3>
        <p className="text-xs text-neutral-400 mt-1">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
        </p>
      </div>
    </Link>
  );
}
