import Link from "next/link"
import { Button } from "@/components/ui/button"
import SiteHeader from "@/components/site-header"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          {/* Featured Markets Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Link href="/event/social-pre-market" className="group">
              <div className="rounded-xl border bg-card p-6 hover:border-primary transition-colors">
                <h3 className="text-xl font-semibold mb-2">KOL Growth Prediction</h3>
                <p className="text-muted-foreground mb-4">Predict the growth trajectory of top social media influencers</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">$50K Volume</span>
                  <Button variant="outline" size="sm">Trade Now</Button>
                </div>
              </div>
            </Link>

            <div className="rounded-xl border bg-card p-6">
              <h3 className="text-xl font-semibold mb-2">Viral Post Predictions</h3>
              <p className="text-muted-foreground mb-4">Will this post reach 1M likes by end of week?</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">$25K Volume</span>
                <Button variant="outline" size="sm">Coming Soon</Button>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6">
              <h3 className="text-xl font-semibold mb-2">Collaboration Markets</h3>
              <p className="text-muted-foreground mb-4">Predict upcoming creator collaborations</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">$30K Volume</span>
                <Button variant="outline" size="sm">Coming Soon</Button>
              </div>
            </div>
          </div>

          {/* Trending Markets */}
          <h2 className="text-2xl font-bold mb-4">Trending Markets</h2>
          <div className="grid grid-cols-1 gap-4 mb-8">
            {/* Market items */}
            <div className="rounded-xl border bg-card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Will MrBeast hit 200M subscribers by March?</h3>
                  <p className="text-muted-foreground">Current: 187M</p>
                </div>
                <Button variant="outline">Trade</Button>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded">Yes: 75.32%</div>
                <div className="bg-red-100 text-red-700 px-3 py-1 rounded">No: 24.68%</div>
                <span className="text-sm text-muted-foreground ml-auto">Volume: $100K</span>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Next viral TikTok trend prediction</h3>
                  <p className="text-muted-foreground">Will &quot;AI Fashion&quot; be the next big trend?</p>
                </div>
                <Button variant="outline">Trade</Button>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded">Yes: 63.26%</div>
                <div className="bg-red-100 text-red-700 px-3 py-1 rounded">No: 36.74%</div>
                <span className="text-sm text-muted-foreground ml-auto">Volume: $75K</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
