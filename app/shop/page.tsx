import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { createServerSupabaseClient } from "@/lib/supabase"
import Link from "next/link"
import Image from "next/image"

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

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Browse Our PDF Guides</h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Discover our collection of expertly crafted guides to help you master new skills.
                </p>
              </div>
            </div>
            {products.length === 0 ? (
              <div className="mt-16 flex flex-col items-center justify-center space-y-4 text-center">
                <p className="text-lg text-gray-500 dark:text-gray-400">No guides available yet. Check back soon!</p>
              </div>
            ) : (
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <Link key={product.id} href={`/shop/${product.id}`}>
                    <Card className="overflow-hidden transition-all hover:shadow-lg">
                      <div className="aspect-[4/3] relative">
                        <Image
                          src={product.thumbnail_url || `/placeholder.svg?height=300&width=400`}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle>{product.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{product.description}</p>
                      </CardContent>
                      <CardFooter>
                        <p className="font-bold">{formatPrice(product.price)}</p>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <p className="text-center text-sm leading-loose text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} PDF Guide Shop. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

