import { NextResponse } from 'next/server';
import { listNovels } from '@/lib/services/novel-service';

export const revalidate = 3600;

export async function GET() {
  try {
    const novels = await listNovels();
    return NextResponse.json(
      { novels },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
