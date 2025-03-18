"use client"

import Link from "next/link"
import { UserButton, SignInButton, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useEffect, useState } from "react"

// The only email allowed to be an admin - make it case insensitive
const ADMIN_EMAIL = "ahmedsecen2@gmail.com".toLowerCase()

export function SiteHeader() {
  const { isSignedIn, user } = useUser()
  const { items } = useCart()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (user) {
      const userEmail = (user.primaryEmailAddress?.emailAddress || "").toLowerCase().trim()
      setIsAdmin(userEmail === ADMIN_EMAIL)
    }
  }, [user])

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="font-bold">
            PDF Guide Shop
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/shop"
              className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Shop
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Button>
          </Link>
          <ThemeToggle />
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="modal">
              <Button variant="secondary">Sign In</Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  )
}

