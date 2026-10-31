import { Link } from '@tanstack/react-router'
import { Check, Copy, MessageCircle, Share2 } from 'lucide-react'
import { useState } from 'react'
import { StarMark } from '@/components/brand'
import type { RegistrationResult } from '@/lib/api'

export function RegistrationSuccess({
  result,
  onRegisterAnother,
}: {
  result: RegistrationResult
  onRegisterAnother: () => void
}) {
  const [copied, setCopied] = useState(false)
  const firstName = result.full_name.split(/\s+/)[0]
  const onWall = result.photo_public !== false
  const siteUrl = typeof window === 'undefined' ? '' : window.location.origin
  const shareText = `I just joined the NACOS × Stellar Builders Program: learning, building and earning on blockchain. Register in 2 minutes and represent our chapter: ${siteUrl}`

  return (
    <div className="animate-rise mx-auto max-w-lg text-center">
      <div className="relative mx-auto size-28">
        <StarMark className="absolute -top-3 -left-4 size-6 text-lime" />
        <StarMark className="absolute -right-5 top-6 size-4 text-lime/70" />
        <img
          src={result.photo_url}
          alt=""
          className="size-28 rounded-full object-cover ring-4 ring-lime"
        />
        <span className="absolute -right-1 -bottom-1 grid size-9 place-items-center rounded-full bg-lime text-ink ring-4 ring-background">
          <Check className="size-5" strokeWidth={3} />
        </span>
      </div>

      <h1 className="mt-6 text-4xl font-semibold">You’re in, {firstName}!</h1>
      <p className="mt-3 text-muted-foreground">
        Welcome to the NACOS Blockchain Innovation and Builders Program.{' '}
        {onWall
          ? 'Your photo is now on the Builders wall.'
          : 'You chose to stay off the public Builders wall, but you still count for your zone and chapter.'}
      </p>

      <div className="mt-6 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">
          Your registration ID
        </p>
        <div className="mt-1 flex items-center justify-center gap-3">
          <span className="font-mono text-2xl font-semibold tracking-wider text-lime">
            {result.ticket_code}
          </span>
          <button
            type="button"
            aria-label="Copy registration ID"
            onClick={() => {
              navigator.clipboard
                .writeText(result.ticket_code)
                .then(() => setCopied(true))
                .catch(() => {})
            }}
            className="grid size-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
          >
            {copied ? (
              <Check className="size-4 text-lime" />
            ) : (
              <Copy className="size-4" />
            )}
          </button>
        </div>
      </div>

      {result.whatsapp_url && (
        <div className="mt-6 rounded-3xl bg-card p-5 text-left text-card-foreground">
          <p className="font-heading text-lg font-semibold">
            Last step: join the community
          </p>
          <p className="mt-1 text-sm text-ink/65">
            Sessions, resources and announcements are shared in the WhatsApp
            community first. Don’t miss them.
          </p>
          <a
            href={result.whatsapp_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex h-13 items-center justify-center gap-2 rounded-full bg-[#25D366] text-base font-semibold text-white shadow-lg shadow-[#25D366]/30 transition hover:brightness-105"
          >
            <MessageCircle className="size-5" /> Join the WhatsApp Community
          </a>
        </div>
      )}

      <div className="mt-6">
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Share2 className="size-4" /> Push your chapter up the zone race
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center justify-center rounded-full border border-white/20 text-sm font-semibold transition hover:bg-white/10"
          >
            Share on WhatsApp
          </a>
          <a
            href={`https://x.com/intent/post?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center justify-center rounded-full border border-white/20 text-sm font-semibold transition hover:bg-white/10"
          >
            Share on X
          </a>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 text-sm">
        {onWall && (
          <Link
            to="/"
            hash="builders"
            className="font-semibold text-lime underline-offset-2 hover:underline"
          >
            See yourself on the Builders wall
          </Link>
        )}
        <button
          type="button"
          onClick={onRegisterAnother}
          className="text-muted-foreground underline-offset-2 hover:underline"
        >
          Register another student on this device
        </button>
      </div>
    </div>
  )
}
