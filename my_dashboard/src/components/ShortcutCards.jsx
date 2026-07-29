import React from 'react';
import { logClick } from '../utils/tracker';
import { Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';

export default function ShortcutCard({ id, name, url, iconName, category, onDelete }) {
    // Handles Left Click (0) and Middle/Scroll-Wheel Click (1)
    const handleTrackClick = (e) => {
        if (e.target.closest('.delete-btn')) return;

        if (e.button === 0 || e.button === 1) {
            logClick(name, category);
        }
    };

    // Handles Right Click (Context Menu)
    const handleRightClick = (e) => {
        if (e.target.closest('.delete-btn')) return;

        logClick(name, category);
        // Notice: We intentionally DO NOT call e.preventDefault()
        // so the browser's right-click menu still pops up normally!
    };

    const IconComponent = Icons[iconName] || Icons.Globe;

    return (
        <div className="relative group">
            <a
                href={url}
                onClick={handleTrackClick}
                onAuxClick={handleTrackClick}
                onContextMenu={handleRightClick}
                className="flex flex-col items-center justify-center p-6 bg-[#1E1E1E] border border-gray-800 rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:border-gray-600 hover:shadow-lg"
            >
                <IconComponent className="w-8 h-8 mb-3 text-gray-300 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium text-sm">{name}</span>
                <span className="text-xs text-gray-500 mt-1">{category}</span>
            </a>

            {/* Delete Button */}
            <button
                onClick={() => onDelete(id)}
                className="delete-btn absolute top-3 right-3 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete Shortcut"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}