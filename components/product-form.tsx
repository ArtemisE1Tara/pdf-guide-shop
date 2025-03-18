"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClientSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, FileImage, FileText, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
    <Card className="border-2">
      <CardHeader className="bg-muted/50">
        <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="details"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Product Details
            </TabsTrigger>
            <TabsTrigger
              value="media"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Media
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="details" className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter product title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className="pl-8"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="media" className="pt-6 space-y-6">
              <Alert variant="default" className="bg-muted/50">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Media Files</AlertTitle>
                <AlertDescription>
                  Upload your PDF and thumbnail image to a storage service and paste the URLs below.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="pdf_url" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDF URL
                </Label>
                <Input
                  id="pdf_url"
                  name="pdf_url"
                  type="url"
                  value={formData.pdf_url}
                  onChange={handleChange}
                  placeholder="https://example.com/your-guide.pdf"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail_url" className="flex items-center gap-2">
                  <FileImage className="h-4 w-4" />
                  Thumbnail URL
                </Label>
                <Input
                  id="thumbnail_url"
                  name="thumbnail_url"
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={handleChange}
                  placeholder="https://example.com/your-thumbnail.jpg"
                />
                <div className="mt-4">
                  {formData.thumbnail_url && (
                    <div className="rounded-md border overflow-hidden w-40 h-40 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.thumbnail_url || "/placeholder.svg"}
                        alt="Thumbnail preview"
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=160&width=160&text=Invalid Image URL"
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-dashed p-8 text-center">
                <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center gap-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">Upload feature coming soon</h3>
                  <p className="text-sm text-muted-foreground">
                    Direct file uploads will be available in a future update.
                  </p>
                </div>
              </div>
            </TabsContent>

            <div className="flex justify-end space-x-4 mt-8">
              <Button type="button" variant="outline" onClick={() => router.push("/admin")} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="min-w-[120px]">
                {loading ? (
                  <>
                    <span className="mr-2">{product ? "Updating..." : "Creating..."}</span>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  </>
                ) : product ? (
                  "Update Product"
                ) : (
                  "Create Product"
                )}
              </Button>
            </div>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  )
}

