import { useState, useEffect } from 'react';
import { getRentals, getRentalsByUser, createRental, returnRental, cancelRental, getCustomers, getVehicles } from '../api';

export default function Rentals({ user }) {
  const isAdmin = user?.role === 'ADMIN';
  const [rentals, setRentals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showReturn, setShowReturn] = useState(null);
  const [form, setForm] = useState({ customerId: '', vehicleId: '', startDate: '' });
  const [endDate, setEndDate] = useState('');

  const load = async () => {
    try {
      const [r, c, v] = await Promise.all([
        isAdmin ? getRentals() : getRentalsByUser(user.id),
        isAdmin ? getCustomers() : Promise.resolve({ data: [] }),
        isAdmin ? getVehicles('AVAILABLE') : Promise.resolve({ data: [] })
      ]);
      setRentals(r.data);
      if (isAdmin) {
        setCustomers(c.data);
        setVehicles(v.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      await createRental({ customerId: parseInt(form.customerId), vehicleId: parseInt(form.vehicleId), startDate: form.startDate });
      setShowCreate(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      await returnRental(showReturn, endDate);
      setShowReturn(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this rental?')) return;
    try {
      await cancelRental(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const statusBadge = (s) => {
    const cls = s === 'ACTIVE' ? 'badge-blue' : s === 'COMPLETED' ? 'badge-green' : 'badge-red';
    return <span className={`badge ${cls}`}>{s}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <h1>{isAdmin ? 'Rentals' : 'My Rentals'}</h1>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => { setForm({ customerId: '', vehicleId: '', startDate: new Date().toISOString().split('T')[0] }); setShowCreate(true); }}>
            + New Rental
          </button>
        )}
      </div>

      <div className="card">
        {rentals.length === 0 ? (
          <div className="empty">No rentals yet</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                {isAdmin && <th>Customer</th>}
                <th>Vehicle</th>
                <th>Start</th>
                <th>End</th>
                <th>Days</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  {isAdmin && <td>{r.customerName}</td>}
                  <td>{r.vehicleModel}</td>
                  <td>{r.startDate}</td>
                  <td>{r.endDate || '-'}</td>
                  <td>{r.totalDays || '-'}</td>
                  <td>{r.totalAmount ? `₹${r.totalAmount}` : '-'}</td>
                  <td>{statusBadge(r.status)}</td>
                  <td>
                    {r.status === 'ACTIVE' && (
                      <div className="btn-group">
                        {isAdmin && <button className="btn btn-success btn-sm" onClick={() => { setShowReturn(r.id); setEndDate(new Date().toISOString().split('T')[0]); }}>Return</button>}
                        <button className="btn btn-danger btn-sm" onClick={() => handleCancel(r.id)}>Cancel</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showCreate && isAdmin && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>New Rental</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Customer</label>
                <select value={form.customerId} onChange={e => setForm({...form, customerId: e.target.value})} required>
                  <option value="">Select customer</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Vehicle</label>
                <select value={form.vehicleId} onChange={e => setForm({...form, vehicleId: e.target.value})} required>
                  <option value="">Select vehicle</option>
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.model} - {v.registrationNumber} (₹{v.dailyRate}/day)</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Rental</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReturn && isAdmin && (
        <div className="modal-overlay" onClick={() => setShowReturn(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Return Vehicle</h3>
            <form onSubmit={handleReturn}>
              <div className="form-group">
                <label>Return Date</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowReturn(null)}>Cancel</button>
                <button type="submit" className="btn btn-success">Complete Return</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
