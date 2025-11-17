
import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-full inline-block";
    const statusClasses = {
        Disetujui: "bg-green-100 text-green-800",
        Ditolak: "bg-red-100 text-red-800",
        Pending: "bg-yellow-100 text-yellow-800",
    };
    const className = `${baseClasses} ${statusClasses[status as keyof typeof statusClasses] || 'bg-slate-100 text-slate-800'}`;
    return <span className={className}>{status}</span>;
};
