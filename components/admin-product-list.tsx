"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { createClientSupabaseClient } from "@/lib/supabase"
import { useEffect, useState } from "react"
import type { Database } from "@/types/supabase"
import { Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

type Product = Database["public"]["Tables"]["products"]["Row"]

export function AdminProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchProducts() {
      try {
        const supabase = createClientSupabaseClient()
        const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setProducts(data || [])
      } catch (error) {
        console.error("Error fetching products:", error)
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [toast])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const supabase = createClientSupabaseClient()
      const { error } = await supabase.from("products").delete().eq("id", id)

      if (error) throw error

      setProducts(products.filter((product) => product.id !== id))
      toast({
        title: "Success",
        description: "Product deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-gray-500 dark:text-gray-400">No products found</p>
            <Button asChild className="mt-4">
              <Link href="/admin/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Product
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader className="pb-2">
                <CardTitle>{product.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {product.description?.substring(0, 100)}
                      {product.description && product.description.length > 100 ? "..." : ""}
                    </p>
                  </div>
                  <div className="flex items-center justify-between md:justify-end md:space-x-4">
                    <p className="font-bold">{formatPrice(product.price)}</p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/products/${product.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

