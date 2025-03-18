import { SiteHeader } from "@/components/site-header"
import { AdminCheck } from "@/components/admin-check"
import { ProductForm } from "@/components/product-form"
import { createServerSupabaseClient } from "@/lib/supabase"
import { notFound } from "next/navigation"

export const revalidate = 0 // Don't cache this page

async function getProduct(id: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error || !data) {
    console.error("Error fetching product:", error)
    return null
  }

  return data
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <AdminCheck>
          <section className="w-full py-12">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter">Edit Products</h1>
                <ProductForm product={product} />
              </div>
            </div>
          </section>
        </AdminCheck>
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

