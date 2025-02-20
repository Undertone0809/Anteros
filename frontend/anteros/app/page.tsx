import Link from "next/link"
import { Button } from "@/components/ui/button"
import SiteHeader from "@/components/site-header"
import { TrendingUp, Users, Clock, BarChart2 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          {/* Market Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">24h Volume</span>
              </div>
              <div className="text-2xl font-bold">$2.5M</div>
              <div className="text-sm text-green-500">+15.2%</div>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Active Traders</span>
              </div>
              <div className="text-2xl font-bold">12.5K</div>
              <div className="text-sm text-green-500">+5.8%</div>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Open Markets</span>
              </div>
              <div className="text-2xl font-bold">156</div>
              <div className="text-sm text-muted-foreground">Active Now</div>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Success Rate</span>
              </div>
              <div className="text-2xl font-bold">92.3%</div>
              <div className="text-sm text-green-500">+2.1%</div>
            </div>
          </div>

          {/* Featured Markets Section */}
          <h2 className="text-2xl font-bold mb-4">Featured Markets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Link href="/event/social-pre-market" className="group">
              <div className="rounded-xl border bg-card p-6 hover:border-primary transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">Hot</span>
                  <span className="text-xs text-muted-foreground">Ends in 2d 5h</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">KOL Growth Prediction</h3>
                <p className="text-muted-foreground mb-4">Predict the growth trajectory of top social media influencers</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Volume</div>
                    <div className="font-medium">$50K</div>
                  </div>
                  <Button variant="outline" size="sm">Trade Now</Button>
                </div>
              </div>
            </Link>

            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">New</span>
                <span className="text-xs text-muted-foreground">Ends in 5d 12h</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Viral Post Predictions</h3>
              <p className="text-muted-foreground mb-4">Will this post reach 1M likes by end of week?</p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Volume</div>
                  <div className="font-medium">$25K</div>
                </div>
                <Button variant="outline" size="sm">Coming Soon</Button>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">Featured</span>
                <span className="text-xs text-muted-foreground">Ends in 3d 8h</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaboration Markets</h3>
              <p className="text-muted-foreground mb-4">Predict upcoming creator collaborations</p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Volume</div>
                  <div className="font-medium">$30K</div>
                </div>
                <Button variant="outline" size="sm">Coming Soon</Button>
              </div>
            </div>
          </div>

          {/* Trending Markets */}
          <h2 className="text-2xl font-bold mb-4">Trending Markets</h2>
          <div className="grid grid-cols-1 gap-4 mb-8">
            <Link href="/event/social-pre-market">
              <div className="rounded-xl border bg-card p-6 hover:border-primary transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">High Volume</span>
                      <span className="text-xs text-muted-foreground">24h Change: +12.5%</span>
                    </div>
                    <h3 className="text-lg font-semibold">Will MrBeast hit 200M subscribers by March?</h3>
                    <p className="text-muted-foreground">Current: 187M (Growing 2.1M/week)</p>
                  </div>
                  <Button variant="outline">Trade Now</Button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "75.32%" }}></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Yes: 75.32%</span>
                      <span className="text-red-700">No: 24.68%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Volume</div>
                    <div className="font-medium">$100K</div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/event/social-pre-market">
              <div className="rounded-xl border bg-card p-6 hover:border-primary transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">Trending</span>
                      <span className="text-xs text-muted-foreground">24h Change: +8.3%</span>
                    </div>
                    <h3 className="text-lg font-semibold">Next viral TikTok trend prediction</h3>
                    <p className="text-muted-foreground">Will "AI Fashion" be the next big trend?</p>
                  </div>
                  <Button variant="outline">Trade Now</Button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "63.26%" }}></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Yes: 63.26%</span>
                      <span className="text-red-700">No: 36.74%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Volume</div>
                    <div className="font-medium">$75K</div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
