import { NextRequest, NextResponse } from 'next/server';
import { getMoviesWithCast, getMoviesByActors } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const actorsParam = searchParams.get('actors');
    
    let movies;
    
    if (actorsParam) {
      // Filter by actors
      const actorNames = actorsParam.split(',').map(a => a.trim()).filter(Boolean);
      movies = getMoviesByActors(actorNames);
    } else {
      // Get all movies
      movies = getMoviesWithCast();
    }
    
    return NextResponse.json({ movies });
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}
