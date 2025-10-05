import React, { useState, useEffect } from "react";

interface DashboardData {
  balance: number;
  monthlySpend: number;
  savingsRate: number;
  savingsRateChange: number;
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
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

export default function DashboardPage() {
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
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-gray-600">Loading dashboard data...</p>
        </header>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-600">Overview of key metrics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-title">Net Worth</div>
          <div className="card-value">
            ₹ {data?.netWorth ? data.netWorth.toLocaleString() : '0'}
          </div>
          <div className="card-sub">lifetime</div>
        </div>
        <div className="card">
          <div className="card-title">Income (M)</div>
          <div className="card-value">
            ₹ {data?.monthlyIncome ? data.monthlyIncome.toLocaleString() : '0'}
          </div>
          <div className="card-sub">this month</div>
        </div>
        <div className="card">
          <div className="card-title">Expenses (M)</div>
          <div className="card-value">
            ₹ {data?.monthlyExpenses ? data.monthlyExpenses.toLocaleString() : '0'}
          </div>
          <div className="card-sub">this month</div>
        </div>
        <div className="card">
          <div className="card-title">Savings Rate</div>
          <div className="card-value">
            {data?.savingsRate ? data.savingsRate : 0}%
          </div>
          <div className="card-sub">
            {data?.savingsRateChange ? (data.savingsRateChange > 0 ? '+' : '') + data.savingsRateChange : 0}% vs last month
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">Recent Transactions</div>
        {data?.recentTransactions && data.recentTransactions.length > 0 ? (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>{transaction.description || '-'}</td>
                    <td>
                      {transaction.category ? (
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: transaction.category.color }}
                          ></span>
                          {transaction.category.name}
                        </div>
                      ) : '-'}
                    </td>
                    <td>
                      <span className={`chip ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className={transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.type === 'INCOME' ? '+' : '-'}₹ {Number(transaction.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No transactions yet. Start by adding some transactions!</p>
          </div>
        )}
      </div>
    </section>
  );
}
