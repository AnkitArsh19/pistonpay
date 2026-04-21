import { useState, useEffect } from 'react';
import { getCustomers, getVehicles, getRentals, getInvoices } from '../api';
import Card from '../components/Card';

export default function Dashboard() {
  const [stats, setStats] = useState({ customers: 0, vehicles: 0, activeRentals: 0, invoices: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [c, v, r, i] = await Promise.all([
          getCustomers(), getVehicles(), getRentals('ACTIVE'), getInvoices()
        ]);
        setStats({
          customers: c.data.length,
          vehicles: v.data.length,
          activeRentals: r.data.length,
          invoices: i.data.length,
        });
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };
    load();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>
      <div className="stats-grid">
        <Card label="Customers" value={stats.customers} />
        <Card label="Vehicles" value={stats.vehicles} />
        <Card label="Active Rentals" value={stats.activeRentals} />
        <Card label="Invoices" value={stats.invoices} />
      </div>
    </div>
  );
}
