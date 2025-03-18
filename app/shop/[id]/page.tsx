import { SiteHeader } from "@/components/site-header"
import { formatPrice } from "@/lib/utils"
import { createServerSupabaseClient } from "@/lib/supabase"
import { notFound } from "next/navigation"
import Image from "next/image"
import { AddToCartButton } from "@/components/add-to-cart-button"

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

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="aspect-[4/3] relative overflow-hidden rounded-lg">
                  <Image
                    src={product.thumbnail_url || `/placeholder.svg?height=600&width=800`}
                    alt={product.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">{product.title}</h1>
                  <p className="text-2xl font-bold">{formatPrice(product.price)}</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Description</h3>
                    <p className="text-gray-500 dark:text-gray-400">{product.description}</p>
                  </div>
                </div>
                <AddToCartButton product={product} />
              </div>
            </div>
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

