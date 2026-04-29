import { NextResponse } from 'next/server';
import { DomainError } from '@/lib/errors';
import { logger } from '@/lib/logger';

/**
 * Convert any thrown value into a safe JSON Response. DomainError
 * passes through with its declared status + code; anything else
 * collapses to a 500 with a generic message — internal details go
 * to the logger, never to the client.
 */
export function toErrorResponse(error: unknown, route: string): NextResponse {
  if (error instanceof DomainError) {
    return NextResponse.json(
      { error: error.code, message: error.message },
      { status: error.status }
    );
  }
  const message = error instanceof Error ? error.message : String(error);
  logger.error('api.unhandled_error', { route, message });
  return NextResponse.json(
    { error: 'internal_error', message: 'Something went wrong.' },
    { status: 500 }
  );
}
