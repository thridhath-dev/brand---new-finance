import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const startTime = Date.now();
  console.log("Webhook received:", new Date().toISOString());
  
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
      return new NextResponse("Missing CLERK_WEBHOOK_SECRET", { status: 500 });
    }

  // Verify the incoming webhook
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");
  
  console.log("Headers:", { svix_id, svix_timestamp, svix_signature: svix_signature?.substring(0, 20) + "..." });
  
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing Svix headers");
    return new NextResponse("Missing Svix headers", { status: 400 });
  }

  const payload = await req.text();
  console.log("Payload received, length:", payload.length);
  
  if (!payload) {
    console.error("Empty payload received");
    return new NextResponse("Empty payload", { status: 400 });
  }
  
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
    console.log("Webhook verified successfully, event type:", evt.type);
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const { type, data } = evt;
  console.log("Processing event:", type, "User ID:", data.id);
  console.log("Full event data:", JSON.stringify(evt, null, 2));

  try {
    if (type === "user.created" || type === "user.updated") {
      const clerkId = data.id as string;
      
      // Handle different possible email structures
      let email: string | null = null;
      if (data.email_addresses && Array.isArray(data.email_addresses) && data.email_addresses.length > 0) {
        email = data.email_addresses[0].email_address || null;
      } else if (data.email_address) {
        email = data.email_address;
      } else if (data.email) {
        email = data.email;
      }
      
      const firstName = (data.first_name ?? null) as string | null;
      const lastName = (data.last_name ?? null) as string | null;
      const imageUrl = (data.image_url ?? null) as string | null;

      console.log("User data:", { clerkId, email, firstName, lastName });
      console.log("Email addresses array:", data.email_addresses);
      console.log("Event type:", type);
      console.log("Raw data keys:", Object.keys(data));

      // Use upsert for both user.created and user.updated to handle duplicates
      console.log(`Processing ${type} event for user:`, clerkId);
      const userData: any = { 
        clerkId, 
        firstName, 
        lastName, 
        imageUrl
      };
      if (email && email.trim() !== "") {
        userData.email = email;
      }
      
      const result = await prisma.user.upsert({
        where: { clerkId },
        update: userData,
        create: userData,
      });
      
      if (type === "user.created") {
        console.log("User created/upserted successfully:", result.id);
      } else {
        console.log("User updated/upserted successfully:", result.id);
      }
    }

    if (type === "user.deleted") {
      const clerkId = data.id as string;
      console.log("Deleting user:", clerkId);
      
      const result = await prisma.user.deleteMany({ where: { clerkId } });
      console.log("User deleted:", result.count, "records");
    }
  } catch (err) {
    console.error("Database error:", err);
    console.error("Error details:", {
      message: typeof err === "object" && err !== null && "message" in err ? (err as any).message : String(err),
      code: typeof err === "object" && err !== null && "code" in err ? (err as any).code : undefined,
      meta: typeof err === "object" && err !== null && "meta" in err ? (err as any).meta : undefined,
      stack: typeof err === "object" && err !== null && "stack" in err ? (err as any).stack : undefined
    });
    return NextResponse.json({ 
      error: "Database operation failed", 
      details: typeof err === "object" && err !== null && "message" in err ? (err as any).message : String(err),
      code: typeof err === "object" && err !== null && "code" in err ? (err as any).code : undefined,
      meta: typeof err === "object" && err !== null && "meta" in err ? (err as any).meta : undefined
    }, { status: 500 });
  }

    const processingTime = Date.now() - startTime;
    console.log(`Webhook processed successfully in ${processingTime}ms`);
    return NextResponse.json({ 
      ok: true, 
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error("Webhook processing failed:", error);
    console.error(`Processing time: ${processingTime}ms`);
    
    return NextResponse.json({
      error: "Webhook processing failed",
      message: error.message,
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
