import GrowthRateChart from "@/components/growth-rate-chart"
import BettingInterface from "@/components/betting-interface"
import UserPositions from "@/components/user-positions"
import SiteHeader from "@/components/site-header"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container mx-auto p-4 flex-1">
        <h1 className="text-3xl font-bold mb-6">Social Prediction Market</h1>
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <GrowthRateChart />
            <UserPositions />
          </div>
          <BettingInterface />
        </div>
      </main>
    </div>
  )
}

