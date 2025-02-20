"use client"

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Activity, BarChart2, Home, Layout, LogOut, Menu, Search, Settings, Trophy, UserCircle } from "lucide-react"
import { useState } from "react"

export default function SiteHeader() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  
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
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hidden md:flex"
                  onMouseEnter={() => setIsPopoverOpen(true)}
                  onMouseLeave={() => setIsPopoverOpen(false)}
                >
                  <UserCircle className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-56" 
                align="end"
                onMouseEnter={() => setIsPopoverOpen(true)}
                onMouseLeave={() => setIsPopoverOpen(false)}
              >
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <p className="text-sm font-medium">Your Account</p>
                    <p className="text-xs text-muted-foreground">0x4s2Jx...kZ2c</p>
                  </div>
                  <div className="space-y-1">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <UserCircle className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50">
                      <LogOut className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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

