import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './Component/Navbar';
import Dashboard from './Pages/Dashboard';
import UsersList from './Pages/UsersList';
import AddUser from './Pages/AddUser';
import EditUser from './Pages/EditUser';
import ManagersList from './Pages/ManagersList';
import AddManager from './Pages/AddManager';
import EditManager from './Pages/EditManager';
import ModelsList from './Pages/ModelsList';
import AddModel from './Pages/AddModel';
import EditModel from './Pages/EditModel';
import ContactsList from './Pages/ContactsList';
import EditContact from './Pages/EditContact';
import PageBreadcrumb from './Component/PageBreadcrumb';
import TopBar from './Component/TopBar';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <HashRouter>
      <TopBar onMenuToggle={() => setSidebarOpen((open) => !open)} />
      <div className="min-h-screen bg-gray-50 pt-[70px]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="min-w-0 p-4 sm:p-6 lg:ml-56">
          <PageBreadcrumb />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/users/add" element={<AddUser />} />
            <Route path="/users/edit/:id" element={<EditUser />} />
            <Route path="/managers" element={<ManagersList />} />
            <Route path="/managers/add" element={<AddManager />} />
            <Route path="/managers/edit/:id" element={<EditManager />} />
            <Route path="/models" element={<ModelsList />} />
            <Route path="/models/add" element={<AddModel />} />
            <Route path="/models/edit/:id" element={<EditModel />} />
            <Route path="/contacts" element={<ContactsList />} />
            <Route path="/contacts/edit/:id" element={<EditContact />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
