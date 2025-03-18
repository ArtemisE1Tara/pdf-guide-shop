import { SiteHeader } from "@/components/site-header"
import { AdminCheck } from "@/components/admin-check"
import { AdminProductList } from "@/components/admin-product-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, DollarSign, Package, Users } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <AdminCheck>
          <div className="bg-muted/30 py-6">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage your products and view store statistics.</p>
              </div>
            </div>
          </div>
          <section className="py-12">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$1,234.56</div>
                    <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">+2 added this month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">42</div>
                    <p className="text-xs text-muted-foreground">+18.2% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Customers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">36</div>
                    <p className="text-xs text-muted-foreground">+8 new customers</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12">
                <Tabs defaultValue="products" className="w-full">
                  <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                    <TabsTrigger
                      value="products"
                      className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Products
                    </TabsTrigger>
                    <TabsTrigger
                      value="orders"
                      className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Orders
                    </TabsTrigger>
                    <TabsTrigger
                      value="customers"
                      className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Customers
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="products" className="pt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Product Management</CardTitle>
                        <CardDescription>Add, edit, or remove products from your store.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <AdminProductList />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="orders" className="pt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Order Management</CardTitle>
                        <CardDescription>View and manage customer orders.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-lg border bg-muted/50 p-8 text-center">
                          <p className="text-muted-foreground">Order management coming soon.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="customers" className="pt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Customer Management</CardTitle>
                        <CardDescription>View and manage customer accounts.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-lg border bg-muted/50 p-8 text-center">
                          <p className="text-muted-foreground">Customer management coming soon.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </section>
        </AdminCheck>
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
        </div>
      </footer>
    </div>
  )
}

