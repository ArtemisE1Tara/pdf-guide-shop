"use client"

import type React from "react"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { createClientSupabaseClient } from "@/lib/supabase"

// The only email allowed to be an admin
const ADMIN_EMAIL = "ahmedsecen@gmail.com"

export function AdminCheck({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    async function checkAdmin() {
      if (!isLoaded || !user) {
        setIsChecking(false)
        return
      }

      // First check if the email matches the allowed admin email
      const userEmail = user.primaryEmailAddress?.emailAddress
      if (userEmail !== ADMIN_EMAIL) {
        setIsAdmin(false)
        setIsChecking(false)
        return
      }

      try {
        const supabase = createClientSupabaseClient()
        const { data } = await supabase.from("admin_users").select("*").eq("clerk_id", user.id).single()

        setIsAdmin(!!data)
      } catch (error) {
        console.error("Error checking admin status:", error)
        setIsAdmin(false)
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
      </div>
    )
  }

  return <>{children}</>
}

