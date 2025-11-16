import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { DashboardHomePage } from './student/DashboardHomePage';
import { ConversionRequestPage } from './student/ConversionRequestPage';
import { ConversionHistoryPage } from './student/ConversionHistoryPage';
import type { User } from '../types';

interface DashboardPageProps {
    user: User;
    onLogout: () => void;
}

export type ActiveView = 'home' | 'request' | 'history';

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout }) => {
    const [activeView, setActiveView] = useState<ActiveView>('home');

    const renderContent = () => {
        switch (activeView) {
            case 'home':
                return <DashboardHomePage user={user} />;
            case 'request':
                return <ConversionRequestPage />;
            case 'history':
                return <ConversionHistoryPage />;
            default:
                return <DashboardHomePage user={user} />;
        }
    };

    return (
        <div className="flex h-screen bg-slate-100">
            <Sidebar activeView={activeView} onNavigate={setActiveView} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header user={user} onLogout={onLogout} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};
