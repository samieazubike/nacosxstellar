import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, ExternalLink, LoaderCircle } from 'lucide-react'
import { useEffect, useLayoutEffect, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { BrandLockup, NxylyMark } from '@/components/brand'
import { ParticipantAvatar } from '@/components/participant-avatar'
import { PhotoPicker } from '@/components/register/photo-picker'
import { SchoolPicker } from '@/components/register/school-picker'
import type { SchoolValue } from '@/components/register/school-picker'
import { fieldInput } from '@/components/register/styles'
import { RegistrationSuccess } from '@/components/register/success'
import { Checkbox } from '@/components/ui/checkbox'
import { useCountUp } from '@/hooks/use-count-up'
import {
  ApiError,
  EMPTY_STATS,
  NXYLY_SIGNUP_URL,
  optionsQuery,
  register,
  statsQuery,
} from '@/lib/api'
import type { RegistrationResult } from '@/lib/api'
import { fillAvatarSlots } from '@/lib/avatars'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/register')({
  head: () => ({
    meta: [{ title: 'Register | NACOS × Stellar Builders Program' }],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(optionsQuery),
      context.queryClient.ensureQueryData(statsQuery),
    ]).catch(() => null),
  component: RegisterPage,
})

const STORAGE_KEY = 'nxs-registration'

type Values = {
  full_name: string
  email: string
  phone: string
  zone_id: number | null
  school: SchoolValue
  nxyly_username: string
  photo: File | null
  consent: boolean
}

const EMPTY: Values = {
  full_name: '',
  email: '',
  phone: '',
  zone_id: null,
  school: null,
  nxyly_username: '',
  photo: null,
  consent: false,
}

// Same normalisation as the portal, so client and server agree on "valid".
function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('0'))
    return `234${digits.slice(1)}`
  if (digits.length === 10 && !digits.startsWith('0')) return `234${digits}`
  return digits
}

function validate(v: Values): Record<string, string> {
  const errors: Record<string, string> = {}
  if (v.full_name.trim().split(/\s+/).length < 2)
    errors.full_name = 'Enter your first and last name.'
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim()))
    errors.email = 'Enter a valid email address.'
  if (!/^234\d{10}$/.test(normalizePhone(v.phone)))
    errors.phone = 'Enter a valid Nigerian phone number, e.g. 0803 123 4567.'
  if (!v.zone_id) errors.zone_id = 'Select your NACOS zone.'
  if (
    !v.school ||
    (v.school.kind === 'other' && v.school.name.trim().length < 3)
  )
    errors.school = 'Select your institution, or tell us its name.'
  if (!/^[A-Za-z0-9_.-]{2,40}$/.test(v.nxyly_username.trim().replace(/^@/, '')))
    errors.nxyly_username = 'Enter your Nyxly.io username.'
  if (!v.photo) errors.photo = 'Add a profile picture.'
  return errors
}

const FIELD_ORDER = [
  'full_name',
  'email',
  'phone',
  'zone_id',
  'school',
  'nxyly_username',
  'photo',
]

