
import React from 'react';
import { StatusBadge } from '../../components/StatusBadge';

const mockHistory = [
    { id: 'CONV-001', date: '2024-07-15', courses: 45, status: 'Disetujui' },
    { id: 'CONV-002', date: '2024-08-01', courses: 5, status: 'Ditolak' },
    { id: 'CONV-003', date: '2024-08-20', courses: 52, status: 'Pending' },
    { id: 'CONV-004', date: '2023-12-10', courses: 38, status: 'Disetujui' },
];

export const ConversionHistoryPage: React.FC = () => {
  return (
    <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Riwayat Pengajuan Konversi</h1>
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID Pengajuan</th>
                            <th scope="col" className="px-6 py-3">Tanggal</th>
                            <th scope="col" className="px-6 py-3 text-center">Jumlah MK</th>
                            <th scope="col" className="px-6 py-3 text-center">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockHistory.map((item) => (
                            <tr key={item.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-mono text-slate-700">{item.id}</td>
                                <td className="px-6 py-4">{item.date}</td>
                                <td className="px-6 py-4 text-center">{item.courses}</td>
                                <td className="px-6 py-4 text-center">
                                    <StatusBadge status={item.status} />
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {item.status === 'Disetujui' && (
                                        <button 
                                            onClick={() => alert('Fitur cetak PDF sedang dalam pengembangan.')}
                                            className="font-medium text-indigo-600 hover:text-indigo-800"
                                        >
                                            Cetak PDF
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};
