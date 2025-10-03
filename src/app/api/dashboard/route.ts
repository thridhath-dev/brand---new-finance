import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get all transactions for the user
    const allTransactions = await prisma.transaction.findMany({
      where: { userId: user.id },
    });

    // Get current month transactions
    const currentMonthTransactions = allTransactions.filter(
      t => t.date >= startOfMonth
    );

    // Get last month transactions
    const lastMonthTransactions = allTransactions.filter(
      t => t.date >= startOfLastMonth && t.date <= endOfLastMonth
    );

    // Calculate totals
    const totalIncome = allTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = allTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const currentMonthIncome = currentMonthTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const currentMonthExpenses = currentMonthTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const lastMonthIncome = lastMonthTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const lastMonthExpenses = lastMonthTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const netWorth = totalIncome - totalExpenses;
    const currentBalance = currentMonthIncome - currentMonthExpenses;
    const savingsRate = currentMonthIncome > 0 
      ? ((currentMonthIncome - currentMonthExpenses) / currentMonthIncome) * 100 
      : 0;

    const lastMonthSavingsRate = lastMonthIncome > 0 
      ? ((lastMonthIncome - lastMonthExpenses) / lastMonthIncome) * 100 
      : 0;

    const savingsRateChange = savingsRate - lastMonthSavingsRate;

    // Get recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      include: { category: true },
      orderBy: { date: 'desc' },
      take: 5,
    });

    return NextResponse.json({
      balance: currentBalance,
      monthlySpend: currentMonthExpenses,
      savingsRate: Math.round(savingsRate),
      savingsRateChange: Math.round(savingsRateChange),
      netWorth,
      monthlyIncome: currentMonthIncome,
      monthlyExpenses: currentMonthExpenses,
      recentTransactions,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
