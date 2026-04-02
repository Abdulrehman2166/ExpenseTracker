import React, { useState, useEffect } from 'react';
import api from '../services/apiService';
import Navbar from '../components/Navbar';
import { Plus, Trash, DollarSign, Calendar, Tag, TrendingDown } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'Others'
  });
  const [formError, setFormError] = useState('');

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses');
      setExpenses(res.data.data || []);
      const summaryRes = await api.get('/expenses/summary');
      setSummary(summaryRes.data.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!formData.amount || !formData.description) {
      setFormError('Please fill in all required fields');
      return;
    }
    try {
      await api.post('/expenses', formData);
      setFormData({ amount: '', description: '', category: 'Others' });
      fetchExpenses();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to add expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.delete(`/expenses/${id}`);
        fetchExpenses();
      } catch (err) {
        alert('Failed to delete expense');
      }
    }
  };

  const categories = [
    'Food', 'Transportation', 'Housing', 'Utilities', 
    'Entertainment', 'Health', 'Shopping', 'Education', 'Others'
  ];

  if (loading) {
    return <div className="loading-screen">Loading your data...</div>;
  }

  return (
    <div className="dashboard">
      <Navbar />
      
      <main className="dashboard-content">
        <header className="content-header">
          <h1>My Expenses</h1>
          <p>Track where your money goes</p>
        </header>

        <section className="summary-grid">
          <div className="summary-card total">
            <TrendingDown className="card-icon" />
            <div className="card-data">
              <span className="card-label">Total Spending</span>
              <h2 className="card-value">${summary?.totalAmount || '0.00'}</h2>
            </div>
          </div>
          <div className="summary-card count">
            <Tag className="card-icon" />
            <div className="card-data">
              <span className="card-label">Total Records</span>
              <h2 className="card-value">{summary?.totalExpenses || 0}</h2>
            </div>
          </div>
        </section>

        <div className="main-grid">
          <section className="add-expense-section">
            <h3>Add New Expense</h3>
            {formError && <div className="form-error">{formError}</div>}
            <form onSubmit={handleAddExpense} className="expense-form">
              <div className="form-group">
                <label>Amount ($)</label>
                <div className="input-with-icon">
                  <DollarSign size={18} />
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="25.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Lunch with friends"
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <button type="submit" className="btn-add">
                <Plus size={18} />
                <span>Add Expense</span>
              </button>
            </form>
          </section>

          <section className="expense-list-section">
            <h3>Recent Activity</h3>
            <div className="expense-list">
              {expenses.length === 0 ? (
                <div className="empty-state">No expenses found. Start adding some!</div>
              ) : (
                expenses.map(expense => (
                  <div key={expense._id} className="expense-item">
                    <div className="item-main">
                      <div className="item-icon-wrapper">
                        <Tag size={20} className="item-icon" />
                      </div>
                      <div className="item-info">
                        <span className="item-description">{expense.description}</span>
                        <span className="item-meta">
                          <Tag size={12} /> {expense.category} • <Calendar size={12} /> {new Date(expense.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="item-actions">
                      <span className="item-amount">-${expense.amount.toFixed(2)}</span>
                      <button onClick={() => handleDeleteExpense(expense._id)} className="btn-delete" title="Delete">
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
