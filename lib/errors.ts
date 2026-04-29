/**
 * Domain errors. The API layer maps these to safe HTTP responses
 * without leaking internal details (DB error codes, query text, …).
 */
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string) {
    super(`${resource} not found`, 'not_found', 404);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'validation_error', 400);
    this.name = 'ValidationError';
  }
}

export class RepositoryError extends DomainError {
  constructor(operation: string) {
    super(`${operation} failed`, 'repository_error', 500);
    this.name = 'RepositoryError';
  }
}
