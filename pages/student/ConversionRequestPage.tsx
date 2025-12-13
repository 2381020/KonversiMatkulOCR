import React, { useState, useCallback, useEffect } from 'react';
import { UploadForm } from '../../components/SearchBar';
import { GradeTable } from '../../components/RecipeCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorDisplay } from '../../components/ErrorDisplay';
import type { KonversiHasil, StudyProgram, User } from '../../types';
import { konversiTranskrip } from '../../services/geminiService';
import { conversionService } from '../../services/conversionService';

interface ConversionRequestPageProps {
  user?: User;
}

interface FormData {
  studentName: string;
  originUniversity: string;
  originProgram: string;
  targetProgramId: string;
}

export const ConversionRequestPage: React.FC<ConversionRequestPageProps> = ({ user }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    studentName: user?.name || '',
    originUniversity: '',
    originProgram: '',
    targetProgramId: ''
  });
  const [studyPrograms, setStudyPrograms] = useState<StudyProgram[]>([]);
  const [hasilKonversi, setHasilKonversi] = useState<KonversiHasil | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    loadStudyPrograms();
  }, []);

  const loadStudyPrograms = async () => {
    try {
      const programs = await conversionService.getStudyPrograms();
      setStudyPrograms(programs);
    } catch (err) {
      console.error('Error loading study programs:', err);
    }
  };

  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStepOne = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.originUniversity || !formData.originProgram || !formData.targetProgramId) {
      setError('Mohon lengkapi semua data diri terlebih dahulu.');
      return;
    }
    setError(null);
    setCurrentStep(2);
  };

  const handleConvert = useCallback(async (file: File | null) => {
    if (!file) {
      setError('Silakan unggah file transkrip nilai terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasilKonversi(null);

    try {
      const result = await konversiTranskrip(file);
      setHasilKonversi(result);
      setCurrentStep(3);
    } catch (err) {
      console.error(err);
      setError('Maaf, terjadi kesalahan saat menganalisis transkrip. Pastikan file jelas dan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = async () => {
    if (!hasilKonversi || !user?.id) {
      setError('Data tidak lengkap. Silakan coba lagi.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const request = await conversionService.createConversionRequest({
        student_id: user.id,
        student_name: formData.studentName,
        origin_university: formData.originUniversity,
        origin_program: formData.originProgram,
        target_program_id: formData.targetProgramId,
        total_sks: hasilKonversi.total_sks,
        ipk: hasilKonversi.ipk
      });

      const details = hasilKonversi.daftar_matakuliah.map(mk => ({
        request_id: request.id,
        origin_course_name: mk.nama_matakuliah,
        origin_sks: mk.sks,
        origin_grade_letter: mk.nilai_huruf,
        origin_grade_number: mk.nilai_angka
      }));

      await conversionService.saveConversionDetails(details);

      await conversionService.updateRequestStage(request.id, 'pending_kaprodi', 'submitted');

      alert('Pengajuan konversi berhasil dikirim! Silakan tunggu review dari Kaprodi.');

      setFormData({
        studentName: user?.name || '',
        originUniversity: '',
        originProgram: '',
        targetProgramId: ''
      });
      setHasilKonversi(null);
      setCurrentStep(1);
    } catch (err) {
      console.error('Error submitting request:', err);
      setError('Gagal mengirim pengajuan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                currentStep >= step ? 'bg-green-600 text-white' : 'bg-slate-300 text-slate-600'
              }`}>
                {currentStep > step ? '✓' : step}
              </div>
              <p className="text-xs mt-2 text-slate-600 text-center">
                {step === 1 && 'Data Diri'}
                {step === 2 && 'Upload Transkrip'}
                {step === 3 && 'Review & Submit'}
              </p>
            </div>
            {step < 3 && (
              <div className={`flex-1 h-1 mx-2 ${
                currentStep > step ? 'bg-green-600' : 'bg-slate-300'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderStepOne = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Langkah 1: Data Diri</h2>
      <p className="text-slate-600 mb-6">Lengkapi data diri dan informasi program studi yang dituju.</p>

      <form onSubmit={handleStepOne} className="space-y-6">
        <div>
          <label htmlFor="studentName" className="block text-sm font-medium text-slate-700 mb-2">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            id="studentName"
            type="text"
            value={formData.studentName}
            onChange={(e) => handleFormChange('studentName', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Masukkan nama lengkap"
            required
          />
        </div>

        <div>
          <label htmlFor="originUniversity" className="block text-sm font-medium text-slate-700 mb-2">
            Universitas Asal <span className="text-red-500">*</span>
          </label>
          <input
            id="originUniversity"
            type="text"
            value={formData.originUniversity}
            onChange={(e) => handleFormChange('originUniversity', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Contoh: Universitas Indonesia"
            required
          />
        </div>

        <div>
          <label htmlFor="originProgram" className="block text-sm font-medium text-slate-700 mb-2">
            Program Studi Asal <span className="text-red-500">*</span>
          </label>
          <input
            id="originProgram"
            type="text"
            value={formData.originProgram}
            onChange={(e) => handleFormChange('originProgram', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Contoh: Teknik Informatika"
            required
          />
        </div>

        <div>
          <label htmlFor="targetProgram" className="block text-sm font-medium text-slate-700 mb-2">
            Program Studi Tujuan <span className="text-red-500">*</span>
          </label>
          <select
            id="targetProgram"
            value={formData.targetProgramId}
            onChange={(e) => handleFormChange('targetProgramId', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">-- Pilih Program Studi --</option>
            {studyPrograms.map(program => (
              <option key={program.id} value={program.id}>
                {program.name} ({program.code}) - {program.faculty}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
        >
          Lanjut ke Upload Transkrip
        </button>
      </form>
    </div>
  );

  const renderStepTwo = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Langkah 2: Upload Transkrip</h2>
        <p className="text-slate-600 mb-6">Unggah file PDF atau gambar transkrip dari universitas asal. Sistem AI akan secara otomatis membaca dan mengekstrak mata kuliah beserta nilainya.</p>
        <UploadForm onConvert={handleConvert} isLoading={isLoading} />
      </div>

      {isLoading && <LoadingSpinner />}

      <button
        onClick={() => setCurrentStep(1)}
        className="text-slate-600 hover:text-green-600 font-semibold flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke Data Diri
      </button>
    </div>
  );

  const renderStepThree = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Langkah 3: Review Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p className="text-slate-500">Nama Mahasiswa</p>
            <p className="font-semibold text-slate-800">{formData.studentName}</p>
          </div>
          <div>
            <p className="text-slate-500">Universitas Asal</p>
            <p className="font-semibold text-slate-800">{formData.originUniversity}</p>
          </div>
          <div>
            <p className="text-slate-500">Program Studi Asal</p>
            <p className="font-semibold text-slate-800">{formData.originProgram}</p>
          </div>
          <div>
            <p className="text-slate-500">Program Studi Tujuan</p>
            <p className="font-semibold text-slate-800">
              {studyPrograms.find(p => p.id === formData.targetProgramId)?.name || '-'}
            </p>
          </div>
        </div>
      </div>

      {hasilKonversi && <GradeTable hasil={hasilKonversi} />}

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Konfirmasi Pengajuan</h3>
        <p className="text-slate-600 mb-6">
          Dengan menekan tombol "Ajukan Konversi", Anda menyetujui bahwa data yang telah dimasukkan adalah benar dan akan diproses oleh Kaprodi.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => setCurrentStep(2)}
            className="px-6 py-3 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
          >
            Kembali
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Mengirim...' : 'Ajukan Konversi'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {renderProgressBar()}
      {error && <ErrorDisplay message={error} />}

      {currentStep === 1 && renderStepOne()}
      {currentStep === 2 && renderStepTwo()}
      {currentStep === 3 && renderStepThree()}
    </div>
  );
};
