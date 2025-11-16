import React from 'react';

export const WelcomeMessage: React.FC = () => {
    return (
        <div className="text-center p-10 bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-2xl">
            <div className="w-20 h-20 mx-auto mb-4 text-indigo-400">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Selamat Datang di TranskripAI</h2>
            <p className="text-slate-600 max-w-lg mx-auto">
                Siap menghitung IPK Anda secara instan? Unggah gambar transkrip nilai Anda pada kolom di atas untuk memulai.
            </p>
        </div>
    );
};
