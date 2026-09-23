"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { PROGRAMS_BY_ID, PILLARS, PROGRAM_HOVER_BG_CLASS, PROGRAM_TEXT_CLASS } from "@/lib/programs"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, BookOpen, User, LogOut, LayoutDashboard, ChevronRight, ArrowUpRight } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navItems = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Programs", href: "/programs", hasChildren: true },
  { title: "Events", href: "/events" },
  { title: "Blog", href: "/blog", icon: BookOpen },
  { title: "Gallery", href: "/gallery" },
  { title: "Contribute", href: "/contribute" },
]

export function MainNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="flex w-full items-center justify-between gap-4">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 rounded-lg py-1 pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <Image
          src="/logos/foss-andhra-logo.png"
          alt="FOSS Andhra Logo"
          width={180}
          height={40}
          className="h-10 w-auto"
          priority
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden items-center lg:flex">
        <NavigationMenu className="nav-layer">
          <NavigationMenuList className="gap-0.5">
            {navItems.map((item, index) => {
              if (item.hasChildren) {
                return (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuTrigger
                      className={cn(
                        "text-[14px] font-medium h-9 px-3.5 rounded-lg nav-trigger-layer transition-colors",
                        pathname.startsWith("/programs")
                          ? "bg-primary/8 text-primary"
                          : "text-foreground/80 hover:text-foreground hover:bg-muted",
                      )}
                    >
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="nav-content-layer">
                      <div className="grid w-[520px] grid-cols-2 gap-x-6 gap-y-5 p-5 lg:w-[640px]">
                        {PILLARS.map((pillar) => (
                          <div key={pillar.id}>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-2">
                              {pillar.label}
                            </p>
                            <ul className="space-y-1">
                              {pillar.programs.map((programId) => {
                                const program = PROGRAMS_BY_ID[programId]
                                return (
                                  <li key={program.id}>
                                    <NavigationMenuLink asChild>
                                      <Link
                                        href={`/programs/${program.slug}`}
                                        className={cn(
                                          "group flex select-none items-center gap-2.5 rounded-lg border border-transparent p-2 no-underline outline-none transition-all hover:bg-muted hover:border-border focus:bg-muted",
                                          PROGRAM_HOVER_BG_CLASS[program.id],
                                        )}
                                      >
                                        <Image
                                          src={program.logo || "/placeholder.svg"}
                                          alt={`${program.displayName} Logo`}
                                          width={90}
                                          height={24}
                                          className="h-6 w-auto object-contain flex-shrink-0"
                                        />
                                        <span className="text-sm font-medium text-foreground">{program.displayName}</span>
                                      </Link>
                                    </NavigationMenuLink>
                                  </li>
                                )
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )
              }

              return (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-[14px] font-medium h-9 px-3.5 rounded-lg transition-colors",
                        pathname === item.href
                          ? "bg-primary/8 text-primary"
                          : "text-foreground/80 hover:text-foreground hover:bg-muted",
                      )}
                    >
                      {item.title}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Auth actions */}
        <div className="ml-4 flex items-center gap-2">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                      {session.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="dropdown-layer w-56 rounded-xl" align="end" forceMount>
                <DropdownMenuLabel className="font-normal px-3 py-2.5">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-semibold leading-none">{session.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground mt-1">{session.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="rounded-lg mx-1 my-0.5">
                  <Link href="/member">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg mx-1 my-0.5">
                  <Link href="/member/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="rounded-lg mx-1 my-0.5 text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/membership">
              <Button size="sm" className="px-5">
                Join the movement <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[380px] p-0">
            <div className="flex flex-col h-full">
              {/* Mobile header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
                <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                  <Image
                    src="/logos/foss-andhra-logo.png"
                    alt="FOSS Andhra Logo"
                    width={120}
                    height={30}
                    className="h-8 w-auto"
                  />
                </Link>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>

              {/* Nav links */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                {navItems.map((item, index) => {
                  if (item.hasChildren) {
                    return (
                      <div key={index} className="space-y-3">
                        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Programs
                        </div>
                        {PILLARS.map((pillar) => (
                          <div key={pillar.id} className="pl-2 border-l-2 border-muted ml-2 space-y-0.5">
                            <p className="px-3 text-[11px] font-bold uppercase tracking-widest text-primary">
                              {pillar.label}
                            </p>
                            {pillar.programs.map((programId) => {
                              const program = PROGRAMS_BY_ID[programId]
                              const href = `/programs/${program.slug}`
                              return (
                                <Link
                                  key={program.id}
                                  href={href}
                                  className={cn(
                                    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors",
                                    pathname === href
                                      ? cn(PROGRAM_TEXT_CLASS[program.id], "bg-muted font-medium")
                                      : "text-foreground/75 hover:text-foreground hover:bg-muted",
                                  )}
                                  onClick={() => setIsOpen(false)}
                                >
                                  <Image
                                    src={program.logo || "/placeholder.svg"}
                                    alt={`${program.displayName} Logo`}
                                    width={80}
                                    height={24}
                                    className="h-5 w-auto object-contain"
                                  />
                                  <span className="text-sm font-medium">{program.displayName}</span>
                                </Link>
                              )
                            })}
                          </div>
                        ))}
                      </div>
                    )
                  }

                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "text-primary bg-primary/8"
                          : "text-foreground/75 hover:text-foreground hover:bg-muted",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                      {pathname === item.href && <ChevronRight className="h-3.5 w-3.5" />}
                    </Link>
                  )
                })}
              </div>

              {/* Mobile footer */}
              <div className="px-4 pb-6 pt-3 border-t border-border/60 space-y-3">
                {session ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-muted">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user?.image || ""} />
                        <AvatarFallback className="text-xs">{session.user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{session.user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                      </div>
                    </div>
                    <Link href="/member" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start rounded-xl">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full justify-start rounded-xl text-destructive border-destructive/30 hover:bg-destructive/5"
                      onClick={() => signOut()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <Link href="/membership" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">
                      Join the movement <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
