import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    message: "Webhook test endpoint is working",
    timestamp: new Date().toISOString(),
    environment: {
      hasWebhookSecret: !!process.env.CLERK_WEBHOOK_SECRET,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasClerkSecret: !!process.env.CLERK_SECRET_KEY,
      hasClerkPublishable: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    }
  });
}

export async function POST(req: Request) {
  const body = await req.text();
  const headers = Object.fromEntries(req.headers.entries());
  
  return NextResponse.json({
    message: "Test webhook received",
    timestamp: new Date().toISOString(),
    headers: {
      'content-type': headers['content-type'],
      'user-agent': headers['user-agent'],
      'svix-id': headers['svix-id'],
      'svix-timestamp': headers['svix-timestamp'],
      'svix-signature': headers['svix-signature'] ? 'present' : 'missing'
    },
    bodyLength: body.length,
    bodyPreview: body.substring(0, 200) + (body.length > 200 ? '...' : '')
  });
}
