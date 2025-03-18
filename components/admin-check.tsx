"use client"

import type React from "react"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { createClientSupabaseClient } from "@/lib/supabase"

// The only email allowed to be an admin - make it case insensitive
const ADMIN_EMAIL = "ahmedsecen2@gmail.com".toLowerCase()

export function AdminCheck({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    async function checkAdmin() {
      if (!isLoaded || !user) {
        setIsChecking(false)
        return
      }

      // First check if the email matches the allowed admin email
      const userEmail = (user.primaryEmailAddress?.emailAddress || "").toLowerCase().trim()

      // Collect debug info
      const debug = {
        userEmail,
        adminEmail: ADMIN_EMAIL,
        isMatch: userEmail === ADMIN_EMAIL,
        userId: user.id,
      }
      setDebugInfo(debug)

      if (userEmail !== ADMIN_EMAIL) {
        console.log("Email mismatch:", userEmail, ADMIN_EMAIL)
        setIsAdmin(false)
        setIsChecking(false)
        return
      }

      try {
        const supabase = createClientSupabaseClient()
        const { data, error } = await supabase.from("admin_users").select("*").eq("clerk_id", user.id).single()

        if (error) {
          console.log("Supabase error or no admin record found:", error)
          // If the email matches but there's no record, we'll still allow access
          // This makes it easier during development
          setIsAdmin(true)
        } else {
          console.log("Admin record found:", data)
          setIsAdmin(true)
        }
      } catch (error) {
        console.error("Error checking admin status:", error)
        // If there's an error but the email matches, we'll still allow access
        // This makes it easier during development
        setIsAdmin(true)
      } finally {
        setIsChecking(false)
      }
    }

    checkAdmin()
  }, [user, isLoaded])

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
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <h2 className="text-2xl font-bold">Admin Access Required</h2>
        <p className="text-gray-500 dark:text-gray-400">You do not have permission to access this page.</p>
        {debugInfo && (
          <div className="mt-4 p-4 bg-muted rounded-md max-w-md">
            <h3 className="font-medium mb-2">Debug Information:</h3>
            <pre className="text-xs overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>
    )
  }

  return <>{children}</>
}

