import { SiteHeader } from "@/components/site-header"
import { Card, CardContent } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const revalidate = 3600 // Revalidate every hour

async function getProducts() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data || []
}

// Categories for demonstration - in a real app, these would come from your database
const categories = ["All", "Business", "Technology", "Design", "Marketing", "Personal Development"]

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted/30 py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Browse Our PDF Guides</h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Discover our collection of expertly crafted guides to help you master new skills.
                </p>
              </div>
              <div className="w-full max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search guides..." className="pl-10" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col gap-8 md:flex-row">
              {/* Sidebar Filters */}
              <div className="w-full md:w-64 shrink-0">
                <div className="sticky top-20 rounded-lg border bg-background p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-semibold">Filters</h3>
                    <Filter className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="space-y-6">
                    {/* Categories */}
                    <div>
                      <h4 className="mb-3 text-sm font-medium">Categories</h4>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center">
                            <Button variant="ghost" className="h-auto justify-start px-2 py-1 text-sm font-normal">
                              {category}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <h4 className="mb-3 text-sm font-medium">Price Range</h4>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-md border">
                            <Input type="number" placeholder="Min" className="border-0" />
                          </div>
                          <div className="rounded-md border">
                            <Input type="number" placeholder="Max" className="border-0" />
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="flex-1">
                <Tabs defaultValue="grid" className="mb-8">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing <span className="font-medium text-foreground">{products.length}</span> results
                    </div>
                    <TabsList>
                      <TabsTrigger value="grid">Grid</TabsTrigger>
                      <TabsTrigger value="list">List</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="grid" className="mt-6">
                    {products.length === 0 ? (
                      <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border bg-background p-12 text-center">
                        <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold">No guides available yet</h3>
                          <p className="text-muted-foreground">
                            Check back soon for our upcoming collection of PDF guides.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                          <Link key={product.id} href={`/shop/${product.id}`} className="group">
                            <Card className="overflow-hidden transition-all hover:shadow-md">
                              <div className="aspect-[4/3] relative">
                                <Image
                                  src={product.thumbnail_url || `/placeholder.svg?height=300&width=400`}
                                  alt={product.title}
                                  fill
                                  className="object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute right-2 top-2">
                                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                                    ${(product.price / 100).toFixed(2)}
                                  </Badge>
                                </div>
                              </div>
                              <CardContent className="p-6">
                                <h3 className="mb-2 line-clamp-1 text-lg font-bold">{product.title}</h3>
                                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                                <Button variant="outline" size="sm" className="w-full group/btn">
                                  View Details
                                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                </Button>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="list" className="mt-6">
                    {products.length === 0 ? (
                      <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border bg-background p-12 text-center">
                        <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold">No guides available yet</h3>
                          <p className="text-muted-foreground">
                            Check back soon for our upcoming collection of PDF guides.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {products.map((product) => (
                          <Link key={product.id} href={`/shop/${product.id}`} className="group">
                            <Card className="overflow-hidden transition-all hover:shadow-md">
                              <div className="flex flex-col sm:flex-row">
                                <div className="aspect-[4/3] relative w-full sm:w-48 shrink-0">
                                  <Image
                                    src={product.thumbnail_url || `/placeholder.svg?height=300&width=400`}
                                    alt={product.title}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                  />
                                </div>
                                <CardContent className="flex flex-1 flex-col justify-between p-6">
                                  <div>
                                    <h3 className="mb-2 text-lg font-bold">{product.title}</h3>
                                    <p className="mb-4 text-sm text-muted-foreground">{product.description}</p>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold">${(product.price / 100).toFixed(2)}</span>
                                    <Button variant="outline" size="sm" className="group/btn">
                                      View Details
                                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </div>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>
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

