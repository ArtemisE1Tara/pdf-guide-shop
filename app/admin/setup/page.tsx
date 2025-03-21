"use client"

import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { createClientSupabaseClient } from "@/lib/supabase"

// The admin email - make it case insensitive
const ADMIN_EMAIL = "ahmedsecen2@gmail.com".toLowerCase()

export default function AdminSetupPage() {
  const { user, isLoaded } = useUser()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [adminEmail, setAdminEmail] = useState("")
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const handleSetupAdmin = async () => {
    if (!user) {
      toast({
        title: "Not signed in",
        description: "You need to be signed in to set up an admin account",
        variant: "destructive",
      })
      return
    }

    const userEmail = (user.primaryEmailAddress?.emailAddress || "").toLowerCase().trim()

    // Collect debug info
    const debug = {
      userEmail,
      adminEmail: ADMIN_EMAIL,
      isMatch: userEmail === ADMIN_EMAIL,
      userId: user.id,
    }
    setDebugInfo(debug)

    // Check if the email matches the allowed admin email
    if (userEmail !== ADMIN_EMAIL) {
      toast({
        title: "Unauthorized",
        description: `Only the site owner (${ADMIN_EMAIL}) can be set as an admin. Your email: ${userEmail}`,
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const supabase = createClientSupabaseClient()

      // Check if admin already exists
      const { data: existingAdmin, error: checkError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("clerk_id", user.id)
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 is the error code for "no rows returned" which is expected
        throw checkError
      }

      if (existingAdmin) {
        toast({
          title: "Already an admin",
          description: "Your account is already set up as an admin",
        })
        return
      }

      // Add to admin_users table
      const { error } = await supabase.from("admin_users").insert({
        clerk_id: user.id,
        email: userEmail,
      })

      if (error) throw error

      toast({
        title: "Admin setup complete",
        description: "Your account has been set up as an admin",
      })
    } catch (error) {
      console.error("Error setting up admin:", error)
      toast({
        title: "Error",
        description: "Failed to set up admin account. See console for details.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 py-12">
          <div className="container px-4 md:px-6">
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <h2 className="text-2xl font-bold">Sign In Required</h2>
              <p className="text-gray-500 dark:text-gray-400">Please sign in to set up an admin account</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const userEmail = user.primaryEmailAddress?.emailAddress || ""

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-md space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter">Admin Setup</h1>
              <p className="text-gray-500 dark:text-gray-400">Set up your account as an admin without using webhooks</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Local Admin Setup</CardTitle>
                <CardDescription>This is a direct way to set up an admin account for local development</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Your Email</Label>
                  <Input id="admin-email" value={userEmail} readOnly className="bg-muted" />
                  <p className="text-sm text-gray-500">
                    {userEmail.toLowerCase() === ADMIN_EMAIL
                      ? "✅ Your email matches the admin email"
                      : "❌ Your email does not match the admin email"}
                  </p>
                </div>

                <div className="rounded-md bg-amber-50 p-4 dark:bg-amber-950">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Note</h3>
                      <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                        <p>
                          This is a development utility for local testing. In production, admin users should be added
                          through the Clerk webhook.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSetupAdmin} disabled={loading} className="w-full">
                  {loading ? "Setting up..." : "Set Up Admin Account"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current User Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">User ID:</span>
                    <span className="text-gray-500">{user.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span className="text-gray-500">{userEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Admin Email:</span>
                    <span className="text-gray-500">{ADMIN_EMAIL}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {debugInfo && (
              <Card>
                <CardHeader>
                  <CardTitle>Debug Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

