import React, { useState, useEffect } from 'react';
import { conversionService } from '../../services/conversionService';
import type { ConversionRequest, ConversionDetail, User } from '../../types';

interface BAADetailPageProps {
  request: ConversionRequest;
  onBack: () => void;
  user: User;
}

export const BAADetailPage: React.FC<BAADetailPageProps> = ({ request, onBack, user }) => {
  const [details, setDetails] = useState<ConversionDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadDetails();
  }, [request.id]);

  const loadDetails = async () => {
    try {
      const data = await conversionService.getConversionDetails(request.id);
      setDetails(data.filter(d => d.is_convertible));
    } catch (error) {
      console.error('Error loading details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm('Anda akan menyetujui pengajuan ini dan mengirimnya ke Dekan. Lanjutkan?')) {
      return;
    }

    setIsSaving(true);

    try {
      await conversionService.updateRequestStage(request.id, 'pending_dean');

      await conversionService.createApproval({
        request_id: request.id,
        stage: 'baa',
        approver_id: user.id!,
        action: 'approved',
        notes: 'Validasi BAA selesai, diteruskan ke Dekan'
      });

      alert('Pengajuan berhasil disetujui dan dikirim ke Dekan!');
      onBack();
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Gagal menyetujui pengajuan. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt('Masukkan alasan penolakan:');
    if (!reason) return;

    setIsSaving(true);

    try {
      await conversionService.updateRequestStage(request.id, 'rejected', 'rejected');

      await conversionService.createApproval({
        request_id: request.id,
        stage: 'baa',
        approver_id: user.id!,
        action: 'rejected',
        notes: reason
      });

      alert('Pengajuan berhasil ditolak.');
      onBack();
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Gagal menolak pengajuan. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 font-semibold mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Daftar
        </button>
        <h1 className="text-3xl font-bold text-slate-800">Detail Pengajuan: {request.request_number}</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Informasi Mahasiswa</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Nama Mahasiswa</p>
            <p className="font-semibold text-slate-800">{request.student_name}</p>
          </div>
          <div>
            <p className="text-slate-500">Universitas Asal</p>
            <p className="font-semibold text-slate-800">{request.origin_university}</p>
          </div>
          <div>
            <p className="text-slate-500">Program Studi Tujuan</p>
            <p className="font-semibold text-slate-800">{request.target_program?.name}</p>
          </div>
          <div>
            <p className="text-slate-500">Total SKS Asal</p>
            <p className="font-semibold text-slate-800">{request.total_sks}</p>
          </div>
          <div>
            <p className="text-slate-500">SKS Terkonversi</p>
            <p className="font-semibold text-green-600 text-lg">{request.total_converted_sks}</p>
          </div>
          <div>
            <p className="text-slate-500">IPK</p>
            <p className="font-semibold text-slate-800">{request.ipk.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Hasil Konversi dari Kaprodi</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left">Mata Kuliah Asal</th>
                <th className="px-4 py-3 text-center">SKS Asal</th>
                <th className="px-4 py-3 text-center">Nilai Asal</th>
                <th className="px-4 py-3 text-left">Mata Kuliah Tujuan</th>
                <th className="px-4 py-3 text-center">SKS Tujuan</th>
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

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Validasi BAA:</strong> Pastikan jumlah SKS dan nilai yang dikonversi sudah sesuai dengan ketentuan yang berlaku.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Tindakan Validasi</h3>
        <div className="flex gap-4">
          <button
            onClick={handleReject}
            disabled={isSaving}
            className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            Tolak
          </button>
          <button
            onClick={handleApprove}
            disabled={isSaving}
            className="flex-1 px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Memproses...' : 'Setujui & Kirim ke Dekan'}
          </button>
        </div>
      </div>
    </div>
  );
};
