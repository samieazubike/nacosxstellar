import { Camera, RefreshCw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { PLACEHOLDER_AVATARS } from '@/lib/avatars'
import { cn } from '@/lib/utils'

const MAX_EDGE = 1024

// Phone photos are often 4–12MB; shrinking before upload makes the form fast
// on mobile data and keeps us under the server's 5MB limit.
async function compress(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: 'from-image',
    })
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas
      .getContext('2d')
      ?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.85),
    )
    return blob ? new File([blob], 'photo.jpg', { type: 'image/jpeg' }) : file
  } catch {
    return file
  }
}

export function PhotoPicker({
  value,
  onChange,
  invalid,
}: {
  value: File | null
  onChange: (file: File | null) => void
  invalid?: boolean
}) {
  const input = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!value) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(value)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [value])

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => input.current?.click()}
        aria-label={value ? 'Change profile picture' : 'Add profile picture'}
        className={cn(
          'relative grid size-24 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-dashed transition',
          invalid ? 'border-destructive' : 'border-lime/50 hover:border-lime',
          preview && 'border-solid border-lime',
        )}
      >
        {preview ? (
          <img
            src={preview}
            alt="Your profile picture"
            className="size-full object-cover"
          />
        ) : (
          <img
            src={PLACEHOLDER_AVATARS[1]}
            alt=""
            className="w-3/4 translate-y-1 opacity-60"
          />
        )}
        <span className="absolute right-1 bottom-1 grid size-8 place-items-center rounded-full bg-lime text-ink shadow">
          {busy ? (
            <RefreshCw className="size-4 animate-spin" />
          ) : (
            <Camera className="size-4" />
          )}
        </span>
      </button>
      <div className="text-sm">
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="font-semibold text-lime underline-offset-2 hover:underline"
        >
          {value ? 'Change photo' : 'Upload a clear photo of you'}
        </button>
        <p className="mt-1 text-muted-foreground">
          Used for your program profile. JPG or PNG.
        </p>
      </div>
      <input
        ref={input}
        id="photo"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        className="sr-only"
        tabIndex={-1}
        onChange={async (e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (!file) return
          setBusy(true)
          onChange(await compress(file))
          setBusy(false)
        }}
      />
    </div>
  )
}
