import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();
    
    return NextResponse.json({
      authenticated: !!userId,
      userId: userId || null,
      message: userId ? 'User is authenticated' : 'User is not authenticated',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Auth status error:', error);
    return NextResponse.json({
      authenticated: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
