import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Activity, BarChart2, Home, Layout, Menu, Search, Trophy, UserCircle } from "lucide-react"

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <BarChart2 className="h-5 w-5" />
              <span>Anteros</span>
            </Link>
            <div className="relative w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search markets" 
                className="pl-8 w-full" 
              />
            </div>
          </div>

          <NavigationMenu className="hidden md:flex absolute left-1/2 -translate-x-1/2">
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Home className="h-4 w-4 mr-2" />
                    Markets
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/dashboard" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Layout className="h-4 w-4 mr-2" />
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/activity" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Activity className="h-4 w-4 mr-2" />
                    Activity
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/leaderboard" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Trophy className="h-4 w-4 mr-2" />
                    Leaderboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <UserCircle className="h-5 w-5" />
            </Button>
            <Button variant="default" size="sm">
              Connect Wallet
            </Button>
          </div>
        </div>

        <div className="h-10 -mb-px flex items-center justify-center overflow-x-auto">
          <NavigationMenu>
            <NavigationMenuList className="gap-6">
              <NavigationMenuItem className="text-red-500 font-medium text-sm flex items-center shrink-0">
                LIVE
                <span className="ml-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              </NavigationMenuItem>
              {["All", "Trending", "Tech", "Politics", "Crypto", "Sports", "Entertainment"].map((item) => (
                <NavigationMenuItem key={item} className="shrink-0">
                  <Link href="#" legacyBehavior passHref>
                    <NavigationMenuLink className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  )
}

