import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

// Phone-only bar that keeps the CTA one tap away once the hero scrolls off.
export function StickyRegister({ total }: { total: number }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 560)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/95 p-3 backdrop-blur transition-transform duration-300 md:hidden',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      <Link
        to="/register"
        tabIndex={visible ? 0 : -1}
        className="flex h-12 items-center justify-between rounded-full bg-lime pr-2 pl-5 text-sm font-semibold text-ink"
      >
        <span>
          {total > 0
            ? `Join ${total.toLocaleString()} builders`
            : 'Be one of the first builders'}
        </span>
        <span className="flex h-9 items-center gap-1 rounded-full bg-ink px-4 text-white">
          Register <ArrowRight className="size-4 text-lime" />
        </span>
      </Link>
    </div>
  )
}
