import { useState, useEffect } from 'react';
import { getInvoices, getInvoicesByUser, payInvoice } from '../api';

export default function Invoices({ user }) {
  const isAdmin = user?.role === 'ADMIN';
  const [invoices, setInvoices] = useState([]);

  const load = async () => {
    try {
      const res = isAdmin ? await getInvoices() : await getInvoicesByUser(user.id);
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  const handlePay = async (id) => {
    try {
      await payInvoice(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const statusBadge = (s) => {
    const cls = s === 'PAID' ? 'badge-green' : 'badge-yellow';
    return <span className={`badge ${cls}`}>{s}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <h1>{isAdmin ? 'Invoices' : 'My Invoices'}</h1>
      </div>

      <div className="card">
        {invoices.length === 0 ? (
          <div className="empty">No invoices yet</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                {isAdmin && <th>Rental ID</th>}
                <th>Amount</th>
                <th>Tax (18%)</th>
                <th>Grand Total</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td>{inv.id}</td>
                  {isAdmin && <td>{inv.rentalId}</td>}
                  <td>₹{inv.totalAmount}</td>
                  <td>₹{inv.tax}</td>
                  <td style={{fontWeight: 600}}>₹{inv.grandTotal}</td>
                  <td>{inv.invoiceDate}</td>
                  <td>{statusBadge(inv.status)}</td>
                  <td>
                    {inv.status === 'PENDING' && (
                      <button className="btn btn-success btn-sm" onClick={() => handlePay(inv.id)}>Pay Now</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
