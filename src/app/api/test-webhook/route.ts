import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      message: 'Webhook test endpoint is working',
      databaseConnected: true,
      userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Webhook test error:', error);
    return NextResponse.json({
      message: 'Webhook test failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simulate a webhook payload
    const testPayload = {
      type: 'user.created',
      data: {
        id: 'test_user_' + Date.now(),
        email_addresses: [{ email_address: 'test@example.com' }],
        first_name: 'Test',
        last_name: 'User',
        image_url: null
      }
    };

    // Process the test webhook
    const { type, data } = testPayload;
    
    if (type === 'user.created') {
      const clerkId = data.id;
      const email = data.email_addresses?.[0]?.email_address || null;
      const firstName = data.first_name || null;
      const lastName = data.last_name || null;
      const imageUrl = data.image_url || null;

      const user = await prisma.user.create({
        data: {
          clerkId,
          email,
          firstName,
          lastName,
          imageUrl
        }
      });

      return NextResponse.json({
        message: 'Test webhook processed successfully',
        userCreated: user,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      message: 'Test webhook received but not processed',
      payload: testPayload,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test webhook error:', error);
    return NextResponse.json({
      message: 'Test webhook failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
