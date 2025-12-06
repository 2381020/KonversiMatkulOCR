
import React, { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { DosenDashboardPage } from './pages/dosen/DosenDashboardPage';
import type { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  // Fungsi ini akan dipanggil oleh LoginPage setelah login berhasil
  const handleLogin = (role: User['role']) => {
    if (role === 'dosen') {
      setUser({ name: 'Sir Jay Sihotang', role: 'dosen' });
    } else {
      setUser({ name: 'Andrew Simbolon', role: 'mahasiswa' });
    }
  };
  
  // Fungsi untuk logout
  const handleLogout = () => {
    setUser(null);
  };

  const renderDashboard = () => {
    if (!user) {
      return <LoginPage onLogin={handleLogin} />;
    }

    switch(user.role) {
      case 'mahasiswa':
        return <DashboardPage user={user} onLogout={handleLogout} />;
      case 'dosen':
        return <DosenDashboardPage user={user} onLogout={handleLogout} />;
      default:
         return <LoginPage onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {renderDashboard()}
    </div>
  );
};

export default App;
