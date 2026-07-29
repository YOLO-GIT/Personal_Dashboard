import React from 'react';
import { logClick } from '../utils/tracker';

export default function ShortcutCard({ name, url, icon: Icon, category, accentColor }) {
    const handleClick = () => {
        logClick(name, category);
    };

    return (
        <a
            href={url}
            onClick={handleClick}
            className={`group flex flex-col items-center justify-center p-6 bg-[#1E1E1E] border border-gray-800 rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:border-gray-600 ${accentColor}`}
        >
            <Icon className="w-8 h-8 mb-3 text-gray-300 group-hover:scale-110 transition-transform" />
            <span className="text-white font-medium text-sm">{name}</span>
        </a>
    );
}