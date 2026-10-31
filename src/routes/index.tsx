import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { BuildersWall } from '@/components/landing/builders-wall'
import { Hero } from '@/components/landing/hero'
import {
  About,
  Explore,
  FinalCta,
  PartnerStrip,
  SiteFooter,
  SiteHeader,
} from '@/components/landing/sections'
import { StickyRegister } from '@/components/landing/sticky-register'
import { ZoneRace } from '@/components/landing/zone-race'
import { EMPTY_STATS, statsQuery } from '@/lib/api'

export const Route = createFileRoute('/')({
  // Server-render the live numbers; if the portal is unreachable the page
  // still renders with placeholders and polling fills it in.
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(statsQuery).catch(() => null),
  component: Home,
})

function Home() {
  const { data: stats = EMPTY_STATS } = useQuery(statsQuery)

  return (
    <>
      <SiteHeader />
      <main>
        <Hero stats={stats} />
        <PartnerStrip />
        <About />
        <Explore />
        <ZoneRace stats={stats} />
        <BuildersWall />
        <FinalCta total={stats.total} />
      </main>
      <SiteFooter />
      <StickyRegister total={stats.total} />
    </>
  )
}
