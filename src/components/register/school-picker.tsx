import { Check, School as SchoolIcon, Search } from 'lucide-react'
import { useId, useMemo, useState } from 'react'
import type { School } from '@/lib/api'
import { cn } from '@/lib/utils'
import { fieldInput } from './styles'

const STOP_WORDS = new Set(['of', 'the', 'and', 'for', '&', 'at'])

type Indexed = School & { search: string; acronym: string }

function index(schools: Array<School>): Array<Indexed> {
  return schools.map((s) => {
    const search = s.name.toLowerCase()
    const acronym = search
      .split(/[\s,()-]+/)
      .filter((w) => w && !STOP_WORDS.has(w))
      .map((w) => w[0])
      .join('')
    return { ...s, search, acronym }
  })
}

export type SchoolValue =
  { kind: 'listed'; school: School } | { kind: 'other'; name: string } | null

export function SchoolPicker({
  schools,
  zoneId,
  value,
  onChange,
  invalid,
  loading,
}: {
  schools: Array<School>
  zoneId: number | null
  value: SchoolValue
  onChange: (value: SchoolValue) => void
  invalid?: boolean
  loading?: boolean
}) {
  const listId = useId()
  const indexed = useMemo(() => index(schools), [schools])
  const [query, setQuery] = useState(
    value?.kind === 'listed' ? value.school.name : '',
  )
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    const tokens = q.split(/\s+/)
    const rank = (s: Indexed) =>
      (s.zone_id === zoneId ? 0 : 3) +
      (s.search.startsWith(q)
        ? 0
        : s.acronym.startsWith(q.replace(/\s/g, ''))
          ? 1
          : 2)

    return indexed
      .filter(
        (s) =>
          tokens.every((t) => s.search.includes(t)) ||
          s.acronym.startsWith(q.replace(/\s/g, '')),
      )
      .sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name))
      .slice(0, 8)
  }, [indexed, query, zoneId])

  // One extra row at the end: "My school isn't listed".
  const rowCount = matches.length + 1

  const choose = (row: number) => {
    if (row < matches.length) {
      const school = matches[row]
      setQuery(school.name)
      onChange({ kind: 'listed', school })
    } else {
      onChange({ kind: 'other', name: query.trim() })
    }
    setOpen(false)
  }

  if (value?.kind === 'other') {
    return (
      <div className="space-y-2">
        <input
          id="school"
          className={fieldInput}
          placeholder="Full name of your institution"
          value={value.name}
          aria-invalid={invalid || undefined}
          autoComplete="organization"
          onChange={(e) => onChange({ kind: 'other', name: e.target.value })}
        />
        <button
          type="button"
          className="text-sm font-medium text-lime underline underline-offset-2"
          onClick={() => {
            onChange(null)
            setQuery(value.name)
          }}
        >
          Search the list instead
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        id="school"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        aria-invalid={invalid || undefined}
        className={cn(fieldInput, 'pr-10 pl-11')}
        placeholder={
          loading
            ? 'Loading institutions…'
            : 'Start typing, e.g. UNN or University of Lagos'
        }
        value={query}
        autoComplete="off"
        onFocus={() => query.trim().length >= 2 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onChange={(e) => {
          setQuery(e.target.value)
          setActive(0)
          setOpen(e.target.value.trim().length >= 2)
          if (value) onChange(null)
        }}
        onKeyDown={(e) => {
          if (!open) return
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActive((a) => (a + 1) % rowCount)
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActive((a) => (a - 1 + rowCount) % rowCount)
          } else if (e.key === 'Enter') {
            e.preventDefault()
            choose(active)
          } else if (e.key === 'Escape') {
            setOpen(false)
          }
        }}
      />
      {value?.kind === 'listed' && (
        <Check className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-lime" />
      )}
      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-30 mt-2 max-h-80 overflow-auto rounded-2xl bg-popover p-1.5 shadow-2xl ring-1 ring-white/15"
        >
          {matches.map((s, i) => (
            <li
              key={s.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={active === i}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(i)}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5',
                active === i && 'bg-white/10',
              )}
            >
              <SchoolIcon className="mt-0.5 size-4 shrink-0 text-lime" />
              <span className="min-w-0">
                <span className="block text-sm leading-snug">{s.name}</span>
                <span className="block text-xs text-muted-foreground capitalize">
                  {s.state.toLowerCase()}
                </span>
              </span>
            </li>
          ))}
          <li
            id={`${listId}-${matches.length}`}
            role="option"
            aria-selected={active === matches.length}
            onMouseDown={(e) => e.preventDefault()}
            onMouseEnter={() => setActive(matches.length)}
            onClick={() => choose(matches.length)}
            className={cn(
              'cursor-pointer rounded-xl px-3 py-2.5 text-sm text-lime',
              active === matches.length && 'bg-white/10',
            )}
          >
            {matches.length === 0 ? 'No match. ' : ''}My school isn’t listed →
          </li>
        </ul>
      )}
    </div>
  )
}
