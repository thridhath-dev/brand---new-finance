import React, { useState, useEffect } from "react";

interface Category {
  id: string;
  name: string;
  type: 'EXPENSE' | 'INCOME';
  color: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: 'EXPENSE' | 'INCOME';
  description: string | null;
  date: string;
  category: Category | null;
}

export default function Transaction() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    amount: '',
    type: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, transactionsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/transactions')
      ]);

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newTransaction = await response.json();
        setTransactions([newTransaction, ...transactions]);
        setFormData({
          amount: '',
          type: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          categoryId: ''
        });
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const filteredCategories = categories.filter(cat => 
    !formData.type || cat.type === formData.type
  );

  if (loading) {
    return (
      <section className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Transactions</h1>
          <p className="text-white/60">Loading transactions...</p>
        </header>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <p className="text-white/60">Add and manage your financial transactions.</p>
      </header>

      {/* Transaction Entry Form */}
      <div className="panel">
        <div className="panel-title">Add New Transaction</div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Transaction Type
              </label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value, categoryId: '' })}
                className="input w-full"
                required
              >
                <option value="">Select Type</option>
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="input w-full"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Category
              </label>
              <select 
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="input w-full"
              >
                <option value="">Select Category</option>
                {filteredCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input w-full"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Add transaction details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input w-full resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setFormData({
                amount: '',
                type: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                categoryId: ''
              })}
              className="btn outline"
            >
              Clear
            </button>
            <button
              type="submit"
              className="btn primary"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>

      {/* Recent Transactions */}
      <div className="panel">
        <div className="panel-title">Recent Transactions</div>
        {transactions.length > 0 ? (
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
                {transactions.slice(0, 10).map((transaction) => (
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
                      <span className={`chip ${transaction.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className={transaction.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}>
                      {transaction.type === 'INCOME' ? '+' : '-'}₹ {Number(transaction.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-white/60">No transactions yet. Add your first transaction above!</p>
          </div>
        )}
      </div>
    </section>
  );
}