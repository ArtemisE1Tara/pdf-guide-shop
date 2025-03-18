"use client"

import type React from "react"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { createClientSupabaseClient } from "@/lib/supabase"
import { Button } from "./ui/button"
import { useToast } from "@/hooks/use-toast"

export function AdminCheck({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function checkAdmin() {
      if (!isLoaded || !user) {
        setIsChecking(false)
        return
      }

      try {
        const supabase = createClientSupabaseClient()
        const { data, error } = await supabase.from("admin_users").select("*").eq("clerk_id", user.id).single()

        if (error) {
          console.error("Error checking admin status:", error)
          setDebugInfo({
            clerkUserId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            error: error.message,
            adminEmail: "Check ADMIN_EMAIL in .env",
          })
        } else {
          setDebugInfo({
            clerkUserId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            isAdmin: !!data,
            adminFound: data ? "Yes in admin_users table" : "No - not in admin_users table",
          })
        }

        setIsAdmin(!!data)
      } catch (error) {
        console.error("Error checking admin status:", error)
        setDebugInfo({
          error: "Exception occurred",
          details: error instanceof Error ? error.message : String(error),
        })
      } finally {
        setIsChecking(false)
      }
    }

    checkAdmin()
  }, [user, isLoaded])

  // Force admin check manually
  const forceAdminCreation = async () => {
    if (!user) return

    try {
      const supabase = createClientSupabaseClient()
      const { error } = await supabase.from("admin_users").insert({
        clerk_id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
      })

      if (error) {
        if (error.code === '23505') { // Unique violation code
          toast({
            title: "Already an admin",
            description: "This user is already in the admin table",
          })
          // Refresh the check
          setIsChecking(true)
          const { data } = await supabase.from("admin_users").select("*").eq("clerk_id", user.id).single()
          setIsAdmin(!!data)
          setIsChecking(false)
          return
        }
        
        toast({
          title: "Error creating admin",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Admin access granted. Refresh the page.",
      })
      setIsAdmin(true)
    } catch (error) {
      console.error("Error creating admin:", error)
      toast({
        title: "Error",
        description: "Failed to create admin user",
        variant: "destructive",
      })
    }
  }

  if (!isLoaded || isChecking) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-gray-500 dark:text-gray-400">Please sign in to access this page.</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-12">
        <h2 className="text-2xl font-bold">Admin Access Required</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md text-center">
          Your account doesn't have admin privileges. If you think this is a mistake, check if your email matches the ADMIN_EMAIL in your environment variables.
        </p>
        
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900 max-w-lg w-full">
          <h3 className="font-medium mb-2">Debug Information</h3>
          <pre className="text-xs overflow-auto p-2 bg-gray-100 dark:bg-gray-800 rounded">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
        
        <Button onClick={forceAdminCreation}>
          Grant Admin Access Manually
        </Button>
      </div>
    )
  }

  return <>{children}</>
}

