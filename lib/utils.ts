import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

export async function isAdmin(userId: string) {
  const { createServerSupabaseClient } = await import("@/lib/supabase")
  const supabase = createServerSupabaseClient()

  const { data } = await supabase.from("admin_users").select("*").eq("clerk_id", userId).single()

  return !!data
}

