import { NextResponse } from 'next/server';
import { getReadingForNovel } from '@/lib/services/novel-service';

export const revalidate = 3600;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const reading = await getReadingForNovel(slug);
    if (!reading) {
      return NextResponse.json({ error: 'novel_not_found', slug }, { status: 404 });
    }
    return NextResponse.json(
      { novel: reading.novel, scenes: reading.scenes },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
