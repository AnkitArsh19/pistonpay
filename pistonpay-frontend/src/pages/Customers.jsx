import { useState, useEffect } from 'react';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', drivingLicense: '' });

  const load = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', email: '', phone: '', address: '', drivingLicense: '' });
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditing(c.id);
    setForm({ name: c.name, email: c.email, phone: c.phone, address: c.address || '', drivingLicense: c.drivingLicense });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateCustomer(editing, form);
      } else {
        await createCustomer(form);
      }
      setShowModal(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this customer?')) return;
    try {
      await deleteCustomer(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Customers</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Customer</button>
      </div>

      <div className="card">
        {customers.length === 0 ? (
          <div className="empty">No customers yet</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>License</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.drivingLicense}</td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(c)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editing ? 'Edit Customer' : 'Add Customer'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Driving License</label>
                <input value={form.drivingLicense} onChange={e => setForm({...form, drivingLicense: e.target.value})} required />
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
