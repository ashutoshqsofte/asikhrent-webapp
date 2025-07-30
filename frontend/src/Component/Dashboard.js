import React, { useEffect, useState } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('history');
  const [rentData, setRentData] = useState([]);
  const [tenantStatus, setTenantStatus] = useState([]);

  const [tenantId, setTenantId] = useState('');
  const [amount, setAmount] = useState('');
  const [datePaid, setDatePaid] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [tenants, setTenants] = useState([]);

  // Expense states
  const [expenses, setExpenses] = useState([]);
  const [expenseReason, setExpenseReason] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [editingExpenseId, setEditingExpenseId] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/tenants')
      .then(res => res.json())
      .then(data => setTenants(data))
      .catch(err => console.error('Error fetching tenants:', err));
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      fetch('http://127.0.0.1:5000/rent-history')
        .then(res => res.json())
        .then(data => setRentData(data))
        .catch(err => console.error('Error fetching rent data:', err));
    }

    if (activeTab === 'status') {
      fetch('http://127.0.0.1:5000/tenant-status')
        .then(res => res.json())
        .then(data => setTenantStatus(data))
        .catch(err => console.error('Error fetching tenant status:', err));
    }

    if (activeTab === 'expenses') {
      fetch('http://127.0.0.1:5000/expenses')
        .then(res => res.json())
        .then(data => setExpenses(data.expenses || []))
        .catch(err => console.error('Error fetching expenses:', err));
    }
  }, [activeTab]);

  const handleRentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:5000/add-rent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: tenantId, amount, date_paid: datePaid }),
      });
      const data = await res.json();
      if (res.ok) {
        setFormMessage('✅ Rent added successfully!');
        setTenantId('');
        setAmount('');
        setDatePaid('');
      } else {
        setFormMessage('❌ ' + data.message);
      }
    } catch (err) {
      setFormMessage('❌ Failed to connect to backend');
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      reason: expenseReason,
      amount: expenseAmount,
      date_spent: expenseDate,
    };
    const endpoint = editingExpenseId
      ? `http://127.0.0.1:5000/expenses/${editingExpenseId}`
      : 'http://127.0.0.1:5000/expenses';

    const method = editingExpenseId ? 'PUT' : 'POST';

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const updated = await fetch('http://127.0.0.1:5000/expenses').then(r => r.json());
      setExpenses(updated.expenses);
      setExpenseReason('');
      setExpenseAmount('');
      setExpenseDate('');
      setEditingExpenseId(null);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpenseId(expense.id);
    setExpenseReason(expense.reason);
    setExpenseAmount(expense.amount);
    setExpenseDate(expense.date_spent);
  };

  const handleDeleteExpense = async (id) => {
    const res = await fetch(`http://127.0.0.1:5000/expenses/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="dashboard">
      <h1>Dashboard - AsikhRent</h1>
      <div className="tabs">
        <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? 'active' : ''}>View History</button>
        <button onClick={() => setActiveTab('status')} className={activeTab === 'status' ? 'active' : ''}>Tenant Status</button>
        <button onClick={() => setActiveTab('add')} className={activeTab === 'add' ? 'active' : ''}>Add Rent</button>
        <button onClick={() => setActiveTab('expenses')} className={activeTab === 'expenses' ? 'active' : ''}>Expenses</button>
      </div>

      {activeTab === 'history' && (
        <div>
          <h2>Rent Payment History</h2>
          {rentData.length === 0 ? (
            <p>No payment records found.</p>
          ) : (
            <table>
              <thead>
                <tr><th>Tenant Name</th><th>Amount Paid</th><th>Date Paid</th></tr>
              </thead>
              <tbody>
                {rentData.map((payment, index) => (
                  <tr key={index}>
                    <td>{payment.tenant_name}</td>
                    <td>₹{payment.amount}</td>
                    <td>{payment.date_paid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'status' && (
        <div>
          <h2>Tenant Monthly Payment Status</h2>
          {tenantStatus.length === 0 ? (
            <p>No tenants found.</p>
          ) : (
            <table>
              <thead>
                <tr><th>Tenant Name</th><th>Rent Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {tenantStatus.map((tenant, index) => (
                  <tr key={index}>
                    <td>{tenant.tenant_name}</td>
                    <td>₹{tenant.rent_amount}</td>
                    <td className={tenant.status === 'Paid' ? 'status-paid' : 'status-pending'}>{tenant.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'add' && (
        <div>
          <h2>Add New Rent Payment</h2>
          <form onSubmit={handleRentSubmit}>
            <select value={tenantId} onChange={(e) => setTenantId(e.target.value)} required>
              <option value="">-- Select Tenant --</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
              ))}
            </select>
            <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <input type="date" value={datePaid} onChange={(e) => setDatePaid(e.target.value)} required />
            <button type="submit">Add Rent</button>
            {formMessage && <p>{formMessage}</p>}
          </form>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div>
          <h2>Expenses</h2>
          <form onSubmit={handleExpenseSubmit}>
            <input type="text" placeholder="Reason" value={expenseReason} onChange={(e) => setExpenseReason(e.target.value)} required />
            <input type="number" placeholder="Amount" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} required />
            <input type="date" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} required />
            <button type="submit">{editingExpenseId ? 'Update Expense' : 'Add Expense'}</button>
          </form>
          <table>
            <thead>
              <tr><th>Reason</th><th>Amount</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id}>
                  <td>{exp.reason}</td>
                  <td>₹{exp.amount}</td>
                  <td>{exp.date_spent}</td>
                  <td>
                    <button onClick={() => handleEditExpense(exp)}>Edit</button>
                    <button onClick={() => handleDeleteExpense(exp.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Total Expenses: ₹{totalExpenses}</h3>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
