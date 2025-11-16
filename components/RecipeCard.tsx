import React from 'react';
import type { KonversiHasil } from '../types';

interface GradeTableProps {
  hasil: KonversiHasil;
}

export const GradeTable: React.FC<GradeTableProps> = ({ hasil }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
      <h3 className="text-2xl font-bold text-slate-800 mb-6">Hasil Analisis Transkrip</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-l-lg">No.</th>
              <th scope="col" className="px-6 py-3">Nama Mata Kuliah</th>
              <th scope="col" className="px-6 py-3 text-center">SKS</th>
              <th scope="col" className="px-6 py-3 text-center">Nilai</th>
              <th scope="col" className="px-6 py-3 text-center">Angka</th>
              <th scope="col" className="px-6 py-3 text-center rounded-r-lg">Bobot</th>
            </tr>
          </thead>
          <tbody>
            {hasil.daftar_matakuliah.map((mk, index) => (
              <tr key={index} className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-slate-900">{index + 1}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{mk.nama_matakuliah}</td>
                <td className="px-6 py-4 text-center">{mk.sks}</td>
                <td className="px-6 py-4 text-center">{mk.nilai_huruf}</td>
                <td className="px-6 py-4 text-center">{mk.nilai_angka.toFixed(1)}</td>
                <td className="px-6 py-4 text-center">{mk.bobot.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="font-semibold text-slate-800">
            <tr className="bg-slate-50">
                <td colSpan={2} className="px-6 py-3 text-right">Total</td>
                <td className="px-6 py-3 text-center">{hasil.total_sks}</td>
                <td colSpan={2}></td>
                <td className="px-6 py-3 text-center">{hasil.total_bobot.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-8 flex justify-center md:justify-end">
        <div className="bg-indigo-600 text-white rounded-xl p-6 shadow-xl text-center">
            <h4 className="text-lg font-medium text-indigo-200">Indeks Prestasi Kumulatif (IPK)</h4>
            <p className="text-5xl font-bold tracking-tight mt-1">{hasil.ipk.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};
