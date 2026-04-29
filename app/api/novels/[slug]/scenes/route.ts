import { NextResponse } from 'next/server';
import { getReadingForNovel } from '@/lib/services/novel-service';
import { NotFoundError } from '@/lib/errors';
import { toErrorResponse } from '@/lib/api/error-response';

export const revalidate = 3600;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const reading = await getReadingForNovel(slug);
    if (!reading) throw new NotFoundError('novel');
    return NextResponse.json(
      { novel: reading.novel, scenes: reading.scenes },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
    );
  } catch (error) {
    return toErrorResponse(error, 'GET /api/novels/[slug]/scenes');
  }
}
