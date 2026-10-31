import { useState } from 'react'
import type { AvatarSlot } from '@/lib/avatars'
import { cn } from '@/lib/utils'

export function ParticipantAvatar({
  slot,
  className,
}: {
  slot: AvatarSlot
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const isReal = slot.kind === 'real'
  const alt = isReal
    ? `${slot.participant.name}, ${slot.participant.school ?? ''}`
    : ''

  return (
    <span
      className={cn(
        'relative inline-block shrink-0 overflow-hidden rounded-full bg-mint ring-2 ring-white',
        className,
      )}
    >
      {failed && isReal ? (
        <span className="grid size-full place-items-center bg-forest font-semibold text-lime">
          {slot.participant.name.slice(0, 1)}
        </span>
      ) : (
        <img
          src={slot.src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={cn(
            'size-full',
            isReal
              ? 'object-cover'
              : 'translate-y-[8%] scale-90 object-contain',
          )}
        />
      )}
    </span>
  )
}
