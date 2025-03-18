"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/types/supabase"
import { ShoppingCart } from "lucide-react"
import { useState } from "react"

type Product = Database["public"]["Tables"]["products"]["Row"]

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)

    // Simulate a small delay for better UX
    setTimeout(() => {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
      })

      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      })

      setIsAdding(false)
    }, 500)
  }

  return (
    <Button onClick={handleAddToCart} size="lg" className="w-full group" disabled={isAdding}>
      {isAdding ? (
        <>
          Adding to Cart...
          <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </>
      )}
    </Button>
  )
}

