import type { Participant } from './api'

// Microsoft Fluent Emoji 3D (MIT). They hold the avatar slots until real
// participant photos arrive, then get pushed out one by one.
export const PLACEHOLDER_AVATARS = Array.from(
  { length: 12 },
  (_, i) => `/avatars/3d-${String(i + 1).padStart(2, '0')}.png`,
)

export type AvatarSlot =
  | { kind: 'real'; key: string; src: string; participant: Participant }
  | { kind: 'placeholder'; key: string; src: string }

export function fillAvatarSlots(
  participants: Array<Participant>,
  count: number,
): Array<AvatarSlot> {
  const real: Array<AvatarSlot> = participants.slice(0, count).map((p) => ({
    kind: 'real',
    key: p.id,
    src: p.photo_url,
    participant: p,
  }))
  const placeholders: Array<AvatarSlot> = PLACEHOLDER_AVATARS.slice(
    0,
    Math.max(0, count - real.length),
  ).map((src) => ({ kind: 'placeholder', key: src, src }))

  return [...real, ...placeholders]
}
