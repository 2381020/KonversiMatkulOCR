import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-8 border-t border-slate-200">
      <div className="container mx-auto py-6 px-4 text-center text-slate-500 max-w-6xl">
        <p>&copy; {new Date().getFullYear()} TranskripAI. Ditenagai oleh Google Gemini.</p>
      </div>
    </footer>
  );
};
