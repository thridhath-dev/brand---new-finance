import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get user count
    const userCount = await prisma.user.count();
    
    // Get recent users
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true
      }
    });

    // Get transaction count
    const transactionCount = await prisma.transaction.count();
    
    // Get category count
    const categoryCount = await prisma.category.count();

    return NextResponse.json({
      status: 'Webhook system is operational',
      database: {
        connected: true,
        userCount,
        transactionCount,
        categoryCount
      },
      recentUsers,
      webhookEndpoint: '/api/webhooks/clerk',
      testEndpoint: '/api/test-webhook',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Webhook status check error:', error);
    return NextResponse.json({
      status: 'Webhook system error',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
