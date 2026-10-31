import { queryOptions } from '@tanstack/react-query'

// Public endpoints live on the NACOS portal (Laravel), under /api/v1/stellar.
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1/stellar'
).replace(/\/$/, '')

export const NXYLY_SIGNUP_URL =
  import.meta.env.VITE_NXYLY_SIGNUP_URL ?? 'https://nyxly.io'

export type Zone = { id: number; zone: string; code: string }
export type School = {
  id: number
  name: string
  state: string
  zone_id: number | null
}
export type ZoneStat = Zone & { count: number }
export type Participant = {
  id: string
  name: string
  school: string | null
  zone: string | null
  photo_url: string
  joined_at: string
}
export type Stats = {
  total: number
  schools_count: number
  zones_count: number
  zones: Array<ZoneStat>
  top_schools: Array<{ name: string; count: number }>
  recent: Array<Participant>
}
export type RegistrationResult = {
  ticket_code: string
  full_name: string
  photo_url: string
  // Optional for success screens saved before this field existed.
  photo_public?: boolean
  whatsapp_url: string | null
}

export const EMPTY_STATS: Stats = {
  total: 0,
  schools_count: 0,
  zones_count: 0,
  zones: [],
  top_schools: [],
  recent: [],
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public fieldErrors: Record<string, string> = {},
  ) {
    super(message)
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { Accept: 'application/json', ...init?.headers },
  })
  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    // Laravel validation: { message, errors: { field: [msg, ...] } }
    const fieldErrors = Object.fromEntries(
      Object.entries(
        (body.errors ?? {}) as Record<string, Array<string> | string>,
      ).map(([field, messages]) => [
        field,
        Array.isArray(messages) ? messages[0] : messages,
      ]),
    )
    const message =
      response.status === 429
        ? 'Too many attempts. Please wait a minute and try again.'
        : (body.message ?? 'Something went wrong. Please try again.')
    throw new ApiError(message, response.status, fieldErrors)
  }

  return body as T
}

export const statsQuery = queryOptions({
  queryKey: ['stellar', 'stats'],
  queryFn: () => request<{ data: Stats }>('/stats').then((r) => r.data),
  // Polling keeps the counter, zone race and avatars feeling live.
  refetchInterval: 20_000,
  staleTime: 10_000,
})

export const optionsQuery = queryOptions({
  queryKey: ['stellar', 'options'],
  queryFn: () =>
    request<{ data: { zones: Array<Zone>; schools: Array<School> } }>(
      '/options',
    ).then((r) => r.data),
  staleTime: 60 * 60 * 1000,
})

// Latest visible participants for the scrolling Builders wall.
export const latestParticipantsQuery = queryOptions({
  queryKey: ['stellar', 'participants', 'latest'],
  queryFn: () =>
    request<{ data: Array<Participant> }>('/participants').then((r) => r.data),
  refetchInterval: 30_000,
})

export async function register(form: FormData): Promise<RegistrationResult> {
  const body = await request<{
    data: Omit<RegistrationResult, 'whatsapp_url'>
    whatsapp_url: string | null
  }>('/registrations', { method: 'POST', body: form })

  return { ...body.data, whatsapp_url: body.whatsapp_url }
}
