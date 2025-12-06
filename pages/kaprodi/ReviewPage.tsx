
import React, { useState } from 'react';
import type { Submission } from '../../types';
import { ReviewDetailPage } from './ReviewDetailPage';

const mockKonversiHasil1 = {
  daftar_matakuliah: [
    { nama_matakuliah: 'Kalkulus I', sks: 3, nilai_huruf: 'A', nilai_angka: 4.0, bobot: 12.0 },
    { nama_matakuliah: 'Fisika Dasar', sks: 3, nilai_huruf: 'B', nilai_angka: 3.0, bobot: 9.0 },
    { nama_matakuliah: 'Algoritma & Pemrograman', sks: 4, nilai_huruf: 'AB', nilai_angka: 3.5, bobot: 14.0 },
  ],
  total_sks: 10,
  total_bobot: 35.0,
  ipk: 3.50,
};

const mockKonversiHasil2 = {
  daftar_matakuliah: [
    { nama_matakuliah: 'Bahasa Inggris Teknik', sks: 2, nilai_huruf: 'A', nilai_angka: 4.0, bobot: 8.0 },
    { nama_matakuliah: 'Struktur Data', sks: 4, nilai_huruf: 'A', nilai_angka: 4.0, bobot: 16.0 },
    { nama_matakuliah: 'Jaringan Komputer', sks: 3, nilai_huruf: 'B', nilai_angka: 3.0, bobot: 9.0 },
  ],
  total_sks: 9,
  total_bobot: 33.0,
  ipk: 3.67,
};

const initialMockRequests: Submission[] = [
    { id: 'REQ-101', studentName: 'Budi Santoso', date: '2024-09-01', courses: 45, status: 'Pending', detail: mockKonversiHasil1 },
    { id: 'REQ-102', studentName: 'Citra Lestari', date: '2024-08-30', courses: 52, status: 'Pending', detail: mockKonversiHasil2 },
    { id: 'REQ-103', studentName: 'Dewi Anggraini', date: '2024-08-28', courses: 38, status: 'Pending', detail: mockKonversiHasil1 },
];

export const ReviewPage: React.FC = () => {
    const [requests, setRequests] = useState<Submission[]>(initialMockRequests);
    const [selectedRequest, setSelectedRequest] = useState<Submission | null>(null);

    const handleSelectRequest = (request: Submission) => {
        setSelectedRequest(request);
    };
    
    const handleUpdateRequest = (updatedRequest: Submission) => {
        // In a real app, this would be an API call to update the status.
        // Here, we simulate it by removing the request from the pending list.
        setRequests(prev => prev.filter(r => r.id !== updatedRequest.id));
        setSelectedRequest(null);
        alert(`Status untuk pengajuan ${updatedRequest.id} telah diperbarui menjadi "${updatedRequest.status}".`);
    };

    if (selectedRequest) {
        return (
            <ReviewDetailPage 
                request={selectedRequest}
                onBack={() => setSelectedRequest(null)}
                onSave={handleUpdateRequest}
            />
        );
    }


  return (
    <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Review Pengajuan Konversi</h1>
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID Pengajuan</th>
                            <th scope="col" className="px-6 py-3">Nama Mahasiswa</th>
                            <th scope="col" className="px-6 py-3">Tanggal</th>
                            <th scope="col" className="px-6 py-3 text-center">Jumlah MK</th>
                            <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length > 0 ? requests.map((item) => (
                            <tr key={item.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-mono text-slate-700">{item.id}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{item.studentName}</td>
                                <td className="px-6 py-4">{item.date}</td>
                                <td className="px-6 py-4 text-center">{item.courses}</td>
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => handleSelectRequest(item)}
                                        className="font-medium text-indigo-600 hover:text-indigo-800 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                                    >
                                        Review
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-slate-500">
                                    Tidak ada pengajuan yang perlu direview saat ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};