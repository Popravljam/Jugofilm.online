import { NextRequest, NextResponse } from 'next/server';
import { getSimilarByCast } from '@/lib/queries';

export const runtime = 'nodejs';

export async function GET(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await ctx.params;
  const id = Number(idStr);
  if (!Number.isFinite(id)) return NextResponse.json({ error: 'invalid id' }, { status: 400 });
  const rows = getSimilarByCast(id, 12);
  return NextResponse.json({ similar: rows });
}
