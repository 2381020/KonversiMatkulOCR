import React, { useState, useCallback } from 'react';
import { UploadForm } from '../../components/SearchBar';
import { GradeTable } from '../../components/RecipeCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorDisplay } from '../../components/ErrorDisplay';
import { WelcomeMessage } from '../../components/WelcomeMessage';
import type { KonversiHasil } from '../../types';
import { konversiTranskrip } from '../../services/geminiService';

export const ConversionRequestPage: React.FC = () => {
  const [hasilKonversi, setHasilKonversi] = useState<KonversiHasil | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err) {
      console.error(err);
      setError('Maaf, terjadi kesalahan saat menganalisis transkrip. Pastikan file jelas dan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="space-y-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Langkah 1: Unggah & Ekstrak Transkrip</h2>
          <p className="text-slate-600 mb-6">Unggah file PDF atau gambar transkrip dari universitas asal. Sistem AI akan secara otomatis membaca dan mengekstrak mata kuliah beserta nilainya.</p>
          <UploadForm onConvert={handleConvert} isLoading={isLoading} />
        </div>

        {isLoading && <LoadingSpinner />}
        {error && <ErrorDisplay message={error} />}
        
        {!isLoading && !error && !hasilKonversi && <WelcomeMessage />}

        {hasilKonversi && (
          <div className="space-y-8">
            <GradeTable hasil={hasilKonversi} />
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Langkah 2: Perbandingan & Pengajuan</h2>
                <p className="text-slate-600 mb-6">Setelah data berhasil diekstrak, langkah selanjutnya adalah membandingkan mata kuliah Anda dengan kurikulum di universitas tujuan. (Fitur ini sedang dalam pengembangan)</p>
                <button
                    className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    Lanjutkan ke Perbandingan
                </button>
            </div>
          </div>
        )}
    </div>
  );
};
