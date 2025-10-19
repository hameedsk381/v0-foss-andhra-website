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
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, Code, Database, Smartphone } from "lucide-react"

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
    id: "fossart",
    title: "FOSSart",
    description: "Entrepreneurship space for funding open-source innovations",
    href: "/programs/fossart",
    color: "red",
    icon: Database,
    logo: "/logos/fossart-logo.png",
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
  { title: "Programs", href: "#", hasChildren: true },
  { title: "Events", href: "/events" },
  { title: "Gallery", href: "/gallery" },
  { title: "Contribute", href: "/contribute" },
]

export function MainNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const menuTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Custom handlers for menu open/close with delay
  const handleMenuMouseEnter = () => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current)
      menuTimeoutRef.current = null
    }
    setIsMenuOpen(true)
  }

  const handleMenuMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setIsMenuOpen(false)
    }, 300) // 300ms delay before closing
  }

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
    <div className="flex justify-between items-center py-4">
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
                    <div onMouseEnter={handleMenuMouseEnter} onMouseLeave={handleMenuMouseLeave} className="relative">
                      <NavigationMenuTrigger
                        className={cn("text-base", pathname.startsWith("/programs") && "text-primary font-medium")}
                      >
                        {item.title}
                      </NavigationMenuTrigger>

                      {/* Custom dropdown that stays open on hover */}
                      {isMenuOpen && (
                        <div
                          className="absolute top-full left-0 mt-1 z-50 bg-white rounded-md shadow-lg p-4 w-[600px] dropdown-menu"
                          style={{ minWidth: "600px" }}
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-2 gap-3"
                          >
                            {programs.map((program) => (
                              <Link
                                key={program.id}
                                href={program.href}
                                className={cn(
                                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
                                  program.id === "fosstar"
                                    ? "hover:bg-fosstar/10"
                                    : program.id === "fosserve"
                                      ? "hover:bg-purple-100"
                                      : program.id === "fossync"
                                        ? "hover:bg-green-100"
                                        : program.id === "fosstorm"
                                          ? "hover:bg-orange-100"
                                          : program.id === "fossart"
                                            ? "hover:bg-red-100"
                                            : program.id === "fossterage"
                                              ? "hover:bg-blue-100"
                                              : "hover:bg-yellow-100",
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <div className="h-10 w-auto">
                                    <Image
                                      src={program.logo || "/placeholder.svg"}
                                      alt={`${program.title} Logo`}
                                      width={120}
                                      height={40}
                                      className="h-8 w-auto object-contain"
                                    />
                                  </div>
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                                  {program.description}
                                </p>
                              </Link>
                            ))}
                          </motion.div>
                        </div>
                      )}
                    </div>
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

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="ml-4">
          <Link href="/programs/fosstar#membership">
            <Button className="bg-secondary text-black hover:bg-secondary/90">Join Us</Button>
          </Link>
        </motion.div>
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
                                    "flex items-center gap-2 py-2 px-1 rounded-md",
                                    pathname === program.href
                                      ? program.id === "fosstar"
                                        ? "text-fosstar font-medium"
                                        : program.id === "fosserve"
                                          ? "text-purple-600 font-medium"
                                          : program.id === "fossync"
                                            ? "text-green-600 font-medium"
                                            : program.id === "fosstorm"
                                              ? "text-orange-600 font-medium"
                                              : program.id === "fossart"
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
                                    className="h-6 w-auto"
                                  />
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
                            "block py-2 px-1 rounded-md",
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

              <div className="pt-4 mt-auto">
                <Link href="/programs/fosstar#membership" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-secondary text-black hover:bg-secondary/90">Join Us</Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
