import { Link } from '@tanstack/react-router'
import { Crown, Medal } from 'lucide-react'
import { useCountUp } from '@/hooks/use-count-up'
import type { Stats } from '@/lib/api'
import { cn } from '@/lib/utils'

export function ZoneRace({ stats }: { stats: Stats }) {
  const max = Math.max(1, ...stats.zones.map((z) => z.count))

  return (
    <section id="zones" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-sm font-semibold tracking-wide text-lime uppercase">
          The zone race
        </p>
        <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <h2 className="max-w-2xl text-3xl font-semibold sm:text-5xl">
            Which zone is <em className="text-lime">building</em> the most?
          </h2>
          <p className="max-w-sm text-muted-foreground">
            Every registration counts for your zone and your chapter. Get your
            coursemates in and climb the board.
          </p>
        </div>

        <dl className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
          <StatTile label="Registered students" value={stats.total} />
          <StatTile label="Institutions" value={stats.schools_count} />
          <StatTile
            label="Zones"
            value={stats.zones_count}
            suffix={stats.zones.length ? ` / ${stats.zones.length}` : ''}
          />
        </dl>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-3xl bg-white/[0.04] p-5 ring-1 ring-white/10 sm:p-7">
            <h3 className="text-xl font-semibold">Zone leaderboard</h3>
            <ol className="mt-6 space-y-4">
              {stats.zones.map((zone, i) => (
                <li
                  key={zone.code}
                  className="grid grid-cols-[1.75rem_1fr_auto] items-center gap-3"
                >
                  <span
                    className={cn(
                      'grid size-7 place-items-center rounded-full text-xs font-bold',
                      i === 0 && zone.count > 0
                        ? 'bg-lime text-ink'
                        : 'bg-white/10',
                    )}
                  >
                    {i === 0 && zone.count > 0 ? (
                      <Crown className="size-3.5" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{zone.zone}</p>
                    <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={cn(
                          'h-full rounded-full transition-[width] duration-700',
                          i === 0 ? 'bg-lime' : 'bg-lime/50',
                        )}
                        style={{ width: `${(zone.count / max) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-12 text-right font-heading text-lg font-semibold tabular-nums">
                    {zone.count.toLocaleString()}
                  </span>
                </li>
              ))}
            </ol>
            {stats.zones.length === 0 && (
              <p className="text-muted-foreground">
                Live standings load shortly.
              </p>
            )}
          </div>

          <div className="rounded-3xl bg-card p-5 text-card-foreground sm:p-7">
            <h3 className="text-xl font-semibold">Top institutions</h3>
            {stats.top_schools.length > 0 ? (
              <ol className="mt-5 divide-y divide-ink/10">
                {stats.top_schools.map((school, i) => (
                  <li
                    key={school.name}
                    className="flex items-center gap-3 py-2.5"
                  >
                    <span className="w-6 text-center font-heading font-semibold text-ink/50">
                      {i < 3 ? (
                        <Medal
                          className={cn(
                            'mx-auto size-5',
                            [
                              'text-amber-500',
                              'text-slate-400',
                              'text-orange-700',
                            ][i],
                          )}
                        />
                      ) : (
                        i + 1
                      )}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {school.name}
                    </span>
                    <span className="rounded-full bg-ink/5 px-2.5 py-0.5 text-sm font-semibold tabular-nums">
                      {school.count}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="mt-5 rounded-2xl bg-mint p-5">
                <p className="font-semibold">
                  No institution on the board yet.
                </p>
                <p className="mt-1 text-sm text-ink/65">
                  Register first and put your chapter at number one.
                </p>
                <Link
                  to="/register"
                  className="mt-4 inline-flex h-10 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white"
                >
                  Claim the top spot
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function StatTile({
  label,
  value,
  suffix = '',
}: {
  label: string
  value: number
  suffix?: string
}) {
  const count = useCountUp(value)

  return (
    <div className="rounded-3xl bg-white/[0.04] p-4 ring-1 ring-white/10 sm:p-6">
      <dt className="text-xs text-muted-foreground sm:text-sm">{label}</dt>
      <dd className="mt-1 font-heading text-3xl font-semibold tabular-nums sm:text-5xl">
        {count.toLocaleString()}
        <span className="text-lg text-muted-foreground sm:text-2xl">
          {suffix}
        </span>
      </dd>
    </div>
  )
}
