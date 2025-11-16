import React, { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import type { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  // Fungsi ini akan dipanggil oleh LoginPage setelah login berhasil
  const handleLogin = () => {
    // Di aplikasi nyata, data pengguna akan didapat dari API
    setUser({ name: 'Budi Santoso', role: 'mahasiswa' });
  };
  
  // Fungsi untuk logout
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {user ? (
        <DashboardPage user={user} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;