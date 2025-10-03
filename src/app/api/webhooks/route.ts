// app/api/webhooks/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '../../../lib/prisma'; // uncomment if you want to upsert

function safeGetEmailFromPayload(evt: any): string | null {
  // Try multiple likely paths that Clerk or other providers might use.
  // Inspect your logged payload and add paths if needed.
  try {
    // common Clerk-ish shapes:
    // 1) evt.data.email_addresses[0].email_address
    if (evt?.data?.email_addresses?.[0]?.email_address) {
      return evt.data.email_addresses[0].email_address;
    }
    // 2) evt.data.primary_email_address.email_address
    if (evt?.data?.primary_email_address?.email_address) {
      return evt.data.primary_email_address.email_address;
    }
    // 3) evt.data.email (some libs)
    if (evt?.data?.email) {
      return evt.data.email;
    }
    // 4) evt.data.attributes?.email (if wrapped under attributes)
    if (evt?.data?.attributes?.email) {
      return evt.data.attributes.email;
    }
    // 5) evt.data?.emails[0]?.address (other variants)
    if (evt?.data?.emails?.[0]?.address) {
      return evt.data.emails[0].address;
    }
    // 6) evt.data?.user?.email or evt?.data?.user?.email_address
    if (evt?.data?.user?.email) return evt.data.user.email;
    if (evt?.data?.user?.email_address) return evt.data.user.email_address;

    // If Clerk includes a top-level "email" or "email_address"
    if (evt?.email) return evt.email;
    if (evt?.email_address) return evt.email_address;

    return null;
  } catch (err) {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const raw = await req.text(); // keep raw for signature verification later
    // Log raw for debugging (you can remove later)
    console.log('--- webhook headers ---');
    for (const [k, v] of req.headers.entries()) {
      console.log(k + ':', v);
    }
    console.log('--- raw webhook body ---');
    console.log(raw);

    let payload: any = null;
    try {
      payload = JSON.parse(raw);
    } catch (err) {
      // Not JSON? return bad request so Clerk shows it failed
      console.warn('Webhook payload is not valid JSON');
      return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
    }

    // Inspect payload quickly in logs
    console.log('parsed payload:', JSON.stringify(payload, null, 2));

    // Try to extract email safely
    const email = safeGetEmailFromPayload(payload);

    if (!email) {
      console.warn('Could not find an email in webhook payload. Paths attempted.');
      // Return 200 if you want Clerk mark it delivered anyway; return 400 to mark failed.
      // For debugging return 200 but include payload info — Clerk will treat as success.
      return NextResponse.json({
        ok: false,
        message: 'no_email_found',
        // optionally echo some payload info for debugging
        detectedShape: {
          topKeys: Object.keys(payload ?? {}),
        },
      }, { status: 200 });
    }

    console.log('Detected email from webhook payload:', email);

    // OPTIONAL: upsert into your DB (uncomment and adapt to your schema)
    
    const clerkId = payload?.data?.id ?? payload?.data?.user?.id ?? null;
    if (clerkId) {
      await prisma.user.upsert({
        where: { clerkId },
        update: {
          email,
          firstName: payload?.data?.first_name ?? payload?.data?.firstName ?? null,
          lastName: payload?.data?.last_name ?? payload?.data?.lastName ?? null,
        },
        create: {
          clerkId,
          email,
          firstName: payload?.data?.first_name ?? payload?.data?.firstName ?? null,
          lastName: payload?.data?.last_name ?? payload?.data?.lastName ?? null,
        },
      });
    }
  

    // Return 200 so Clerk marks the delivery successful
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
