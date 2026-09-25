/**
 * Base fetch wrapper for the existing FastAPI backend.
 * Backend is untouched — this file only documents/consumes it.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ??   "https://novanexus-sih26106-emailthreatforensics-qv30.onrender.com";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    throw new ApiError(res.status, await res.text());
  }
  return res.json() as Promise<T>;
}
