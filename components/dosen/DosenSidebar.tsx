
import React from 'react';

export type DosenActiveView = 'review' | 'archive';

interface DosenSidebarProps {
  activeView: DosenActiveView;
  onNavigate: (view: DosenActiveView) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ReviewIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const ArchiveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
);


export const DosenSidebar: React.FC<DosenSidebarProps> = ({ activeView, onNavigate, isOpen, onClose }) => {
  const navItems = [
    { id: 'review', label: 'Review Pengajuan', icon: <ReviewIcon /> },
    { id: 'archive', label: 'Arsip Konversi', icon: <ArchiveIcon /> },
  ];
  
  return (
    <>
        {/* Overlay for mobile */}
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        ></div>

        <aside className={`w-64 bg-white flex-shrink-0 border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out md:static md:transform-none ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
           <div className="h-16 flex items-center justify-between border-b border-slate-200 px-4">
               <div className="flex items-center space-x-2">
                 <h1 className="text-xl font-bold text-slate-800">Dosen</h1>
               </div>
               <button onClick={onClose} className="md:hidden p-2 text-slate-500 hover:text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
               </button>
           </div>
           <nav className="flex-grow p-4">
               <ul>
                   {navItems.map(item => (
                       <li key={item.id}>
                           <button 
                               onClick={() => onNavigate(item.id as DosenActiveView)}
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
    </>
  );
};
