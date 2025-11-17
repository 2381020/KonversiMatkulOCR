
import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { DosenSidebar, DosenActiveView } from '../../components/dosen/DosenSidebar';
import { ReviewPage } from './ReviewPage';
import { ArchivePage } from './ArchivePage';
import type { User } from '../../types';

interface DosenDashboardPageProps {
    user: User;
    onLogout: () => void;
}

export const DosenDashboardPage: React.FC<DosenDashboardPageProps> = ({ user, onLogout }) => {
    const [activeView, setActiveView] = useState<DosenActiveView>('review');
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleNavigate = (view: DosenActiveView) => {
        setActiveView(view);
        setSidebarOpen(false);
    };

    const renderContent = () => {
        switch (activeView) {
            case 'review':
                return <ReviewPage />;
            case 'archive':
                return <ArchivePage />;
            default:
                return <ReviewPage />;
        }
    };

    return (
        <div className="flex h-screen bg-slate-100">
            <DosenSidebar 
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
