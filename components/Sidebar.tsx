import React from 'react';
import type { ActiveView } from '../pages/DashboardPage';

interface SidebarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
}

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
);
const DocumentPlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);
const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);


export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: <HomeIcon /> },
    { id: 'request', label: 'Ajukan Konversi', icon: <DocumentPlusIcon /> },
    { id: 'history', label: 'Riwayat Konversi', icon: <ClockIcon /> },
  ];
  
  return (
    <aside className="w-64 bg-white flex-shrink-0 border-r border-slate-200 flex flex-col">
       <div className="h-16 flex items-center justify-center border-b border-slate-200">
           <div className="flex items-center space-x-2">
             <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
           </div>
       </div>
       <nav className="flex-grow p-4">
           <ul>
               {navItems.map(item => (
                   <li key={item.id}>
                       <button 
                           onClick={() => onNavigate(item.id as ActiveView)}
                           className={`w-full flex items-center gap-3 px-4 py-3 my-1 rounded-lg text-sm font-medium transition-colors ${
                               activeView === item.id 
                               ? 'bg-indigo-100 text-indigo-700' 
                               : 'text-slate-600 hover:bg-slate-100'
                           }`}
                       >
                           {item.icon}
                           <span>{item.label}</span>
                       </button>
                   </li>
               ))}
           </ul>
       </nav>
    </aside>
  );
};