function RegisterPage() {
  const queryClient = useQueryClient()
  const { data: options, isLoading: optionsLoading } = useQuery(optionsQuery)
  const { data: stats = EMPTY_STATS } = useQuery(statsQuery)
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [result, setResult] = useState<RegistrationResult | null>(null)
  const [hydrated, setHydrated] = useState(false)

  // On slow connections students start typing into the server-rendered form
  // before React hydrates; keep what they typed instead of wiping it.
  useLayoutEffect(() => {
    const typed = (id: string) =>
      (document.getElementById(id) as HTMLInputElement | null)?.value ?? ''
    setValues((v) => ({
      ...v,
      full_name: v.full_name || typed('full_name'),
      email: v.email || typed('email'),
      phone: v.phone || typed('phone'),
      nxyly_username: v.nxyly_username || typed('nxyly_username'),
    }))
    setHydrated(true)
  }, [])

  // Bring back the success screen (and its WhatsApp link) after a refresh.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setResult(JSON.parse(saved))
    } catch {
      // Storage may be unavailable (private mode); the form still works.
    }
  }, [])

  const mutation = useMutation({
    mutationFn: (form: FormData) => register(form),
    onSuccess: (data) => {
      setResult(data)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      } catch {
        // Not critical.
      }
      queryClient.invalidateQueries({ queryKey: ['stellar'] })
      window.scrollTo({ top: 0 })
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        const fieldErrors = { ...error.fieldErrors }
        const { school_id, school_name_other } = error.fieldErrors as Partial<
          Record<string, string>
        >
        const schoolError = school_id ?? school_name_other
        if (schoolError) fieldErrors.school = schoolError
        setErrors(fieldErrors)
        focusFirstError(fieldErrors)
      }
    },
  })

  const set = <TKey extends keyof Values>(key: TKey, value: Values[TKey]) => {
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key]) setErrors(({ [key]: _, ...rest }) => rest)
  }

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) return focusFirstError(found)

    const form = new FormData()
    form.set('full_name', values.full_name.trim())
    form.set('email', values.email.trim())
    form.set('phone', values.phone)
    form.set('zone_id', String(values.zone_id))
    if (values.school?.kind === 'listed')
      form.set('school_id', String(values.school.school.id))
    if (values.school?.kind === 'other')
      form.set('school_name_other', values.school.name.trim())
    form.set('nxyly_username', values.nxyly_username.trim())
    form.set('photo', values.photo as File)
    form.set('consent', values.consent ? '1' : '0')
    const honeypot = new FormData(e.currentTarget).get('website')
    if (honeypot) form.set('website', String(honeypot))
    mutation.mutate(form)
  }

  const zoneCounts = new Map(stats.zones.map((z) => [z.id, z.count]))
  const generalError =
    mutation.error &&
    !(
      mutation.error instanceof ApiError &&
      Object.keys(mutation.error.fieldErrors).length
    )
      ? mutation.error.message
      : null

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <BrandLockup />
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-4 pb-16 sm:px-6 sm:pt-8">
        {result ? (
          <RegistrationSuccess
            result={result}
            onRegisterAnother={() => {
              try {
                localStorage.removeItem(STORAGE_KEY)
              } catch {
                // Ignore.
              }
              setResult(null)
              setValues(EMPTY)
              mutation.reset()
            }}
          />
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <Pitch total={stats.total} recent={stats.recent} />

            <form
              onSubmit={submit}
              noValidate
              className="rounded-[1.75rem] bg-white/[0.04] p-5 ring-1 ring-white/10 sm:p-8"
            >
              <h2 className="text-2xl font-semibold">Quick registration</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                7 quick fields. Free for all NACOS students.
              </p>

              <div className="mt-7 space-y-5">
                <Field
                  id="full_name"
                  label="Full name"
                  error={errors.full_name}
                >
                  <input
                    id="full_name"
                    className={fieldInput}
                    autoComplete="name"
                    placeholder="e.g. Adaeze Okafor"
                    value={values.full_name}
                    aria-invalid={!!errors.full_name || undefined}
                    onChange={(e) => set('full_name', e.target.value)}
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="email" label="Email address" error={errors.email}>
                    <input
                      id="email"
                      type="email"
                      inputMode="email"
                      className={fieldInput}
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={values.email}
                      aria-invalid={!!errors.email || undefined}
                      onChange={(e) => set('email', e.target.value)}
                    />
                  </Field>
                  <Field id="phone" label="Phone number" error={errors.phone}>
                    <input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      className={fieldInput}
                      autoComplete="tel"
                      placeholder="0803 123 4567"
                      value={values.phone}
                      aria-invalid={!!errors.phone || undefined}
                      onChange={(e) => set('phone', e.target.value)}
                    />
                  </Field>
                </div>

                <Field id="zone_id" label="NACOS zone" error={errors.zone_id}>
                  <div
                    id="zone_id"
                    role="radiogroup"
                    aria-label="NACOS zone"
                    className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                  >
                    {(options?.zones ?? []).map((zone) => {
                      const selected = values.zone_id === zone.id
                      const count = zoneCounts.get(zone.id) ?? 0
                      return (
                        <button
                          key={zone.id}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => set('zone_id', zone.id)}
                          className={cn(
                            'rounded-xl border px-3 py-2.5 text-left transition',
                            selected
                              ? 'border-lime bg-lime text-ink'
                              : 'border-white/15 bg-white/[0.04] hover:border-white/40',
                          )}
                        >
                          <span className="block text-sm font-semibold">
                            {zone.zone}
                          </span>
                          <span
                            className={cn(
                              'block text-xs',
                              selected
                                ? 'text-ink/70'
                                : 'text-muted-foreground',
                            )}
                          >
                            {count.toLocaleString()} joined
                          </span>
                        </button>
                      )
                    })}
                    {optionsLoading && (
                      <p className="col-span-full text-sm text-muted-foreground">
                        Loading zones…
                      </p>
                    )}
                  </div>
                </Field>

                <Field
                  id="school"
                  label="Institution / NACOS chapter"
                  error={errors.school}
                >
                  <SchoolPicker
                    schools={options?.schools ?? []}
                    zoneId={values.zone_id}
                    value={values.school}
                    loading={optionsLoading}
                    invalid={!!errors.school}
                    onChange={(school) => {
                      set('school', school)
                      // Most portal schools have no zone yet; fill it in when they do.
                      if (
                        school?.kind === 'listed' &&
                        school.school.zone_id &&
                        !values.zone_id
                      )
                        set('zone_id', school.school.zone_id)
                    }}
                  />
                </Field>

                <Field
                  id="nxyly_username"
                  label={
                    <span className="flex items-center gap-2">
                      <NxylyMark className="size-5" /> Nyxly.io username
                    </span>
                  }
                  error={errors.nxyly_username}
                  hint={
                    <>
                      You’ll post your learning content on Nyxly.io. No account
                      yet?{' '}
                      <a
                        href={NXYLY_SIGNUP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-lime underline underline-offset-2"
                      >
                        Sign up on Nyxly <ExternalLink className="size-3" />
                      </a>{' '}
                      then come back.
                    </>
                  }
                >
                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground">
                      @
                    </span>
                    <input
                      id="nxyly_username"
                      className={cn(fieldInput, 'pl-9')}
                      autoComplete="username"
                      autoCapitalize="none"
                      spellCheck={false}
                      placeholder="yourusername"
                      value={values.nxyly_username}
                      aria-invalid={!!errors.nxyly_username || undefined}
                      onChange={(e) => set('nxyly_username', e.target.value)}
                    />
                  </div>
                </Field>

                <Field id="photo" label="Profile picture" error={errors.photo}>
                  <PhotoPicker
                    value={values.photo}
                    invalid={!!errors.photo}
                    onChange={(file) => set('photo', file)}
                  />
                </Field>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-white/[0.04] p-3.5 text-sm ring-1 ring-white/10">
                  <Checkbox
                    id="consent"
                    checked={values.consent}
                    onCheckedChange={(checked) => set('consent', checked)}
                    className="mt-0.5 size-5"
                  />
                  <span className="text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Show me on the Builders wall
                    </span>{' '}
                    (optional). I agree that my photo, first name and
                    institution may be shown publicly on this site. Leave this
                    unticked to stay off the wall. Your email and phone number
                    are always private.
                  </span>
                </label>

                {/* Honeypot: invisible to people, tempting to bots. */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />

                {generalError && (
                  <p
                    role="alert"
                    className="rounded-xl bg-destructive/15 p-3 text-sm text-destructive"
                  >
                    {generalError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!hydrated || mutation.isPending}
                  className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-lime text-base font-semibold text-ink shadow-lg shadow-lime/20 transition hover:brightness-105 disabled:opacity-70"
                >
                  {mutation.isPending ? (
                    <>
                      <LoaderCircle className="size-5 animate-spin" />{' '}
                      Registering…
                    </>
                  ) : (
                    <>
                      Complete registration <ArrowRight className="size-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}

function focusFirstError(errors: Record<string, string>) {
  const first = FIELD_ORDER.find((f) => errors[f])
  if (!first) return
  const el = document.getElementById(first)
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  if (el instanceof HTMLInputElement && el.type !== 'file')
    el.focus({ preventScroll: true })
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string
  label: ReactNode
  error?: string
  hint?: ReactNode
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="mt-2 text-sm text-muted-foreground">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

function Pitch({
  total,
  recent,
}: {
  total: number
  recent: typeof EMPTY_STATS.recent
}) {
  const count = useCountUp(total)
  const slots = fillAvatarSlots(recent, 6)

  return (
    <aside className="lg:sticky lg:top-8 lg:self-start">
      <p className="text-sm font-semibold tracking-wide text-lime uppercase">
        NACOS × Stellar Builders Program
      </p>
      <h1 className="mt-3 text-4xl leading-tight font-semibold sm:text-5xl">
        Your first step into the <em className="text-lime">Stellar</em>{' '}
        ecosystem.
      </h1>
      <div className="mt-6 flex items-center gap-4">
        <div className="flex -space-x-3">
          {slots.map((slot) => (
            <ParticipantAvatar
              key={slot.key}
              slot={slot}
              className="size-10 ring-background"
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          {total > 0 ? (
            <>
              Join{' '}
              <strong className="text-foreground">
                {count.toLocaleString()}
              </strong>{' '}
              {total === 1 ? 'student' : 'students'} already building
            </>
          ) : (
            'Be among the very first builders'
          )}
        </p>
      </div>
      <ol className="mt-8 hidden space-y-4 lg:block">
        {[
          ['Register in 2 minutes', 'Your details, your chapter and a photo.'],
          [
            'Join the WhatsApp community',
            'Get session links, resources and updates.',
          ],
          ['Learn, build and share on Nyxly', 'Post what you learn as you go.'],
        ].map(([title, body], i) => (
          <li key={title} className="flex gap-4">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 font-heading text-sm font-semibold text-lime">
              {i + 1}
            </span>
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-muted-foreground">{body}</p>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  )
}
