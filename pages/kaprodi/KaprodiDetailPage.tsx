import React, { useState, useEffect } from 'react';
import { conversionService } from '../../services/conversionService';
import type { ConversionRequest, ConversionDetail, Curriculum, User } from '../../types';

interface KaprodiDetailPageProps {
  request: ConversionRequest;
  onBack: () => void;
  user: User;
}

export const KaprodiDetailPage: React.FC<KaprodiDetailPageProps> = ({ request, onBack, user }) => {
  const [details, setDetails] = useState<ConversionDetail[]>([]);
  const [curriculum, setCurriculum] = useState<Curriculum[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [request.id, request.target_program_id]);

  const loadData = async () => {
    try {
      const [detailsData, curriculumData] = await Promise.all([
        conversionService.getConversionDetails(request.id),
        conversionService.getCurriculum(request.target_program_id)
      ]);
      setDetails(detailsData);
      setCurriculum(curriculumData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseMapping = async (detailId: string, targetCourseId: string) => {
    const targetCourse = curriculum.find(c => c.id === targetCourseId);
    const detail = details.find(d => d.id === detailId);

    if (!targetCourse || !detail) return;

    const isConvertible = detail.origin_sks >= targetCourse.sks;

    try {
      await conversionService.updateConversionDetail(detailId, {
        target_course_id: targetCourseId,
        target_course_name: targetCourse.course_name,
        target_sks: targetCourse.sks,
        converted_grade_letter: detail.origin_grade_letter,
        converted_grade_number: detail.origin_grade_number,
        is_convertible: isConvertible,
        notes: isConvertible ? null : 'SKS asal kurang dari SKS tujuan'
      });

      setDetails(prev => prev.map(d =>
        d.id === detailId
          ? {
              ...d,
              target_course_id: targetCourseId,
              target_course_name: targetCourse.course_name,
              target_sks: targetCourse.sks,
              converted_grade_letter: detail.origin_grade_letter,
              converted_grade_number: detail.origin_grade_number,
              is_convertible: isConvertible,
              notes: isConvertible ? null : 'SKS asal kurang dari SKS tujuan'
            }
          : d
      ));
    } catch (error) {
      console.error('Error updating course mapping:', error);
      alert('Gagal menyimpan mapping mata kuliah');
    }
  };

  const handleGradeChange = async (detailId: string, newGradeLetter: string, newGradeNumber: number) => {
    try {
      await conversionService.updateConversionDetail(detailId, {
        converted_grade_letter: newGradeLetter,
        converted_grade_number: newGradeNumber
      });

      setDetails(prev => prev.map(d =>
        d.id === detailId
          ? { ...d, converted_grade_letter: newGradeLetter, converted_grade_number: newGradeNumber }
          : d
      ));
    } catch (error) {
      console.error('Error updating grade:', error);
      alert('Gagal mengubah nilai');
    }
  };

  const handleApprove = async () => {
    const convertibleCount = details.filter(d => d.is_convertible && d.target_course_id).length;

    if (convertibleCount === 0) {
      alert('Belum ada mata kuliah yang berhasil dikonversi. Pastikan semua mapping telah dilakukan dengan benar.');
      return;
    }

    const totalConvertedSks = details
      .filter(d => d.is_convertible && d.target_course_id)
      .reduce((sum, d) => sum + (d.target_sks || 0), 0);

    if (!confirm(`Anda akan menyetujui ${convertibleCount} mata kuliah (${totalConvertedSks} SKS). Lanjutkan?`)) {
      return;
    }

    setIsSaving(true);

    try {
      await conversionService.updateRequestTotals(request.id, totalConvertedSks);

      await conversionService.updateRequestStage(request.id, 'pending_student_confirmation');

      await conversionService.createApproval({
        request_id: request.id,
        stage: 'kaprodi',
        approver_id: user.id!,
        action: 'approved',
        notes: `Disetujui ${convertibleCount} dari ${details.length} mata kuliah`
      });

      alert('Pengajuan berhasil disetujui! Mahasiswa akan menerima notifikasi untuk konfirmasi.');
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
        stage: 'kaprodi',
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
        <svg className="animate-spin h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  const gradeOptions = [
    { letter: 'A', number: 4.0 },
    { letter: 'AB', number: 3.5 },
    { letter: 'B', number: 3.0 },
    { letter: 'BC', number: 2.5 },
    { letter: 'C', number: 2.0 },
    { letter: 'CD', number: 1.5 },
    { letter: 'D', number: 1.0 },
    { letter: 'E', number: 0.0 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-green-600 font-semibold mb-4"
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
            <p className="text-slate-500">Program Studi Asal</p>
            <p className="font-semibold text-slate-800">{request.origin_program}</p>
          </div>
          <div>
            <p className="text-slate-500">Program Studi Tujuan</p>
            <p className="font-semibold text-slate-800">{request.target_program?.name}</p>
          </div>
          <div>
            <p className="text-slate-500">Total SKS</p>
            <p className="font-semibold text-slate-800">{request.total_sks}</p>
          </div>
          <div>
            <p className="text-slate-500">IPK</p>
            <p className="font-semibold text-slate-800">{request.ipk.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Mapping Mata Kuliah</h2>
        <p className="text-sm text-slate-600 mb-6">
          Pilih mata kuliah tujuan yang sesuai untuk setiap mata kuliah asal.
          <span className="font-semibold"> Konversi hanya dapat dilakukan jika SKS asal ≥ SKS tujuan.</span>
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left">Mata Kuliah Asal</th>
                <th className="px-4 py-3 text-center">SKS</th>
                <th className="px-4 py-3 text-center">Nilai Asal</th>
                <th className="px-4 py-3 text-left">Mata Kuliah Tujuan</th>
                <th className="px-4 py-3 text-center">SKS</th>
                <th className="px-4 py-3 text-center">Nilai Konversi</th>
                <th className="px-4 py-3 text-center">Status</th>
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
                  <td className="px-4 py-4">
                    <input
                      list={`curriculum-${detail.id}`}
                      placeholder="Pilih atau ketik nama MK"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={detail.target_course_name || ''}
                      onChange={(e) => {
                        const selectedCourse = curriculum.find(c => c.course_name === e.target.value);
                        if (selectedCourse) {
                          handleCourseMapping(detail.id, selectedCourse.id);
                        }
                      }}
                    />
                    <datalist id={`curriculum-${detail.id}`}>
                      {curriculum.map((course) => (
                        <option key={course.id} value={course.course_name}>
                          {course.course_code} - {course.sks} SKS
                        </option>
                      ))}
                    </datalist>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {detail.target_sks || '-'}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {detail.target_course_id ? (
                      <select
                        value={detail.converted_grade_letter || ''}
                        onChange={(e) => {
                          const selected = gradeOptions.find(g => g.letter === e.target.value);
                          if (selected) {
                            handleGradeChange(detail.id, selected.letter, selected.number);
                          }
                        }}
                        className="px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {gradeOptions.map(opt => (
                          <option key={opt.letter} value={opt.letter}>
                            {opt.letter} ({opt.number})
                          </option>
                        ))}
                      </select>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {!detail.target_course_id ? (
                      <span className="text-slate-500 text-xs">Belum dipilih</span>
                    ) : detail.is_convertible ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Dapat Dikonversi
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        Tidak Dapat
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-600">Total Mata Kuliah</p>
              <p className="text-lg font-bold text-slate-800">{details.length}</p>
            </div>
            <div>
              <p className="text-slate-600">Dapat Dikonversi</p>
              <p className="text-lg font-bold text-green-600">
                {details.filter(d => d.is_convertible && d.target_course_id).length}
              </p>
            </div>
            <div>
              <p className="text-slate-600">Total SKS Terkonversi</p>
              <p className="text-lg font-bold text-green-600">
                {details
                  .filter(d => d.is_convertible && d.target_course_id)
                  .reduce((sum, d) => sum + (d.target_sks || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Tindakan Review</h3>
        <div className="flex gap-4">
          <button
            onClick={handleReject}
            disabled={isSaving}
            className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            Tolak Pengajuan
          </button>
          <button
            onClick={handleApprove}
            disabled={isSaving}
            className="flex-1 px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Memproses...' : 'Setujui Pengajuan'}
          </button>
        </div>
      </div>
    </div>
  );
};
