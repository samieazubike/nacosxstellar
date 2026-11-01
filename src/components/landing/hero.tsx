import { Link } from '@tanstack/react-router'
import { ArrowRight, Clock3, ShieldCheck, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ctaPrimary, ctaSecondary } from '@/components/brand'
import { ParticipantAvatar } from '@/components/participant-avatar'
import { useCountUp } from '@/hooks/use-count-up'
import type { Stats } from '@/lib/api'
import { fillAvatarSlots } from '@/lib/avatars'

export function Hero({ stats }: { stats: Stats }) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] size-[640px] rounded-full bg-lime/10 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-10 pb-16 sm:px-6 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:pb-24">
        <div className="animate-rise">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-mint ring-1 ring-white/15">
            <span className="size-1.5 rounded-full bg-lime" />
            Powered by Stellar · Organised by NACOS National
          </p>
          <h1 className="mt-5 text-[2.6rem] leading-[1.05] font-semibold sm:text-6xl">
            Beyond Trading.{' '}
            <em className="font-medium text-lime">Start Building</em> on
            Blockchain.
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            The NACOS Blockchain Innovation and Builders Program. Discover the
            Stellar ecosystem, learn how blockchain really works, build
            real-world solutions and find your place in the Web3 economy.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className={ctaPrimary}>
              Register now — it's free
              <ArrowRight className="size-4" />
            </Link>
            <a href="#explore" className={ctaSecondary}>
              What you'll explore
            </a>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <Clock3 className="size-4 text-lime" /> Takes under 2 minutes
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-lime" /> Open to all NACOS
              students
            </li>
          </ul>
        </div>

        <LiveCards stats={stats} />
      </div>
    </section>
  )
}

function LiveCards({ stats }: { stats: Stats }) {
  const total = useCountUp(stats.total)
  const slots = fillAvatarSlots(stats.recent, 7)
  const extra = Math.max(0, stats.total - stats.recent.slice(0, 7).length)

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="grid gap-4 sm:grid-cols-[0.8fr_1fr] sm:items-start">
        <ZoneRaceCard stats={stats} />

        <div className="animate-float rounded-3xl bg-card p-5 text-card-foreground shadow-2xl shadow-black/30 max-sm:order-first sm:row-span-2 sm:mt-10">
          <div className="flex items-center justify-between">
            <p className="font-heading text-lg font-semibold">
              Builders joined
            </p>
            <span className="flex items-center gap-1.5 rounded-full bg-ink/5 px-2 py-1 text-[11px] font-semibold text-ink/70">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              LIVE
            </span>
          </div>
          <p
            className="mt-3 font-heading text-6xl font-semibold tabular-nums"
            aria-live="polite"
          >
            {total.toLocaleString()}
          </p>
          <p className="text-sm text-ink/60">
            {stats.total === 1 ? 'student' : 'students'} from{' '}
            <strong className="text-ink">{stats.schools_count}</strong>{' '}
            {stats.schools_count === 1 ? 'institution' : 'institutions'} across{' '}
            <strong className="text-ink">{stats.zones_count}</strong>{' '}
            {stats.zones_count === 1 ? 'zone' : 'zones'}
          </p>
          <div className="mt-5 flex items-center">
            <div className="flex -space-x-3">
              {slots.map((slot) => (
                <ParticipantAvatar
                  key={slot.key}
                  slot={slot}
                  className="size-11"
                />
              ))}
            </div>
            {extra > 0 && (
              <span className="-ml-3 grid size-11 place-items-center rounded-full bg-ink text-xs font-semibold text-lime ring-2 ring-white">
                +{extra > 999 ? `${Math.floor(extra / 1000)}k` : extra}
              </span>
            )}
          </div>
          <Link
            to="/register"
            className="mt-5 flex items-center justify-between rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink/90"
          >
            Add your face to the wall
            <ArrowRight className="size-4 text-lime" />
          </Link>
        </div>

        <JustJoinedCard stats={stats} />
      </div>
    </div>
  )
}

function ZoneRaceCard({ stats }: { stats: Stats }) {
  const zones = [...stats.zones].sort((a, b) => a.code.localeCompare(b.code))
  const max = Math.max(1, ...zones.map((z) => z.count))
  const leader = stats.zones[0]?.count ? stats.zones[0] : null

  return (
    <div className="rounded-3xl bg-lime p-5 text-ink shadow-xl shadow-black/20">
      <div className="flex items-center justify-between">
        <p className="font-heading font-semibold">Zone race</p>
        <Trophy className="size-4" />
      </div>
      <p className="text-xs text-ink/70">
        {leader ? `${leader.zone} is leading` : 'Every zone starts at zero'}
      </p>
      <div className="mt-4 flex h-24 items-end gap-1.5" aria-hidden="true">
        {(zones.length ? zones : Array.from({ length: 6 }, () => null)).map(
          (zone, i) => (
            <div
              key={zone?.code ?? i}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <div
                className={`w-full rounded-md transition-[height] duration-700 ${
                  zone && leader && zone.code === leader.code
                    ? 'bg-ink'
                    : 'bg-ink/30'
                }`}
                style={{
                  height: `${Math.max(10, ((zone?.count ?? 0) / max) * 80)}px`,
                }}
              />
              <span className="text-[10px] font-semibold">
                {zone?.code ?? '—'}
              </span>
            </div>
          ),
        )}
      </div>
      <a
        href="#zones"
        className="mt-3 inline-block text-xs font-semibold underline underline-offset-2"
      >
        See the full leaderboard
      </a>
    </div>
  )
}

function JustJoinedCard({ stats }: { stats: Stats }) {
  const [index, setIndex] = useState(0)
  const recent = stats.recent

  useEffect(() => {
    if (recent.length < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % recent.length), 3500)
    return () => clearInterval(id)
  }, [recent.length])

  const person = recent[index % Math.max(1, recent.length)] as
    (typeof recent)[number] | undefined
  const [slot] = fillAvatarSlots(person ? [person] : [], 1)

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-card p-3 pr-4 text-card-foreground shadow-xl shadow-black/20 sm:-mt-2">
      <ParticipantAvatar slot={slot} className="size-10 ring-0" />
      <div key={person?.id ?? 'empty'} className="animate-rise min-w-0 text-sm">
        {person ? (
          <>
            <p className="truncate font-semibold">{person.name} just joined</p>
            <p className="truncate text-xs text-ink/60">{person.school}</p>
          </>
        ) : (
          <>
            <p className="font-semibold">Be the first from your chapter</p>
            <p className="text-xs text-ink/60">Your photo goes right here</p>
          </>
        )}
      </div>
    </div>
  )
}
