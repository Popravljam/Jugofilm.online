'use client';

import { useState, useEffect } from 'react';
import { Movie } from '@/types/tmdb';
import MovieCard from './MovieCard';

interface MovieGridProps {
  initialMovies: Movie[];
  totalPages: number;
}

export default function MovieGrid({ initialMovies, totalPages }: MovieGridProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading || page >= totalPages) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/movies?page=${page + 1}`);
      const data = await response.json();
      setMovies((prev) => [...prev, ...data.results]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to load more movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 500
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, loading, totalPages]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie, index) => (
          <MovieCard key={`${movie.id}-${index}`} movie={movie} />
        ))}
      </div>
      
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {page >= totalPages && (
        <p className="text-center text-gray-500 py-8">
          Prikazani su svi filmovi
        </p>
      )}
    </>
  );
}
