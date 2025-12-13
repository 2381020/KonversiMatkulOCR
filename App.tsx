import React, { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { KaprodiDashboardPage } from './pages/kaprodi/KaprodiDashboardPage';
import { BAADashboardPage } from './pages/baa/BAADashboardPage';
import { DekanDashboardPage } from './pages/dekan/DekanDashboardPage';
import type { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (role: User['role']) => {
    const mockUsers: Record<User['role'], User> = {
      mahasiswa: { id: 'student-1', name: 'Andrew Simbolon', email: 'andrew@student.com', role: 'mahasiswa' },
      kaprodi: { id: 'kaprodi-1', name: 'Dr. Amelia Sari', email: 'kaprodi@unai.edu', role: 'kaprodi', study_program_id: 'prog-ti' },
      baa: { id: 'baa-1', name: 'Dr. Hendra Gunawan', email: 'baa@unai.edu', role: 'baa' },
      dekan: { id: 'dekan-1', name: 'Prof. Sri Mulyani', email: 'dekan@unai.edu', role: 'dekan' }
    };

    setUser(mockUsers[role]);
  };

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
      case 'kaprodi':
        return <KaprodiDashboardPage user={user} onLogout={handleLogout} />;
      case 'baa':
        return <BAADashboardPage user={user} onLogout={handleLogout} />;
      case 'dekan':
        return <DekanDashboardPage user={user} onLogout={handleLogout} />;
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
