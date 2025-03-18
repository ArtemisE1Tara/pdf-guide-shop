import { SiteHeader } from "@/components/site-header"
import { CartItems } from "@/components/cart-items"
import { CartSummary } from "@/components/cart-summary"
import { BookOpen, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-muted/30 py-8">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Your Cart</h1>
              <p className="text-muted-foreground">Review and checkout your selected PDF guides.</p>
            </div>
          </div>
        </section>
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <CartItems />
              </div>
              <div>
                <CartSummary />
                <div className="mt-6 rounded-lg border bg-muted/30 p-6">
                  <h3 className="mb-4 font-medium">Need Help?</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-2">
                      <ShoppingBag className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        All purchases are digital downloads. You'll receive an email with download instructions after
                        checkout.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <BookOpen className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Our PDF guides are compatible with all devices and include lifetime access to updates.
                      </p>
                    </div>
                  </div>
                </div>
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

