import GrowthRateChart from "@/components/growth-rate-chart"
import BettingInterface from "@/components/betting-interface"
import UserPositions from "@/components/user-positions"
import SiteHeader from "@/components/site-header"

export default function SocialPreMarket() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="container max-w-7xl mx-auto px-4 py-6 md:py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8">Social Prediction Market</h1>
          <div className="grid gap-4 md:gap-6 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4 md:space-y-6">
              <div className="rounded-xl border bg-card p-4 md:p-6">
                <GrowthRateChart />
              </div>
              <UserPositions />
            </div>
            <div className="lg:sticky lg:top-6 h-fit">
              <BettingInterface />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 