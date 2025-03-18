"use client"

import Link from "next/link"
import { UserButton, SignInButton, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { BookOpen, Menu, Search, ShoppingCart, X } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// The only email allowed to be an admin - make it case insensitive
const ADMIN_EMAIL = "ahmedsecen2@gmail.com".toLowerCase()

export function SiteHeader() {
  const { isSignedIn, user } = useUser()
  const { items } = useCart()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    if (user) {
      const userEmail = (user.primaryEmailAddress?.emailAddress || "").toLowerCase().trim()
      setIsAdmin(userEmail === ADMIN_EMAIL)
    }
  }, [user])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${isScrolled ? "border-b bg-background/80 backdrop-blur-md" : "bg-background"}`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 py-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  <span className="text-lg font-bold">PDF Guide Shop</span>
                </div>
                <div className="grid gap-4">
                  <Link
                    href="/"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-lg font-medium transition-colors hover:bg-muted"
                  >
                    Home
                  </Link>
                  <Link
                    href="/shop"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-lg font-medium transition-colors hover:bg-muted"
                  >
                    Shop
                  </Link>
                  <Link
                    href="/cart"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-lg font-medium transition-colors hover:bg-muted"
                  >
                    Cart
                    {totalItems > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {totalItems}
                      </Badge>
                    )}
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-lg font-medium transition-colors hover:bg-muted"
                    >
                      Admin
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2 font-bold">
            <BookOpen className="h-6 w-6" />
            <span className="hidden sm:inline-block">PDF Guide Shop</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/shop"
              className="flex items-center text-base font-medium transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Shop
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center text-base font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {isSearchOpen ? (
            <div className="relative flex items-center">
              <Input placeholder="Search guides..." className="w-[200px] sm:w-[300px] pr-8" autoFocus />
              <Button variant="ghost" size="icon" className="absolute right-0" onClick={() => setIsSearchOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {totalItems}
                </span>
              )}
              <span className="sr-only">View cart</span>
            </Button>
          </Link>
          <ThemeToggle />
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="modal">
              <Button variant="secondary" size="sm" className="h-9">
                Sign In
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  )
}

