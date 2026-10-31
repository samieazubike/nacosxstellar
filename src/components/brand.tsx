import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export function StarMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z"
        fill="currentColor"
      />
    </svg>
  )
}

// The NACOS and Stellar logos are white artwork: only place them on the
// dark green surfaces.
export function BrandLockup({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="NACOS × Stellar Builders Program home"
      className={cn('flex items-center gap-2.5 sm:gap-3', className)}
    >
      <img src="/nacos.svg" alt="" className="h-8 w-auto sm:h-10" />
      <span aria-hidden="true" className="text-lg font-semibold text-lime">
        ×
      </span>
      <img src="/stellar.png" alt="" className="h-6 w-auto sm:h-7" />
    </Link>
  )
}

export function NxylyMark({ className }: { className?: string }) {
  return <img src="/nxyly.png" alt="" className={cn('size-6', className)} />
}

export const ctaPrimary =
  'inline-flex h-12 items-center justify-center gap-2 rounded-full bg-lime px-6 text-sm font-semibold text-ink shadow-[0_8px_30px_-8px] shadow-lime/50 transition hover:brightness-105 active:translate-y-px focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-lime/50'

export const ctaSecondary =
  'inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-sm font-semibold text-foreground transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-lime/50'
