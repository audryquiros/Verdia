import {Outlet, useLocation} from 'react-router-dom';
import {useState} from 'react';
import Sidebar from '../Sidebar/Sidebar.jsx';
import Topbar from '../Topbar/Topbar.jsx';
import './AppShell.css';

export default function AppShell(){
  const [open,setOpen]=useState(false);
  const location=useLocation();
  const isDashboard=location.pathname === '/inicio';

  return (
    <div className="shell">
      <Sidebar open={open} onClose={()=>setOpen(false)}/>
      <div className="shell-main">
        {isDashboard && <Topbar onMenu={()=>setOpen(true)}/>}
        <main className="content">
          <Outlet context={{onMenu:()=>setOpen(true)}}/>
        </main>
      </div>
    </div>
  );
}
