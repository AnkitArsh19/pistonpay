import { useState, useEffect } from 'react';
import { getCustomerByUser, createCustomer, updateCustomer } from '../api';

export default function MyProfile({ user }) {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', drivingLicense: '' });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await getCustomerByUser(user.id);
      if (res.data) {
        setProfile(res.data);
        setForm({ ...res.data });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, userId: user.id };
      if (profile) {
        await updateCustomer(profile.id, data);
      } else {
        await createCustomer(data);
      }
      setEditing(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!profile && !editing) {
    return (
      <div>
        <div className="page-header">
          <h1>My Profile</h1>
        </div>
        <div className="card">
          <div className="empty" style={{ padding: '60px 20px' }}>
            <h3 style={{ marginBottom: 12, color: '#fff' }}>Welcome to PistonPay!</h3>
            <p style={{ marginBottom: 24 }}>You need to complete your customer profile before you can rent vehicles.</p>
            <button className="btn btn-primary" onClick={() => setEditing(true)}>Create Profile</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>My Profile</h1>
        {!editing && <button className="btn btn-outline" onClick={() => setEditing(true)}>Edit Details</button>}
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        {editing ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
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
            <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
              <button type="submit" className="btn btn-primary">Save Profile</button>
              {profile && <button type="button" className="btn btn-outline" onClick={() => { setEditing(false); setForm({...profile}); }}>Cancel</button>}
            </div>
          </form>
        ) : (
          <div>
            <div className="form-group">
              <label>Full Name</label>
              <div style={{ fontSize: 16, color: '#fff', marginBottom: 16 }}>{profile.name}</div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <div style={{ fontSize: 16, color: '#fff', marginBottom: 16 }}>{profile.email}</div>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <div style={{ fontSize: 16, color: '#fff', marginBottom: 16 }}>{profile.phone}</div>
            </div>
            <div className="form-group">
              <label>Address</label>
              <div style={{ fontSize: 16, color: '#fff', marginBottom: 16 }}>{profile.address || '-'}</div>
            </div>
            <div className="form-group">
              <label>Driving License</label>
              <div style={{ fontSize: 16, color: '#fff' }}>{profile.drivingLicense}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
