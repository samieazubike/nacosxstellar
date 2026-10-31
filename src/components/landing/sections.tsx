import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Blocks,
  Coins,
  GraduationCap,
  Hammer,
  Network,
  Orbit,
  Rocket,
} from 'lucide-react'
import { BrandLockup, NxylyMark, StarMark } from '@/components/brand'
import { useCountUp } from '@/hooks/use-count-up'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <BrandLockup />
        <nav className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
          {[
            ['#about', 'About'],
            ['#explore', 'What you’ll explore'],
            ['#zones', 'Zone race'],
            ['#builders', 'Builders'],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-3 py-1.5 transition hover:bg-white/10 hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>
        <Link
          to="/register"
          className="inline-flex h-10 items-center rounded-full bg-lime px-5 text-sm font-semibold text-ink transition hover:brightness-105"
        >
          Register
        </Link>
      </div>
    </header>
  )
}

export function PartnerStrip() {
  return (
    <section aria-label="Program partners" className="border-y border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-8 sm:flex-row sm:justify-between sm:px-6">
        <p className="text-sm text-muted-foreground">In partnership with</p>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          <li>
            <img
              src="/nacos.svg"
              alt="NACOS National"
              className="h-12 w-auto"
            />
          </li>
          <li>
            <img
              src="/stellar.png"
              alt="Stellar Development Foundation"
              className="h-10 w-auto"
            />
          </li>
          <li className="flex items-center gap-2 font-heading text-2xl font-semibold text-white">
            <NxylyMark className="size-9" /> Nyxly.io
          </li>
        </ul>
      </div>
    </section>
  )
}

export function About() {
  const points = [
    {
      icon: GraduationCap,
      title: 'Learn',
      body: 'Understand how blockchains actually work, from wallets and transactions to the Stellar network and its tooling.',
    },
    {
      icon: Hammer,
      title: 'Build',
      body: 'Turn ideas into working products that solve real problems for students, businesses and communities.',
    },
    {
      icon: Coins,
      title: 'Earn',
      body: 'Discover how builders contribute to the ecosystem and access opportunities in the growing Web3 economy.',
    },
  ]

  return (
    <section id="about" className="scroll-mt-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold tracking-wide text-lime uppercase">
            About the program
          </p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">
            Blockchain is bigger than <em className="text-lime">trading</em>.
          </h2>
          <p className="mt-5 text-muted-foreground sm:text-lg">
            Most students only meet blockchain through price charts. NACOS
            National is introducing computing students across Nigeria to the
            ecosystem behind it: the people, the tools and the opportunities to
            learn, build, contribute and earn on Stellar.
          </p>
          <p className="mt-4 text-muted-foreground">
            You’ll document your journey on{' '}
            <span className="font-semibold text-foreground">Nyxly.io</span>,
            where participants post what they learn and build.
          </p>
        </div>
        <ul className="grid gap-4">
          {points.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="flex gap-4 rounded-3xl bg-white/[0.04] p-6 ring-1 ring-white/10"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-lime text-ink">
                <Icon className="size-6" />
              </span>
              <div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-1 text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Explore() {
  const topics = [
    {
      icon: Blocks,
      title: 'Introduction to Blockchain Technology',
      body: 'Ledgers, consensus, keys and wallets, explained from first principles.',
    },
    {
      icon: Orbit,
      title: 'Understanding the Stellar Ecosystem',
      body: 'How Stellar moves value across borders, and who is building on it.',
    },
    {
      icon: Hammer,
      title: 'Building on Stellar',
      body: 'Hands-on with Stellar’s developer tools and smart contracts.',
    },
    {
      icon: Network,
      title: 'Exploring Web3 Opportunities',
      body: 'Roles, communities and career paths beyond trading.',
    },
    {
      icon: Rocket,
      title: 'From Learning to Building and Earning',
      body: 'Ship projects, contribute to the ecosystem and get rewarded.',
    },
  ]

  return (
    <section id="explore" className="scroll-mt-20 bg-mint text-ink">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold tracking-wide text-forest uppercase">
              What you’ll explore
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold sm:text-5xl">
              From your first wallet to your first build.
            </h2>
          </div>
          <Link
            to="/register"
            className="inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:bg-ink/90 sm:self-auto"
          >
            Save my spot <ArrowRight className="size-4 text-lime" />
          </Link>
        </div>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {topics.map(({ icon: Icon, title, body }, i) => (
            <li
              key={title}
              className="flex flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-ink/5"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-ink text-lime">
                  <Icon className="size-5" />
                </span>
                <span className="font-heading text-sm font-semibold text-ink/40">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-6 text-lg leading-snug font-semibold">
                {title}
              </h3>
              <p className="mt-2 text-sm text-ink/65">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function FinalCta({ total }: { total: number }) {
  const count = useCountUp(total)

  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-lime px-6 py-14 text-center text-ink sm:px-12">
        <StarMark className="absolute -top-10 -left-10 size-40 text-ink/5" />
        <StarMark className="absolute -right-8 -bottom-12 size-48 text-ink/5" />
        <h2 className="relative text-3xl font-semibold sm:text-5xl">
          Ready to explore the blockchain ecosystem?
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-ink/75 sm:text-lg">
          Register now and take your first step into the Stellar ecosystem.
          {total > 0 && (
            <>
              {' '}
              <strong className="text-ink">
                {count.toLocaleString()}
              </strong>{' '}
              students already have.
            </>
          )}
        </p>
        <Link
          to="/register"
          className="relative mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-sm font-semibold text-white transition hover:bg-ink/90"
        >
          Register in 2 minutes <ArrowRight className="size-4 text-lime" />
        </Link>
      </div>
    </section>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 pb-24 md:pb-0">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <BrandLockup className="text-foreground" />
        <p>
          Organised by NACOS National · Powered by Stellar · In partnership with
          Nyxly.io
        </p>
      </div>
    </footer>
  )
}
