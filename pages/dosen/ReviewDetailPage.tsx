
import React, { useState } from 'react';
import type { Submission } from '../../types';
import { GradeTable } from '../../components/RecipeCard';

interface ReviewDetailPageProps {
  request: Submission;
  onBack: () => void;
  onSave: (updatedRequest: Submission) => void;
}

export const ReviewDetailPage: React.FC<ReviewDetailPageProps> = ({ request, onBack, onSave }) => {
  const [currentStatus, setCurrentStatus] = useState<'Pending' | 'Disetujui' | 'Ditolak'>(request.status);

  const handleSave = () => {
    if (currentStatus === 'Pending') {
        alert('Silakan pilih status "Disetujui" atau "Ditolak" sebelum menyimpan.');
        return;
    }
    onSave({ ...request, status: currentStatus });
  };

  return (
    <div className="space-y-8">
      <div>
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 font-semibold mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Daftar
        </button>
        <h1 className="text-3xl font-bold text-slate-800">Detail Pengajuan: {request.id}</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Informasi Mahasiswa</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Nama Mahasiswa</p>
            <p className="font-semibold text-slate-800">{request.studentName}</p>
          </div>
          <div>
            <p className="text-slate-500">Tanggal Pengajuan</p>
            <p className="font-semibold text-slate-800">{request.date}</p>
          </div>
          <div>
            <p className="text-slate-500">Status Saat Ini</p>
            <p className="font-semibold text-slate-800">{request.status}</p>
          </div>
        </div>
      </div>
      
      <GradeTable hasil={request.detail} />
      
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Tindakan Review</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <div>
                 <label htmlFor="status-select" className="block text-sm font-medium text-slate-700 mb-1">
                    Ubah Status Menjadi
                </label>
                <select 
                    id="status-select"
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value as 'Pending' | 'Disetujui' | 'Ditolak')}
                    className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="Pending" disabled>-- Pilih Status --</option>
                    <option value="Disetujui">Disetujui</option>
                    <option value="Ditolak">Ditolak</option>
                </select>
            </div>
             <div className="flex-grow"></div>
            <button
                onClick={handleSave}
                disabled={currentStatus === 'Pending'}
                className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
                Simpan Perubahan
            </button>
        </div>
      </div>

    </div>
  );
};