import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, CheckCircle, Download, Star } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase"

// Get featured products for the homepage
async function getFeaturedProducts() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false }).limit(3)

  if (error) {
    console.error("Error fetching featured products:", error)
    return []
  }

  return data || []
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-16 md:py-24 lg:py-32">
          <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge className="inline-flex" variant="outline">
                    Premium Digital Guides
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none xl:text-7xl/none">
                    Knowledge at Your <span className="text-primary">Fingertips</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Expertly crafted PDF guides to help you master new skills, solve problems, and achieve your goals.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/shop">
                    <Button size="lg" className="group">
                      Browse Guides
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="#featured">
                    <Button size="lg" variant="outline">
                      View Featured
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Instant Download</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Expert Content</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Lifetime Access</span>
                  </div>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="absolute -right-16 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"></div>
                <div className="relative z-10 overflow-hidden rounded-xl border bg-background/80 shadow-xl backdrop-blur-sm">
                  <div className="aspect-[4/5] relative">
                    <Image
                      src="/placeholder.svg?height=800&width=600"
                      alt="PDF Guide Preview"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-background/0 p-6">
                    <div className="space-y-2">
                      <h3 className="font-bold">Ultimate Guide to Digital Marketing</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                            ))}
                        </div>
                        <span className="text-sm text-muted-foreground">5.0 (120 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/50 py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose Our Guides?</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Our PDF guides are meticulously researched and designed to provide you with the most comprehensive
                  information.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
              <div className="group relative overflow-hidden rounded-lg border bg-background p-8 shadow-sm transition-all hover:shadow-md">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Expert Knowledge</h3>
                  <p className="text-muted-foreground">
                    Written by professionals with years of experience in their fields, ensuring you get accurate and
                    valuable information.
                  </p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-8 shadow-sm transition-all hover:shadow-md">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Digital Convenience</h3>
                  <p className="text-muted-foreground">
                    Instant download and access on any device, anywhere, anytime. No waiting for shipping or physical
                    storage needed.
                  </p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-8 shadow-sm transition-all hover:shadow-md">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Comprehensive Content</h3>
                  <p className="text-muted-foreground">
                    Detailed explanations, illustrations, and practical examples that make complex topics easy to
                    understand.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <section id="featured" className="py-16 md:py-24">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Guides</h2>
                  <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                    Our most popular and highly-rated PDF guides to get you started.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
                {featuredProducts.map((product) => (
                  <Link key={product.id} href={`/shop/${product.id}`} className="group">
                    <div className="relative overflow-hidden rounded-xl border bg-background shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                      <div className="aspect-[4/3] relative">
                        <Image
                          src={product.thumbnail_url || `/placeholder.svg?height=300&width=400`}
                          alt={product.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="mb-2 text-xl font-bold">{product.title}</h3>
                        <p className="mb-4 line-clamp-2 text-muted-foreground">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold">${(product.price / 100).toFixed(2)}</span>
                          <Button variant="ghost" size="sm" className="group/btn">
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="flex justify-center">
                <Link href="/shop">
                  <Button variant="outline" size="lg">
                    View All Guides
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Testimonials Section */}
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Customers Say</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Don't just take our word for it. Here's what people who have purchased our guides have to say.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border bg-background p-6 shadow-sm">
                  <div className="flex mb-4">
                    {Array(5)
                      .fill(0)
                      .map((_, j) => (
                        <Star key={j} className="h-5 w-5 fill-primary text-primary" />
                      ))}
                  </div>
                  <p className="mb-4 italic text-muted-foreground">
                    "This guide was exactly what I needed. The content is well-structured, easy to follow, and has
                    already helped me improve my skills significantly."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted"></div>
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">Marketing Professional</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-primary py-16 md:py-24">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
          <div className="container relative z-10 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl md:text-5xl">
                  Ready to Expand Your Knowledge?
                </h2>
                <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
                  Browse our collection of premium PDF guides and start learning today.
                </p>
              </div>
              <Link href="/shop">
                <Button size="lg" variant="secondary" className="group">
                  Explore All Guides
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
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

