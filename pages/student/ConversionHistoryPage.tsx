import React, { useState, useEffect } from 'react';
import { conversionService } from '../../services/conversionService';
import type { ConversionRequest, ConversionDetail, User } from '../../types';

interface ConversionHistoryPageProps {
  user?: User;
}

const stageLabels: Record<string, string> = {
  pending_student: 'Draft',
  pending_kaprodi: 'Menunggu Review Kaprodi',
  pending_student_confirmation: 'Menunggu Konfirmasi Anda',
  pending_dean: 'Menunggu Review Dekan',
  pending_baa: 'Menunggu Finalisasi BAA',
  approved: 'Disetujui',
  rejected: 'Ditolak'
};

export const ConversionHistoryPage: React.FC<ConversionHistoryPageProps> = ({ user }) => {
  const [requests, setRequests] = useState<ConversionRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ConversionRequest | null>(null);
  const [details, setDetails] = useState<ConversionDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadRequests();
    }
  }, [user?.id]);

  const loadRequests = async () => {
    if (!user?.id) return;

    try {
      const data = await conversionService.getStudentRequests(user.id);
      setRequests(data);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (request: ConversionRequest) => {
    try {
      const detailsData = await conversionService.getConversionDetails(request.id);
      setDetails(detailsData.filter(d => d.is_convertible));
      setSelectedRequest(request);
    } catch (error) {
      console.error('Error loading details:', error);
      alert('Gagal memuat detail pengajuan');
    }
  };

  const handleConfirm = async () => {
    if (!selectedRequest || !user?.id) return;

    if (!confirm('Anda yakin menyetujui hasil konversi ini? Setelah konfirmasi, pengajuan akan dikirim ke Dekan.')) {
      return;
    }

    setIsConfirming(true);

    try {
      await conversionService.updateRequestStage(selectedRequest.id, 'pending_dean');

      await conversionService.createApproval({
        request_id: selectedRequest.id,
        stage: 'student_confirmation',
        approver_id: user.id,
        action: 'approved',
        notes: 'Mahasiswa menyetujui hasil konversi'
      });

      alert('Konfirmasi berhasil! Pengajuan akan direview oleh Dekan.');
      setSelectedRequest(null);
      setDetails([]);
      loadRequests();
    } catch (error) {
      console.error('Error confirming request:', error);
      alert('Gagal melakukan konfirmasi. Silakan coba lagi.');
    } finally {
      setIsConfirming(false);
    }
  };

  const getStatusBadge = (stage: string) => {
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-full inline-block";

    if (stage === 'approved') {
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>{stageLabels[stage]}</span>;
    } else if (stage === 'rejected') {
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>{stageLabels[stage]}</span>;
    } else if (stage === 'pending_student_confirmation') {
      return <span className={`${baseClasses} bg-amber-100 text-amber-800 animate-pulse`}>{stageLabels[stage]}</span>;
    } else {
      return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>{stageLabels[stage]}</span>;
    }
  };

  if (selectedRequest) {
    return (
      <div className="space-y-6">
        <div>
          <button
            onClick={() => {
              setSelectedRequest(null);
              setDetails([]);
            }}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-green-600 font-semibold mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Riwayat
          </button>
          <h1 className="text-3xl font-bold text-slate-800">Detail Pengajuan: {selectedRequest.request_number}</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Informasi Pengajuan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Status</p>
              <div className="mt-1">{getStatusBadge(selectedRequest.current_stage)}</div>
            </div>
            <div>
              <p className="text-slate-500">Program Studi Tujuan</p>
              <p className="font-semibold text-slate-800">{selectedRequest.target_program?.name}</p>
            </div>
            <div>
              <p className="text-slate-500">SKS Terkonversi</p>
              <p className="font-semibold text-green-600 text-lg">{selectedRequest.total_converted_sks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Hasil Konversi</h2>

          {details.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Mata Kuliah Asal</th>
                    <th className="px-4 py-3 text-center">SKS</th>
                    <th className="px-4 py-3 text-center">Nilai</th>
                    <th className="px-4 py-3 text-left">Mata Kuliah Tujuan</th>
                    <th className="px-4 py-3 text-center">SKS</th>
                    <th className="px-4 py-3 text-center">Nilai Konversi</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((detail) => (
                    <tr key={detail.id} className="border-b hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium text-slate-900">{detail.origin_course_name}</td>
                      <td className="px-4 py-4 text-center">{detail.origin_sks}</td>
                      <td className="px-4 py-4 text-center">
                        {detail.origin_grade_letter} ({detail.origin_grade_number})
                      </td>
                      <td className="px-4 py-4 font-medium text-green-800">{detail.target_course_name}</td>
                      <td className="px-4 py-4 text-center">{detail.target_sks}</td>
                      <td className="px-4 py-4 text-center">
                        {detail.converted_grade_letter} ({detail.converted_grade_number})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-500 text-center py-6">Belum ada mata kuliah yang dikonversi.</p>
          )}
        </div>

        {selectedRequest.current_stage === 'pending_student_confirmation' && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl font-bold text-amber-900 mb-2">Konfirmasi Diperlukan</h3>
            <p className="text-amber-800 mb-6">
              Kaprodi telah menyetujui hasil konversi di atas. Silakan review dan konfirmasi jika Anda setuju.
              Setelah konfirmasi, pengajuan akan diteruskan ke Dekan untuk persetujuan final.
            </p>
            <button
              onClick={handleConfirm}
              disabled={isConfirming}
              className="w-full px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              {isConfirming ? 'Memproses...' : 'Saya Setuju & Lanjutkan ke Dekan'}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Riwayat Pengajuan Konversi</h1>

      {isLoading ? (
        <div className="flex justify-center items-center p-10">
          <svg className="animate-spin h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3">No. Pengajuan</th>
                  <th scope="col" className="px-6 py-3">Tanggal</th>
                  <th scope="col" className="px-6 py-3">Prodi Tujuan</th>
                  <th scope="col" className="px-6 py-3 text-center">SKS Terkonversi</th>
                  <th scope="col" className="px-6 py-3 text-center">Status</th>
                  <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <tr key={request.id} className="bg-white border-b hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-slate-700">{request.request_number}</td>
                      <td className="px-6 py-4">{new Date(request.created_at).toLocaleDateString('id-ID')}</td>
                      <td className="px-6 py-4">{request.target_program?.name || '-'}</td>
                      <td className="px-6 py-4 text-center">{request.total_converted_sks || '-'}</td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(request.current_stage)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="font-medium text-green-600 hover:text-green-800 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
                        >
                          {request.current_stage === 'pending_student_confirmation' ? 'Konfirmasi' : 'Lihat Detail'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-500">
                      Belum ada pengajuan konversi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
