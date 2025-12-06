
import React from 'react';
import { StatusBadge } from '../../components/StatusBadge';

const mockArchive = [
    { id: 'CONV-001', studentName: 'Ahmad Dahlan', date: '2024-07-15', courses: 45, status: 'Disetujui', reviewer: 'Dr. Amelia Sari' },
    { id: 'CONV-002', studentName: 'Bima Sakti', date: '2024-08-01', courses: 5, status: 'Ditolak', reviewer: 'Dr. Hendra Gunawan' },
    { id: 'CONV-004', studentName: 'Kartika Sari', date: '2023-12-10', courses: 38, status: 'Disetujui', reviewer: 'Dr. Amelia Sari' },
];

export const ArchivePage: React.FC = () => {
  return (
    <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Arsip Pengajuan Konversi</h1>
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Mahasiswa</th>
                            <th scope="col" className="px-6 py-3">Tanggal</th>
                            <th scope="col" className="px-6 py-3 text-center">Status</th>
                            <th scope="col" className="px-6 py-3">Direview Oleh</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockArchive.map((item) => (
                            <tr key={item.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-mono text-slate-700">{item.id}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{item.studentName}</td>
                                <td className="px-6 py-4">{item.date}</td>
                                <td className="px-6 py-4 text-center">
                                    <StatusBadge status={item.status} />
                                </td>
                                <td className="px-6 py-4 text-slate-700">{item.reviewer}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};
