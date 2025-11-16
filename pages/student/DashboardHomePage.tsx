import React from 'react';
import type { User } from '../../types';

interface DashboardHomePageProps {
  user: User;
}

// Fix: Replaced JSX.Element with React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
const StatCard: React.FC<{title: string; value: string; icon: React.ReactNode}> = ({title, value, icon}) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 flex items-center gap-4">
        <div className="bg-indigo-100 text-indigo-600 rounded-full p-3">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

export const DashboardHomePage: React.FC<DashboardHomePageProps> = ({ user }) => {
    const stats = [
        { title: 'Total SKS Dibawa', value: '144', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> },
        { title: 'Total SKS Dikonversi', value: '120', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
        { title: 'Status Konversi Terbaru', value: 'Disetujui', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    ];
    
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Selamat datang kembali, {user.name.split(' ')[0]}!</h1>
        <p className="text-slate-600 mt-1">Berikut adalah ringkasan dari aktivitas konversi nilai Anda.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
      </div>

       <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
           <h2 className="text-xl font-bold text-slate-800 mb-4">Mulai Pengajuan Baru</h2>
           <p className="text-slate-600 mb-4">Siap untuk mengajukan konversi baru? Silakan navigasi ke halaman "Ajukan Konversi" untuk memulai proses upload transkrip dan perbandingan mata kuliah.</p>
           <button className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors">
               Mulai Ajukan Konversi
           </button>
       </div>

    </div>
  );
};
