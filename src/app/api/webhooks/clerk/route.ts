// app/api/webhooks/clerk/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Read raw body so we can later verify signature if needed
    const rawBody = await req.text();

    // Log raw body and headers so you can inspect them in your server logs
    console.log('--- Clerk webhook received ---');
    console.log('headers:', Object.fromEntries(req.headers));
    console.log('raw body:', rawBody);
    console.log('------------------------------');

    // parse JSON if you want to inspect the event now
    try {
      const payload = JSON.parse(rawBody);
      console.log('parsed payload:', payload);
    } catch (err) {
      console.warn('Webhook payload is not valid JSON or could not be parsed');
    }

    // Return 200 quickly so Clerk marks the delivery succeeded
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Webhook handler error', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
