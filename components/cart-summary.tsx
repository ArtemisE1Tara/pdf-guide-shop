"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"
import { useEffect, useState } from "react"

export function CartSummary() {
  const { items } = useCart()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const subtotal = items.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)

  // This will be replaced with actual tax calculation when Stripe is integrated
  const tax = subtotal * 0.1 // 10% tax for example
  const total = subtotal + tax

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (estimated)</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="lg" disabled={items.length === 0}>
          Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  )
}

