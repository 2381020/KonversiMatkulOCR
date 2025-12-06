import React from 'react';
import { Header } from '../../components/Header';
import type { User } from '../../types';

interface BAADashboardPageProps {
    user: User;
    onLogout: () => void;
}

export const BAADashboardPage: React.FC<BAADashboardPageProps> = ({ user, onLogout }) => {
    return (
        <div className="flex h-screen bg-slate-100">
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    user={user}
                    onLogout={onLogout}
                    onToggleSidebar={() => {}}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 text-center">
                        <h1 className="text-3xl font-bold text-slate-800 mb-4">Dashboard BAA</h1>
                        <p className="text-slate-600">Selamat datang di dashboard BAA. Fitur validasi dan persetujuan akhir sedang dalam pengembangan.</p>
                    </div>
                </main>
            </div>
        </div>
    );
};
