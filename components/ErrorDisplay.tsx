
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-lg" role="alert">
      <div className="flex">
        <div className="py-1">
          <svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 012 0v4a1 1 0 01-2 0V9zm1-4a1 1 0 110 2 1 1 0 010-2z"/></svg>
        </div>
        <div>
          <p className="font-bold">Terjadi Kesalahan</p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};
