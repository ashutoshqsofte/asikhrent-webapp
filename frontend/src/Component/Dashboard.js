import React, { useEffect, useState } from 'react';
import './Dashboard.css';
// import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('history');
  const [rentData, setRentData] = useState([]);
  const [tenantStatus, setTenantStatus] = useState([]);

  const [tenantId, setTenantId] = useState('');
  const [amount, setAmount] = useState('');
  const [datePaid, setDatePaid] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [tenants, setTenants] = useState([]); // to store tenant list

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
  }, [activeTab]);

  const handleRentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:5000/add-rent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenantId,
          amount,
          date_paid: datePaid,
        }),
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

  return (
    <div className="dashboard">
      <h1>Dashboard - AsikhRent</h1>
      <div className="tabs">
        <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? 'active' : ''}>View History</button>
        <button onClick={() => setActiveTab('status')} className={activeTab === 'status' ? 'active' : ''}>Tenant Status</button>
        <button onClick={() => setActiveTab('add')} className={activeTab === 'add' ? 'active' : ''}>Add Rent</button>
      </div>

      {activeTab === 'history' && (
        <div>
          <h2>Rent Payment History</h2>
          {rentData.length === 0 ? (
            <p>No payment records found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Tenant Name</th>
                  <th>Amount Paid</th>
                  <th>Date Paid</th>
                </tr>
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
                <tr>
                  <th>Tenant Name</th>
                  <th>Rent Amount</th>
                  <th>Status</th>
                </tr>
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
    </div>
  );
}

export default Dashboard;
