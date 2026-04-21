import { useState, useEffect } from 'react';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '../api';

export default function Vehicles({ user }) {
  const isAdmin = user?.role === 'ADMIN';
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ registrationNumber: '', model: '', category: '', dailyRate: '' });

  const load = async () => {
    try {
      // Users probably only need to see AVAILABLE vehicles, but let's show all for now
      // Or we can filter it. Let's just use getVehicles() which fetches all.
      const res = await getVehicles();
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ registrationNumber: '', model: '', category: '', dailyRate: '' });
    setShowModal(true);
  };

  const openEdit = (v) => {
    setEditing(v.id);
    setForm({ registrationNumber: v.registrationNumber, model: v.model, category: v.category, dailyRate: v.dailyRate });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      const data = { ...form, dailyRate: parseFloat(form.dailyRate) };
      if (editing) {
        await updateVehicle(editing, data);
      } else {
        await createVehicle(data);
      }
      setShowModal(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin || !confirm('Delete this vehicle?')) return;
    try {
      await deleteVehicle(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const statusBadge = (status) => {
    const cls = status === 'AVAILABLE' ? 'badge-green' : status === 'RENTED' ? 'badge-yellow' : 'badge-red';
    return <span className={`badge ${cls}`}>{status}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <h1>{isAdmin ? 'Vehicles' : 'Available Vehicles'}</h1>
        {isAdmin && <button className="btn btn-primary" onClick={openAdd}>+ Add Vehicle</button>}
      </div>

      <div className="card">
        {vehicles.length === 0 ? (
          <div className="empty">No vehicles yet</div>
        ) : (
          <table>
            <thead>
              <tr>
                {isAdmin && <th>ID</th>}
                <th>Reg. No.</th>
                <th>Model</th>
                <th>Category</th>
                <th>Daily Rate</th>
                <th>Status</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {vehicles.map(v => (
                // For users, maybe only show available vehicles?
                // The prompt says "User should be able to see list of available vehicles"
                (!isAdmin && v.status !== 'AVAILABLE') ? null : (
                <tr key={v.id}>
                  {isAdmin && <td>{v.id}</td>}
                  <td>{v.registrationNumber}</td>
                  <td>{v.model}</td>
                  <td>{v.category}</td>
                  <td>₹{v.dailyRate}</td>
                  <td>{statusBadge(v.status)}</td>
                  {isAdmin && (
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(v)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(v.id)}>Delete</button>
                      </div>
                    </td>
                  )}
                </tr>
                )
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && isAdmin && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editing ? 'Edit Vehicle' : 'Add Vehicle'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Registration Number</label>
                <input value={form.registrationNumber} onChange={e => setForm({...form, registrationNumber: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Model</label>
                <input value={form.model} onChange={e => setForm({...form, model: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
                  <option value="">Select</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>
              <div className="form-group">
                <label>Daily Rate (₹)</label>
                <input type="number" value={form.dailyRate} onChange={e => setForm({...form, dailyRate: e.target.value})} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
