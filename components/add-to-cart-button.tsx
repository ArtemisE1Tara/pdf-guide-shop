"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/types/supabase"

type Product = Database["public"]["Tables"]["products"]["Row"]

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
    })

    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    })
  }

  return (
    <Button onClick={handleAddToCart} size="lg">
      Add to Cart
    </Button>
  )
}

