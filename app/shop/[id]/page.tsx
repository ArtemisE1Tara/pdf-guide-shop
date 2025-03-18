import { SiteHeader } from "@/components/site-header"
import { formatPrice } from "@/lib/utils"
import { createServerSupabaseClient } from "@/lib/supabase"
import { notFound } from "next/navigation"
import Image from "next/image"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, CheckCircle, FileText, Share2, Star } from "lucide-react"
import Link from "next/link"

export const revalidate = 3600 // Revalidate every hour

async function getProduct(id: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error || !data) {
    console.error("Error fetching product:", error)
    return null
  }

  return data
}

async function getRelatedProducts(currentProductId: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("products").select("*").neq("id", currentProductId).limit(3)

  if (error) {
    console.error("Error fetching related products:", error)
    return []
  }

  return data || []
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.id)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Product Hero Section */}
        <section className="bg-muted/30 py-12">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              {/* Product Image */}
              <div className="flex flex-col space-y-4">
                <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={product.thumbnail_url || `/placeholder.svg?height=600&width=800`}
                      alt={product.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="overflow-hidden rounded-md border bg-background">
                      <div className="aspect-[4/3] relative">
                        <Image
                          src={`/placeholder.svg?height=150&width=200&text=Preview ${i}`}
                          alt={`${product.title} preview ${i}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div className="flex flex-col justify-between space-y-8">
                <div className="space-y-4">
                  <div>
                    <Badge variant="outline" className="mb-2">
                      PDF Guide
                    </Badge>
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{product.title}</h1>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                      </div>
                      <span className="text-sm text-muted-foreground">5.0 (24 reviews)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
                    <Badge variant="secondary" className="text-sm">
                      Digital Download
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{product.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Instant digital delivery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>High-quality PDF format</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Lifetime access to updates</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <AddToCartButton product={product} />
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      Preview Sample
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Details Tabs */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="pt-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">About This Guide</h2>
                  <p>{product.description || "No description available."}</p>
                  <p>
                    This comprehensive guide is designed to provide you with in-depth knowledge and practical insights.
                    Whether you're a beginner looking to learn the basics or an experienced individual seeking to
                    enhance your skills, this guide offers valuable information for all levels.
                  </p>
                  <h3 className="text-xl font-bold">What You'll Learn</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Fundamental concepts and principles</li>
                    <li>Advanced techniques and strategies</li>
                    <li>Practical applications and real-world examples</li>
                    <li>Tips and tricks from industry experts</li>
                    <li>Common pitfalls to avoid and how to overcome challenges</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="details" className="pt-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Product Details</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Format</h3>
                      <p>PDF (Portable Document Format)</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Pages</h3>
                      <p>120+</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Language</h3>
                      <p>English</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Last Updated</h3>
                      <p>{new Date(product.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="pt-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Customer Reviews</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                        ))}
                    </div>
                    <span className="text-lg font-medium">5.0 out of 5</span>
                    <span className="text-muted-foreground">(24 reviews)</span>
                  </div>
                  <div className="space-y-6 mt-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border-b pb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {Array(5)
                              .fill(0)
                              .map((_, j) => (
                                <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                              ))}
                          </div>
                          <span className="font-medium">Excellent resource!</span>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          This guide exceeded my expectations. The content is well-structured and easy to follow. I've
                          already implemented several of the strategies and seen positive results.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="font-medium">John Doe</span>
                          <span>•</span>
                          <span>Verified Purchase</span>
                          <span>•</span>
                          <span>2 weeks ago</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="bg-muted/30 py-12">
            <div className="container px-4 md:px-6">
              <h2 className="mb-8 text-2xl font-bold tracking-tighter sm:text-3xl">You May Also Like</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.map((relatedProduct) => (
                  <Link key={relatedProduct.id} href={`/shop/${relatedProduct.id}`} className="group">
                    <div className="overflow-hidden rounded-xl border bg-background shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                      <div className="aspect-[4/3] relative">
                        <Image
                          src={relatedProduct.thumbnail_url || `/placeholder.svg?height=300&width=400`}
                          alt={relatedProduct.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="mb-2 line-clamp-1 text-lg font-bold">{relatedProduct.title}</h3>
                        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{relatedProduct.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{formatPrice(relatedProduct.price)}</span>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <footer className="border-t bg-muted/30 py-6 md:py-10">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <span className="text-lg font-bold">PDF Guide Shop</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PDF Guide Shop. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

