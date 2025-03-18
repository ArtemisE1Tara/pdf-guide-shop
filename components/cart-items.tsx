"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"
import { Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

export function CartItems() {
  const { items, removeItem, updateQuantity } = useCart()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="flex justify-center py-12">Loading cart...</div>
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <p className="text-lg text-gray-500 dark:text-gray-400">Your cart is empty</p>
        <Button asChild>
          <a href="/shop">Browse Guides</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between space-x-4 rounded-lg border p-4">
          <div className="flex-1 space-y-1">
            <h3 className="font-medium">{item.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formatPrice(item.price)} each</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                className="w-16 text-center"
              />
            </div>
            <div className="text-right">
              <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${item.title} from cart`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

