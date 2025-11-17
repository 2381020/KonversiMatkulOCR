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
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleNavigate = (view: ActiveView) => {
        setActiveView(view);
        setSidebarOpen(false); // Close sidebar on navigation
    };

    const renderContent = () => {
        switch (activeView) {
            case 'home':
                return <DashboardHomePage user={user} onNavigate={handleNavigate} />;
            case 'request':
                return <ConversionRequestPage />;
            case 'history':
                return <ConversionHistoryPage />;
            default:
                return <DashboardHomePage user={user} onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="flex h-screen bg-slate-100">
            <Sidebar 
                activeView={activeView} 
                onNavigate={handleNavigate}
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    user={user} 
                    onLogout={onLogout} 
                    onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};