
import React from 'react';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { KaprodiDashboardPage } from './pages/kaprodi/KaprodiDashboardPage';
import { DekanDashboardPage } from './pages/dekan/DekanDashboardPage';
import { BAADashboardPage } from './pages/baa/BAADashboardPage';
import { useAuth } from './contexts/AuthContext';
import type { User } from './types';

const App: React.FC = () => {
  const { profile, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mb-4 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-slate-600">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <LoginPage />;
  }

  const user: User = {
    name: profile.full_name,
    role: profile.role,
  };

  const handleLogout = async () => {
    await signOut();
  };

  const renderDashboard = () => {
    switch(user.role) {
      case 'mahasiswa':
        return <DashboardPage user={user} onLogout={handleLogout} />;
      case 'kaprodi':
        return <KaprodiDashboardPage user={user} onLogout={handleLogout} />;
      case 'dekan':
        return <DekanDashboardPage user={user} onLogout={handleLogout} />;
      case 'baa':
        return <BAADashboardPage user={user} onLogout={handleLogout} />;
      default:
        return <LoginPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {renderDashboard()}
    </div>
  );
};

export default App;
