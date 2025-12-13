import React, { useState } from 'react';
import { Header } from '../../components/Header';
import type { User } from '../../types';
import { BAAReviewPage } from './BAAReviewPage';

interface BAADashboardPageProps {
  user: User;
  onLogout: () => void;
}

export const BAADashboardPage: React.FC<BAADashboardPageProps> = ({ user, onLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100">
      <aside className="w-64 bg-white flex-shrink-0 border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-slate-200 px-4">
          <div className="flex items-center gap-2">
            <img
              src="https://unai.edu/wp-content/uploads/2023/09/Logo-Unai.png"
              alt="UNAI Logo"
              className="h-6 w-6 object-contain"
            />
            <span className="text-lg font-bold text-slate-800">Dashboard BAA</span>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={user}
          onLogout={onLogout}
          onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <BAAReviewPage user={user} />
        </main>
      </div>
    </div>
  );
};
