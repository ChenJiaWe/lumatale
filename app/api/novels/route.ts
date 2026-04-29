import { NextResponse } from 'next/server';
import { listNovels } from '@/lib/services/novel-service';
import { toErrorResponse } from '@/lib/api/error-response';

export const revalidate = 3600;

export async function GET() {
  try {
    const novels = await listNovels();
    return NextResponse.json(
      { novels },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
    );
  } catch (error) {
    return toErrorResponse(error, 'GET /api/novels');
  }
}
