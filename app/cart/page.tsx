import { SiteHeader } from "@/components/site-header"
import { CartItems } from "@/components/cart-items"
import { CartSummary } from "@/components/cart-summary"

export default function CartPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter">Your Cart</h1>
              <div className="grid gap-10 md:grid-cols-2">
                <CartItems />
                <CartSummary />
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

