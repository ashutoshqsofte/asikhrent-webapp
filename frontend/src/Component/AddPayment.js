import React, { useEffect, useState } from 'react';
import './AddPayment.css';

function AddPayment() {
  const [tenants, setTenants] = useState([]);
  const [tenantId, setTenantId] = useState('');
  const [amount, setAmount] = useState('');
  const [datePaid, setDatePaid] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch tenants from backend
    fetch('http://127.0.0.1:5000/tenants')
      .then((res) => res.json())
      .then((data) => setTenants(data))
      .catch((err) => console.error('Failed to fetch tenants', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:5000/add-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: tenantId, amount, date_paid: datePaid }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Payment added successfully');
        setTenantId('');
        setAmount('');
        setDatePaid('');
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setMessage('❌ Failed to connect to backend');
    }
  };

  return (
    <div className="add-payment-container">
      <h2>Add Rent Payment</h2>
      <form onSubmit={handleSubmit}>
        <select value={tenantId} onChange={(e) => setTenantId(e.target.value)} required>
          <option value="">Select Tenant</option>
          {tenants.map((tenant) => (
            <option key={tenant.id} value={tenant.id}>
              {tenant.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount Paid"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <input
          type="date"
          value={datePaid}
          onChange={(e) => setDatePaid(e.target.value)}
          required
        />

        <button type="submit">Submit Payment</button>

        {message && <p className="status-message">{message}</p>}
      </form>
    </div>
  );
}

export default AddPayment;
