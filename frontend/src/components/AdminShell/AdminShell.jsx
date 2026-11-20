import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar/AdminSidebar.jsx';
import AdminTopbar from '../AdminTopbar/AdminTopbar.jsx';
import './AdminShell.css';

export default function AdminShell() {
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-shell">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      <div className="admin-shell-main">
        <AdminTopbar onMenu={() => setOpen(true)} />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
