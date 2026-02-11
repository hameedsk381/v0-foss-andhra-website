"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
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
import { Menu, X, Code, Database, Smartphone, BookOpen, User, LogOut, LayoutDashboard } from "lucide-react"
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

const programs = [
  {
    id: "fosstar",
    title: "FOSStar",
    description: "Membership program connecting the FOSS community",
    href: "/programs/fosstar",
    color: "fosstar",
    icon: Code,
    logo: "/logos/fosstar-logo.png",
  },
  {
    id: "fosserve",
    title: "FOSServe",
    description: "Promoting open-source solutions in education and governance",
    href: "/programs/fosserve",
    color: "purple",
    icon: Database,
    logo: "/logos/fosserve-logo.png",
  },
  {
    id: "fossync",
    title: "FOSSynC",
    description: "Student-led FOSS clubs in educational institutions",
    href: "/programs/fossync",
    color: "green",
    icon: Smartphone,
    logo: "/logos/fossync-logo.png",
  },
  {
    id: "fosstorm",
    title: "FOSStorm",
    description: "Community-led open source projects",
    href: "/programs/fosstorm",
    color: "orange",
    icon: Code,
    logo: "/logos/fosstorm-logo.png",
  },
  {
    id: "fosstart",
    title: "FOSStart",
    description: "Entrepreneurship space for funding open-source innovations",
    href: "/programs/fosstart",
    color: "red",
    icon: Database,
    logo: "/logos/fosstart-logo.png",
  },
  {
    id: "fossterage",
    title: "FOSSterage",
    description: "Repository of knowledge bases for researchers",
    href: "/programs/fossterage",
    color: "blue",
    icon: Smartphone,
    logo: "/logos/fossterage-logo.png",
  },
  {
    id: "fosspeaks",
    title: "FOSSpeaks",
    description: "Advocacy program for free and open-source technology",
    href: "/programs/fosspeaks",
    color: "yellow",
    icon: Code,
    logo: "/logos/fosspeaks-logo.png",
  },
]

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

  // Add the CSS styles for z-index
  React.useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
      .navigation-menu-content {
        z-index: 50 !important;
      }
      
      .navigation-menu-trigger {
        z-index: 50 !important;
      }
      
      .dropdown-menu {
        z-index: 50 !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="flex w-full justify-between items-center">
      <Link href="/" className="flex items-center space-x-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative h-10 w-auto"
        >
          <Image
            src="/logos/foss-andhra-logo.png"
            alt="FOSS Andhra Logo"
            width={180}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </motion.div>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex">
        <NavigationMenu>
          <NavigationMenuList>
            {navItems.map((item, index) => {
              if (item.hasChildren) {
                return (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuTrigger
                      className={cn("text-base", pathname.startsWith("/programs") && "text-primary font-medium")}
                    >
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {programs.map((program) => (
                          <li key={program.id}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={program.href}
                                className={cn(
                                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                  program.id === "fosstar"
                                    ? "hover:bg-fosstar/10"
                                    : program.id === "fosserve"
                                      ? "hover:bg-purple-100"
                                      : program.id === "fossync"
                                        ? "hover:bg-green-100"
                                        : program.id === "fosstorm"
                                          ? "hover:bg-orange-100"
                                          : program.id === "fosstart"
                                            ? "hover:bg-red-100"
                                            : program.id === "fossterage"
                                              ? "hover:bg-blue-100"
                                              : "hover:bg-yellow-100",
                                )}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="h-8 w-auto flex-shrink-0">
                                    <Image
                                      src={program.logo || "/placeholder.svg"}
                                      alt={`${program.title} Logo`}
                                      width={100}
                                      height={32}
                                      className="h-full w-auto object-contain"
                                    />
                                  </div>
                                  <div className="text-sm font-medium leading-none">{program.title}</div>
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {program.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )
              }

              return (
                <NavigationMenuItem key={index}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-base",
                        pathname === item.href && "text-primary font-medium",
                      )}
                    >
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-4 flex items-center gap-4">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                    <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/member">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/member/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/login">
                <Button className="bg-secondary text-black hover:bg-secondary/90">Join Us / Login</Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                  <Image
                    src="/logos/foss-andhra-logo.png"
                    alt="FOSS Andhra Logo"
                    width={120}
                    height={30}
                    className="h-8 w-auto"
                  />
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>

              <div className="space-y-4 flex-1">
                <AnimatePresence>
                  {navItems.map((item, index) => {
                    if (item.hasChildren) {
                      return (
                        <div key={index} className="space-y-2">
                          <div className="font-medium px-1 py-2">{item.title}</div>
                          <div className="pl-4 space-y-3 border-l-2 border-muted">
                            {programs.map((program) => (
                              <motion.div
                                key={program.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <Link
                                  href={program.href}
                                  className={cn(
                                    "flex items-center gap-2 py-3 px-1 rounded-md",
                                    pathname === program.href
                                      ? program.id === "fosstar"
                                        ? "text-fosstar font-medium"
                                        : program.id === "fosserve"
                                          ? "text-purple-600 font-medium"
                                          : program.id === "fossync"
                                            ? "text-green-600 font-medium"
                                            : program.id === "fosstorm"
                                              ? "text-orange-600 font-medium"
                                              : program.id === "fosstart"
                                                ? "text-red-600 font-medium"
                                                : program.id === "fossterage"
                                                  ? "text-blue-600 font-medium"
                                                  : "text-yellow-600 font-medium"
                                      : "text-foreground hover:text-primary",
                                  )}
                                  onClick={() => setIsOpen(false)}
                                >
                                  <Image
                                    src={program.logo || "/placeholder.svg"}
                                    alt={`${program.title} Logo`}
                                    width={100}
                                    height={30}
                                    className="h-6 w-auto object-contain"
                                  />
                                  <span className="text-sm font-medium">{program.title}</span>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )
                    }

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "block py-3 px-1 rounded-md",
                            pathname === item.href ? "text-primary font-medium" : "text-foreground hover:text-primary",
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.title}
                        </Link>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>

              <div className="pt-4 mt-auto border-t">
                {session ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user?.image || ""} />
                        <AvatarFallback>{session.user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{session.user?.name}</p>
                        <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                      </div>
                    </div>
                    <Link href="/member" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start text-red-600" onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-secondary text-black hover:bg-secondary/90">Join Us / Login</Button>
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
