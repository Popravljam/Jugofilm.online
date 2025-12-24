import { NextRequest, NextResponse } from 'next/server';
import { getMovieFullById } from '@/lib/queries';

export const runtime = 'nodejs';

export async function GET(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await ctx.params;
  const id = Number(idStr);
  if (!Number.isFinite(id)) return NextResponse.json({ error: 'invalid id' }, { status: 400 });
  const movie = getMovieFullById(id);
  if (!movie) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(movie);
}
