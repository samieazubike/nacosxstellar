import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { Participant } from '@/lib/api'
import { latestParticipantsQuery } from '@/lib/api'
import { PLACEHOLDER_AVATARS } from '@/lib/avatars'
import { cn } from '@/lib/utils'

const MIN_TILES = 12
const SECONDS_PER_CARD = 3.5

export function BuildersWall() {
  const { data: participants = [] } = useQuery(latestParticipantsQuery)
  // Until the wall fills up, 3D placeholders invite students to take a spot.
  const openSpots = PLACEHOLDER_AVATARS.slice(
    0,
    Math.max(0, MIN_TILES - participants.length),
  )
  const cardCount = participants.length + openSpots.length

  return (
    <section id="builders" className="scroll-mt-20 overflow-hidden bg-forest">
      <div className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <p className="text-sm font-semibold tracking-wide text-lime uppercase">
          The community
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold sm:text-5xl">
          Meet the Builders Joining the Movement.
        </h2>
      </div>

      <div className="marquee mt-10 pb-20 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        {/* Two identical copies slide left by half the track for a seamless
            loop; the second is decorative only. */}
        <div
          className="animate-marquee flex w-max hover:[animation-play-state:paused] has-[:focus-visible]:[animation-play-state:paused]"
          style={
            {
              '--marquee-duration': `${cardCount * SECONDS_PER_CARD}s`,
            } as CSSProperties
          }
        >
          <CardRow participants={participants} openSpots={openSpots} />
          <CardRow participants={participants} openSpots={openSpots} clone />
        </div>
      </div>
    </section>
  )
}

function CardRow({
  participants,
  openSpots,
  clone = false,
}: {
  participants: Array<Participant>
  openSpots: Array<string>
  clone?: boolean
}) {
  return (
    <ul
      aria-hidden={clone || undefined}
      className={cn(
        'flex shrink-0 gap-3 pr-3 sm:gap-4 sm:pr-4',
        clone && 'marquee-clone',
      )}
    >
      {participants.map((p) => (
        <li
          key={p.id}
          className="w-40 shrink-0 snap-start overflow-hidden rounded-3xl bg-card text-card-foreground sm:w-52"
        >
          <img
            src={p.photo_url}
            alt={clone ? '' : `${p.name}, ${p.school ?? ''}`}
            loading="lazy"
            decoding="async"
            className="aspect-square w-full bg-mint object-cover"
          />
          <div className="p-3">
            <p className="truncate text-sm font-semibold">{p.name}</p>
            <p className="truncate text-xs text-ink/60">{p.school}</p>
          </div>
        </li>
      ))}
      {openSpots.map((src) => (
        <li key={src} className="w-40 shrink-0 snap-start sm:w-52">
          <Link
            to="/register"
            tabIndex={clone ? -1 : undefined}
            className="group flex h-full flex-col overflow-hidden rounded-3xl border border-dashed border-lime/40 bg-white/[0.03] transition hover:border-lime hover:bg-white/[0.06]"
          >
            <span className="relative grid aspect-square place-items-center bg-gradient-to-b from-lime/15 to-transparent">
              <img
                src={src}
                alt=""
                loading="lazy"
                className="w-3/4 opacity-80 transition group-hover:scale-105 group-hover:opacity-100"
              />
              <span className="absolute right-3 bottom-3 grid size-8 place-items-center rounded-full bg-lime text-ink">
                <Plus className="size-4" />
              </span>
            </span>
            <span className="p-3">
              <span className="block text-sm font-semibold">
                This could be you
              </span>
              <span className="block text-xs text-muted-foreground">
                Register to take this spot
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
