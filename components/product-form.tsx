"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClientSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

type Product = Database["public"]["Tables"]["products"]["Row"]

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: product?.title || "",
    description: product?.description || "",
    price: product?.price ? (product.price / 100).toFixed(2) : "",
    pdf_url: product?.pdf_url || "",
    thumbnail_url: product?.thumbnail_url || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClientSupabaseClient()

      // Convert price to cents for storage
      const priceInCents = Math.round(Number.parseFloat(formData.price) * 100)

      if (product) {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update({
            title: formData.title,
            description: formData.description,
            price: priceInCents,
            pdf_url: formData.pdf_url,
            thumbnail_url: formData.thumbnail_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", product.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Product updated successfully",
        })
      } else {
        // Create new product
        const { error } = await supabase.from("products").insert({
          title: formData.title,
          description: formData.description,
          price: priceInCents,
          pdf_url: formData.pdf_url,
          thumbnail_url: formData.thumbnail_url,
        })

        if (error) throw error

        toast({
          title: "Success",
          description: "Product created successfully",
        })
      }

      // Redirect to admin page
      router.push("/admin")
      router.refresh()
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdf_url">PDF URL</Label>
            <Input
              id="pdf_url"
              name="pdf_url"
              type="url"
              value={formData.pdf_url}
              onChange={handleChange}
              placeholder="URL to your PDF file"
            />
            <p className="text-sm text-gray-500">Upload your PDF to a storage service and paste the URL here</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
            <Input
              id="thumbnail_url"
              name="thumbnail_url"
              type="url"
              value={formData.thumbnail_url}
              onChange={handleChange}
              placeholder="URL to your thumbnail image"
            />
            <p className="text-sm text-gray-500">
              Upload a thumbnail image to a storage service and paste the URL here
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin")} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

