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
import { Activity, BarChart2, Home, Layout, Search, Trophy, UserCircle } from "lucide-react"

export default function SiteHeader() {
  return (
    <header className="border-b">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 font-semibold mr-6">
          <BarChart2 className="h-6 w-6" />
          <span className="">Anteros</span>
        </Link>

        <div className="flex-1 flex items-center gap-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search markets" className="pl-8 w-full" />
          </div>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
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
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <UserCircle className="h-5 w-5" />
          </Button>
          <Button variant="default" size="sm">
            Connect Wallet
          </Button>
        </div>
      </div>

      <div className="container flex h-10 items-center border-t">
        <NavigationMenu>
          <NavigationMenuList className="gap-4">
            <NavigationMenuItem className="text-red-500 font-medium text-sm flex items-center">
              LIVE
              <span className="ml-1 h-2 w-2 rounded-full bg-red-500"></span>
            </NavigationMenuItem>
            {["All", "Trending", "Tech", "Politics", "Crypto", "Sports", "Entertainment"].map((item) => (
              <NavigationMenuItem key={item}>
                <Link href="#" legacyBehavior passHref>
                  <NavigationMenuLink className="text-sm text-muted-foreground hover:text-foreground">
                    {item}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}

