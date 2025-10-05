import React, { useState, useEffect } from "react";

interface DashboardData {
  balance: number;
  monthlySpend: number;
  savingsRate: number;
  savingsRateChange: number;
  recentTransactions: Array<{
    id: string;
    amount: number;
    type: 'EXPENSE' | 'INCOME';
    description: string | null;
    date: string;
    category: {
      name: string;
      color: string;
    } | null;
  }>;
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Welcome back 👋</h1>
          <p className="text-gray-600">Loading your financial snapshot...</p>
        </header>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Welcome back 👋</h1>
        <p className="text-gray-600">Here's a quick snapshot of your finances.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="card-title">Balance</div>
          <div className="card-value">
            ₹ {data?.balance ? data.balance.toLocaleString() : '0'}
          </div>
          <div className="card-sub">as of today</div>
        </div>
        <div className="card">
          <div className="card-title">This Month Spend</div>
          <div className="card-value">
            ₹ {data?.monthlySpend ? data.monthlySpend.toLocaleString() : '0'}
          </div>
          <div className="card-sub">{new Date().toLocaleDateString('en-US', { month: 'long' })}</div>
        </div>
        <div className="card">
          <div className="card-title">Savings Rate</div>
          <div className="card-value">
            {data?.savingsRate ? data.savingsRate : 0}%
          </div>
          <div className="card-sub">
            vs last month {data?.savingsRateChange ? (data.savingsRateChange > 0 ? '+' : '') + data.savingsRateChange : 0}%
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">Recent Activity</div>
        {data?.recentTransactions && data.recentTransactions.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {data.recentTransactions.map((transaction) => (
              <li key={transaction.id} className="row">
                <div className="flex items-center gap-2">
                  {transaction.category && (
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: transaction.category.color }}
                    ></span>
                  )}
                  <span>{transaction.category?.name || transaction.description || 'Transaction'}</span>
                </div>
                <span className={transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}>
                  {transaction.type === 'INCOME' ? '+' : '-'}₹ {Number(transaction.amount).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No recent transactions. Start by adding some transactions!</p>
          </div>
        )}
      </div>
    </section>
  );
}