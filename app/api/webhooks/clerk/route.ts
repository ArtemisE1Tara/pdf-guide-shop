import { Webhook } from "svix"
import { headers } from "next/headers"
import type { WebhookEvent } from "@clerk/nextjs/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// The only email allowed to be an admin - make it case insensitive
const ADMIN_EMAIL = "ahmedsecen2@gmail.com".toLowerCase()

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "")

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error: Invalid webhook signature", {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses } = evt.data

    // Check if this is the admin user by comparing with the hardcoded email (case insensitive)
    const isAdmin = email_addresses.some((email) => email.email_address.toLowerCase().trim() === ADMIN_EMAIL)

    if (isAdmin) {
      try {
        const supabase = createServerSupabaseClient()

        // Check if admin already exists
        const { data: existingAdmin } = await supabase.from("admin_users").select("*").eq("clerk_id", id).single()

        if (!existingAdmin) {
          // Add to admin_users table
          await supabase.from("admin_users").insert({
            clerk_id: id,
            email: email_addresses[0].email_address,
          })
        }
      } catch (error) {
        console.error("Error updating admin user:", error)
        return new Response("Error processing webhook", {
          status: 500,
        })
      }
    }
  }

  return new Response("Webhook processed successfully", {
    status: 200,
  })
}

