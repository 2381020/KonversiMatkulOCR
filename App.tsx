import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { UploadForm } from './components/SearchBar';
import { GradeTable } from './components/RecipeCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { WelcomeMessage } from './components/WelcomeMessage';
import { Footer } from './components/Footer';
import type { KonversiHasil } from './types';
import { konversiTranskrip } from './services/geminiService';

const App: React.FC = () => {
  const [hasilKonversi, setHasilKonversi] = useState<KonversiHasil | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = useCallback(async (image: File | null) => {
    if (!image) {
      setError('Silakan unggah gambar transkrip nilai terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasilKonversi(null);

    try {
      const result = await konversiTranskrip(image);
      setHasilKonversi(result);
    } catch (err) {
      console.error(err);
      setError('Maaf, terjadi kesalahan saat menganalisis transkrip. Pastikan gambar jelas dan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 w-full max-w-6xl">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-slate-200">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Konversi Transkrip Nilai Otomatis</h2>
          <p className="text-slate-600 mb-6">Unggah foto atau pindaian transkrip nilai Anda, dan biarkan AI menganalisis serta menghitung IPK Anda secara akurat.</p>
          <UploadForm onConvert={handleConvert} isLoading={isLoading} />
        </div>

        {isLoading && <LoadingSpinner />}
        {error && <ErrorDisplay message={error} />}
        
        {!isLoading && !error && !hasilKonversi && <WelcomeMessage />}

        {!isLoading && hasilKonversi && (
          <GradeTable hasil={hasilKonversi} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;