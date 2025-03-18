import { Webhook } from "svix"
import { headers } from "next/headers"
import type { WebhookEvent } from "@clerk/nextjs/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(req: Request) {
  console.log("Webhook received from Clerk")
  
  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing svix headers")
    return new Response("Error: Missing svix headers", {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your webhook secret
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ""
  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET is not defined")
    return new Response("Error: Webhook secret not configured", {
      status: 500,
    })
  }
  
  const wh = new Webhook(webhookSecret)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
    console.log("Webhook verified successfully, event type:", evt.type)
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
    console.log("Processing user event for user ID:", id)
    console.log("User emails:", email_addresses.map(email => email.email_address))
    
    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail) {
      console.error("ADMIN_EMAIL is not defined in environment variables")
      return new Response("Error: Admin email not configured", {
        status: 500,
      })
    }

    // Check if this is the admin user
    const isAdmin = email_addresses.some((email) => email.email_address === adminEmail)
    console.log("Admin email from env:", adminEmail)
    console.log("Is admin user:", isAdmin)

    if (isAdmin) {
      try {
        const supabase = createServerSupabaseClient()
        console.log("Checking if admin already exists in database")

        // Check if admin already exists
        const { data: existingAdmin, error: queryError } = await supabase
          .from("admin_users")
          .select("*")
          .eq("clerk_id", id)
          .single()

        if (queryError && queryError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          console.error("Error checking for existing admin:", queryError)
          return new Response("Error checking for existing admin", {
            status: 500,
          })
        }

        if (existingAdmin) {
          console.log("Admin already exists in database, skipping insert")
        } else {
          console.log("Adding new admin to database")
          // Add to admin_users table
          const { error: insertError } = await supabase.from("admin_users").insert({
            clerk_id: id,
            email: email_addresses[0].email_address,
          })

          if (insertError) {
            console.error("Error inserting admin user:", insertError)
            return new Response("Error adding admin user to database", {
              status: 500,
            })
          }
          console.log("Admin added successfully")
        }
      } catch (error) {
        console.error("Exception when updating admin user:", error)
        return new Response("Error processing webhook", {
          status: 500,
        })
      }
    }
  }

  return new Response(JSON.stringify({ success: true, event: evt.type }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

