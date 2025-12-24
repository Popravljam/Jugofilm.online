import { NextResponse } from 'next/server';
import { getMoviesWithCast, getAllActors } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const movies = getMoviesWithCast();
    const allActors = getAllActors();
    
    // Transform actors to match expected format
    const actors = allActors.map(a => ({
      name: a.name,
      movieIds: [] as number[] // We'll populate this from movies
    }));
    
    // Build actor -> movieIds mapping
    const actorMoviesMap = new Map<string, number[]>();
    for (const movie of movies) {
      if (movie.cast && Array.isArray(movie.cast)) {
        for (const castMember of movie.cast) {
          if (!actorMoviesMap.has(castMember.name)) {
            actorMoviesMap.set(castMember.name, []);
          }
          actorMoviesMap.get(castMember.name)!.push(movie.id);
        }
      }
    }
    
    // Update actors with movieIds
    for (const actor of actors) {
      actor.movieIds = actorMoviesMap.get(actor.name) || [];
    }
    
    return NextResponse.json({
      movies,
      actors,
      lastFetch: Date.now()
    });
  } catch (error) {
    console.error('Error fetching all data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
