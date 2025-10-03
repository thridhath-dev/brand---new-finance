import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simulate different Clerk webhook events
    const testEvents = [
      {
        type: 'user.created',
        data: {
          id: 'test_clerk_user_' + Date.now(),
          email_addresses: [{ email_address: 'testuser@example.com' }],
          first_name: 'Test',
          last_name: 'User',
          image_url: null
        }
      },
      {
        type: 'user.updated',
        data: {
          id: 'test_clerk_user_' + Date.now(),
          email_addresses: [{ email_address: 'updated@example.com' }],
          first_name: 'Updated',
          last_name: 'User',
          image_url: 'https://example.com/avatar.jpg'
        }
      }
    ];

    const results = [];

    for (const event of testEvents) {
      const { type, data } = event;
      
      if (type === 'user.created' || type === 'user.updated') {
        const clerkId = data.id;
        const email = data.email_addresses?.[0]?.email_address || null;
        const firstName = data.first_name || null;
        const lastName = data.last_name || null;
        const imageUrl = data.image_url || null;

        try {
          const user = await prisma.user.upsert({
            where: { clerkId },
            update: {
              email,
              firstName,
              lastName,
              imageUrl
            },
            create: {
              clerkId,
              email,
              firstName,
              lastName,
              imageUrl
            }
          });

          results.push({
            event: type,
            success: true,
            user: {
              id: user.id,
              clerkId: user.clerkId,
              email: user.email,
              name: `${user.firstName} ${user.lastName}`.trim()
            }
          });
        } catch (error) {
          results.push({
            event: type,
            success: false,
            error: error.message
          });
        }
      }
    }

    return NextResponse.json({
      message: 'Clerk webhook simulation completed',
      results,
      totalUsers: await prisma.user.count(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Clerk webhook test error:', error);
    return NextResponse.json({
      message: 'Clerk webhook test failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        clerkId: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      message: 'Clerk webhook test endpoint ready',
      currentUsers: userCount,
      recentUsers,
      instructions: 'Send POST request to simulate Clerk webhook events',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      message: 'Clerk webhook test endpoint error',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
