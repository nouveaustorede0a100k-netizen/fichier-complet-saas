"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  TrendingUp, 
  Search, 
  Package, 
  Megaphone, 
  Rocket,
  User,
  LogOut
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Vue d'ensemble"
  },
  {
    name: "Trend Finder",
    href: "/trends",
    icon: TrendingUp,
    description: "Recherche de tendances"
  },
  {
    name: "Product Finder",
    href: "/products",
    icon: Search,
    description: "Découverte de produits"
  },
  {
    name: "Offer Builder",
    href: "/offer",
    icon: Package,
    description: "Création d'offres"
  },
  {
    name: "Ad Generator",
    href: "/ads",
    icon: Megaphone,
    description: "Génération de pubs"
  },
  {
    name: "Launch Assistant",
    href: "/launch",
    icon: Rocket,
    description: "Assistant de lancement"
  }
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <div className="flex h-16 items-center justify-between px-6 border-b border-border bg-background">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Rocket className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Drop Eazy</h1>
          <p className="text-xs text-muted-foreground">Business Digitaux IA</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center space-x-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "gap-2 h-9",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden lg:inline">{item.name}</span>
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* User Menu */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" className="gap-2">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Mon Compte</span>
        </Button>
        <Button variant="ghost" size="sm">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export function MobileNavigation() {
  const pathname = usePathname()

  return (
    <div className="md:hidden border-t border-border bg-background">
      <div className="grid grid-cols-3 gap-1 p-2">
        {navigation.slice(0, 6).map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "flex flex-col gap-1 h-auto py-3 px-2",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-xs">{item.name}</span>
              </Button>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
