'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MovieWithCast } from '@/types/tmdb';
import MovieCard from './MovieCard';

interface ActorData {
  name: string;
  movieIds: number[];
}

export default function MovieBrowser() {
  const [movies, setMovies] = useState<MovieWithCast[]>([]);
  const [actors, setActors] = useState<ActorData[]>([]);
  const [selectedActors, setSelectedActors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'year_desc' | 'year_asc' | 'title'>('popularity');
  const searchRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Load all data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/all-data');
        const data = await response.json();
        setMovies(data.movies);
        setActors(data.actors);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Optional year filter from URL
  const selectedYear = useMemo(() => {
    const y = searchParams.get('year');
    return y && /^\\d{4}$/.test(y) ? y : '';
  }, [searchParams]);

  // Initialize selected actors from URL (?actors=A,B)
  useEffect(() => {
    const actorsParam = searchParams.get('actors');
    if (actorsParam && selectedActors.length === 0) {
      const fromUrl = actorsParam
        .split(',')
        .map((s) => decodeURIComponent(s.trim()))
        .filter(Boolean);
      if (fromUrl.length) setSelectedActors(Array.from(new Set(fromUrl)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep URL in sync when selection changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (selectedActors.length > 0) {
      params.set('actors', selectedActors.map(encodeURIComponent).join(','));
    } else {
      params.delete('actors');
    }
    // keep year param if present
    if (selectedYear) params.set('year', selectedYear); else params.delete('year');
    router.replace(`/browse?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedActors, selectedYear]);

  // Close suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter actors based on search query
  const filteredActors = useMemo(() => {
    if (!searchQuery) return [];
    
    const query = searchQuery.toLowerCase();
    return actors
      .filter(actor => 
        actor.name.toLowerCase().includes(query) &&
        !selectedActors.includes(actor.name)
      )
      .sort((a, b) => b.movieIds.length - a.movieIds.length) // Sort by movie count descending
      .slice(0, 10); // Show max 10 suggestions
  }, [searchQuery, actors, selectedActors]);

  // Filter movies based on selected actors (AND logic)

  const filteredMovies = useMemo(() => {
    let list = movies;
    if (selectedActors.length > 0) {
      list = list.filter(movie => {
        return selectedActors.every(actorName => {
          const actor = actors.find(a => a.name === actorName);
          return actor && actor.movieIds.includes(movie.id);
        });
      });
    }
    if (selectedYear) {
      list = list.filter(m => (m.release_date || '').startsWith(selectedYear));
    }
    return list;
  }, [movies, selectedActors, actors, selectedYear]);

  const sortedMovies = useMemo(() => {
    const arr = [...filteredMovies];
    switch (sortBy) {
      case 'rating':
        arr.sort((a: any, b: any) => (b.vote_average - a.vote_average) || (b.vote_count - a.vote_count));
        break;
      case 'year_desc':
        arr.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));
        break;
      case 'year_asc':
        arr.sort((a, b) => (a.release_date || '').localeCompare(b.release_date || ''));
        break;
      case 'title':
        arr.sort((a: any, b: any) => (a.original_title || a.title).localeCompare(b.original_title || b.title));
        break;
      default: // popularity
        arr.sort((a: any, b: any) => (b.popularity - a.popularity));
    }
    return arr;
  }, [filteredMovies, sortBy]);

  const handleSelectActor = (actorName: string) => {
    setSelectedActors(prev => [...prev, actorName]);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleRemoveActor = (actorName: string) => {
    setSelectedActors(prev => prev.filter(name => name !== actorName));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-neutral-300">Učitavanje filmova i glumaca...</p>
          <p className="text-sm text-neutral-500 mt-2">Ovo može potrajati do jednog minuta</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Search Section */}
      <div className="mb-8">
        <p className="text-sm text-neutral-400 mb-2">Unesi jedno ili više glumačkih imena da vidiš filmove</p>
        <div ref={searchRef} className="relative max-w-2xl">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Pretraži glumce i glumice..."
            className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder-neutral-500"
          />
          
          {/* Autocomplete suggestions */}
          {showSuggestions && filteredActors.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredActors.map((actor) => (
                <button
                  key={actor.name}
                  onClick={() => handleSelectActor(actor.name)}
                  className="w-full px-4 py-2 text-left hover:bg-neutral-700 transition-colors"
                >
                  <div className="font-medium text-neutral-100">{actor.name}</div>
                  <div className="text-sm text-neutral-400">{actor.movieIds.length} filmova</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected actors */}
        {(selectedActors.length > 0 || selectedYear) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedYear && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 rounded-full">
                Godina: <strong>{selectedYear}</strong>
              </span>
            )}
            {selectedActors.map((actorName) => (
              <button
                key={actorName}
                onClick={() => handleRemoveActor(actorName)}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 rounded-full hover:bg-yellow-500/30 transition-colors"
              >
                <span className="font-medium">{actorName}</span>
                <span className="text-yellow-400">×</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="mb-4 text-neutral-300 flex items-center justify-between gap-4">
        <div>
          {selectedActors.length > 0 ? (
            <p>
              Pronađeno <strong className="text-yellow-500">{filteredMovies.length}</strong> filmova sa{' '}
              <strong className="text-yellow-500">{selectedActors.join(', ')}</strong>
            </p>
          ) : (
            <p>Ukupno <strong className="text-yellow-500">{movies.length}</strong> filmova</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sortBy" className="text-sm text-neutral-400">Sortiraj:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option value="popularity">Popularnost</option>
            <option value="rating">Ocena</option>
            <option value="year_desc">Godina (najnovije)</option>
            <option value="year_asc">Godina (najstarije)</option>
            <option value="title">Naslov (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Movie grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {sortedMovies.map((movie, index) => (
          <MovieCard key={`${movie.id}-${index}`} movie={movie} />
        ))}
      </div>

      {filteredMovies.length === 0 && selectedActors.length > 0 && (
        <div className="text-center py-16 text-neutral-400">
          <p className="text-lg">Nema filmova sa svim izabranim glumcima.</p>
          <p className="text-sm mt-2">Probajte da uklonite nekog glumca.</p>
        </div>
      )}
    </div>
  );
}
