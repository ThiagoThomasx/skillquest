// Base API client — swap implementation for Supabase / REST later
// All services import from here so the transport layer is centralized.

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Simulate network latency in dev (set to 0 in production)
const MOCK_DELAY_MS = process.env.NODE_ENV === "development" ? 300 : 0;

export async function mockFetch<T>(data: T, delayMs = MOCK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), delayMs));
}
