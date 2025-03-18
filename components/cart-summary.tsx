"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"
import { useEffect, useState } from "react"
import { ArrowRight, CreditCard, ShieldCheck } from "lucide-react"

export function CartSummary() {
  const { items } = useCart()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Card>
        <CardHeader className="animate-pulse">
          <div className="h-6 bg-muted rounded"></div>
        </CardHeader>
        <CardContent className="space-y-4 animate-pulse">
          <div className="h-4 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded"></div>
        </CardContent>
        <CardFooter className="animate-pulse">
          <div className="h-10 bg-muted rounded w-full"></div>
        </CardFooter>
      </Card>
    )
  }

  const subtotal = items.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)

  // This will be replaced with actual tax calculation when Stripe is integrated
  const tax = subtotal * 0.1 // 10% tax for example
  const total = subtotal + tax

  return (
    <Card className="border-2">
      <CardHeader className="bg-muted/50">
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax (estimated)</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="rounded-lg bg-muted/50 p-4 text-sm">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="font-medium">Secure Checkout</span>
          </div>
          <p className="text-muted-foreground">
            Your payment information is processed securely. We do not store credit card details.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full group" size="lg" disabled={items.length === 0}>
          Checkout
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <CreditCard className="h-3 w-3" />
          <span>Visa, Mastercard, American Express</span>
        </div>
      </CardFooter>
    </Card>
  )
}

