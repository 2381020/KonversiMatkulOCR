import React, { useState, useEffect } from 'react';
import { supabase, type Prodi } from '../lib/supabase';

interface StudentDataFormProps {
  onSubmit: (data: StudentData) => void;
  isLoading: boolean;
}

export interface StudentData {
  universitas_asal: string;
  prodi_asal: string;
  prodi_tujuan_id: string;
}

export const StudentDataForm: React.FC<StudentDataFormProps> = ({ onSubmit, isLoading }) => {
  const [universitasAsal, setUniversitasAsal] = useState('');
  const [prodiAsal, setProdiAsal] = useState('');
  const [prodiTujuanId, setProdiTujuanId] = useState('');
  const [prodiList, setProdiList] = useState<Prodi[]>([]);
  const [loadingProdi, setLoadingProdi] = useState(true);

  useEffect(() => {
    fetchProdi();
  }, []);

  const fetchProdi = async () => {
    try {
      const { data, error } = await supabase
        .from('prodi')
        .select('*')
        .order('nama');

      if (error) throw error;
      setProdiList(data || []);
    } catch (error) {
      console.error('Error fetching prodi:', error);
    } finally {
      setLoadingProdi(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      universitas_asal: universitasAsal,
      prodi_asal: prodiAsal,
      prodi_tujuan_id: prodiTujuanId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="universitasAsal" className="block text-sm font-medium text-slate-700 mb-1">
          Universitas Asal
        </label>
        <input
          type="text"
          id="universitasAsal"
          required
          value={universitasAsal}
          onChange={(e) => setUniversitasAsal(e.target.value)}
          placeholder="Contoh: Universitas Indonesia"
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="prodiAsal" className="block text-sm font-medium text-slate-700 mb-1">
          Program Studi Asal
        </label>
        <input
          type="text"
          id="prodiAsal"
          required
          value={prodiAsal}
          onChange={(e) => setProdiAsal(e.target.value)}
          placeholder="Contoh: Teknik Informatika"
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="prodiTujuan" className="block text-sm font-medium text-slate-700 mb-1">
          Program Studi Tujuan (UNAI)
        </label>
        {loadingProdi ? (
          <div className="text-sm text-slate-500">Memuat program studi...</div>
        ) : (
          <select
            id="prodiTujuan"
            required
            value={prodiTujuanId}
            onChange={(e) => setProdiTujuanId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={isLoading}
          >
            <option value="">-- Pilih Program Studi --</option>
            {prodiList.map((prodi) => (
              <option key={prodi.id} value={prodi.id}>
                {prodi.nama} ({prodi.kode})
              </option>
            ))}
          </select>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || loadingProdi}
        className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isLoading ? 'Memproses...' : 'Lanjut ke Upload Transkrip'}
      </button>
    </form>
  );
};
