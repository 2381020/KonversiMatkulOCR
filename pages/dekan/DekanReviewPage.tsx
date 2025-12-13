import React, { useState, useEffect } from 'react';
import { conversionService } from '../../services/conversionService';
import type { ConversionRequest, User } from '../../types';
import { DekanDetailPage } from './DekanDetailPage';

interface DekanReviewPageProps {
  user: User;
}

export const DekanReviewPage: React.FC<DekanReviewPageProps> = ({ user }) => {
  const [requests, setRequests] = useState<ConversionRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ConversionRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await conversionService.getAllPendingRequests('pending_dean');
      setRequests(data);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRequest = (request: ConversionRequest) => {
    setSelectedRequest(request);
  };

  const handleBack = () => {
    setSelectedRequest(null);
    loadRequests();
  };

  if (selectedRequest) {
    return <DekanDetailPage request={selectedRequest} onBack={handleBack} user={user} />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Review Konversi - Dekan</h1>

      {isLoading ? (
        <div className="flex justify-center items-center p-10">
          <svg className="animate-spin h-10 w-10 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                  <th scope="col" className="px-6 py-3">Nama Mahasiswa</th>
                  <th scope="col" className="px-6 py-3">Prodi Tujuan</th>
                  <th scope="col" className="px-6 py-3 text-center">SKS Dikonversi</th>
                  <th scope="col" className="px-6 py-3 text-center">IPK</th>
                  <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <tr key={request.id} className="bg-white border-b hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-slate-700">{request.request_number}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{request.student_name}</td>
                      <td className="px-6 py-4">{request.target_program?.name}</td>
                      <td className="px-6 py-4 text-center">{request.total_converted_sks}</td>
                      <td className="px-6 py-4 text-center">{request.ipk.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleSelectRequest(request)}
                          className="font-medium text-amber-600 hover:text-amber-800 px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-500">
                      Tidak ada pengajuan yang perlu direview saat ini.
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
