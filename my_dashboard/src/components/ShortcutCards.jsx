import React from 'react';
import { logClick } from '../utils/tracker';
import { Trash2, ExternalLink, Pin } from 'lucide-react';
import * as Icons from 'lucide-react';

// Brand-specific color profiles for recognized platforms
const BRAND_THEMES = {
    YouTube: {
        gradient: 'from-red-500/15 via-red-600/5 to-transparent',
        border: 'hover:border-red-500/50',
        badge: 'bg-red-500/10 text-red-400 border-red-500/20',
        shadow: 'hover:shadow-red-500/10',
    },
    GitHub: {
        gradient: 'from-purple-500/15 via-indigo-600/5 to-transparent',
        border: 'hover:border-purple-500/50',
        badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        shadow: 'hover:shadow-purple-500/10',
    },
    LeetCode: {
        gradient: 'from-amber-500/15 via-orange-600/5 to-transparent',
        border: 'hover:border-amber-500/50',
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        shadow: 'hover:shadow-amber-500/10',
    },
    Telegram: {
        gradient: 'from-sky-500/15 via-blue-600/5 to-transparent',
        border: 'hover:border-sky-400/50',
        badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
        shadow: 'hover:shadow-sky-500/10',
    },
    Twitter: {
        gradient: 'from-blue-400/15 via-slate-600/5 to-transparent',
        border: 'hover:border-blue-400/50',
        badge: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
        shadow: 'hover:shadow-blue-400/10',
    },
    WhatsApp: {
        gradient: 'from-emerald-500/15 via-green-600/5 to-transparent',
        border: 'hover:border-emerald-500/50',
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        shadow: 'hover:shadow-emerald-500/10',
    },
};

const DEFAULT_THEME = {
    gradient: 'from-emerald-500/15 via-emerald-600/5 to-transparent',
    border: 'hover:border-emerald-500/50',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    shadow: 'hover:shadow-emerald-500/10',
};

export default function ShortcutCard({
    id,
    name,
    url,
    iconName,
    category,
    isPinned,
    onDelete,
    onTogglePin,
}) {
    const theme = BRAND_THEMES[name] || DEFAULT_THEME;
    const IconComponent = Icons[iconName] || Icons.Globe;

    const handleTrackClick = (e) => {
        // Ignore clicks on action buttons (pin / delete)
        if (e.target.closest('.action-btn')) return;
        if (e.button === 0 || e.button === 1) {
            logClick(name, category);
        }
    };

    const handleRightClick = (e) => {
        if (e.target.closest('.action-btn')) return;
        logClick(name, category);
    };

    return (
        <div className="relative group">
            <a
                href={url}
                onClick={handleTrackClick}
                onAuxClick={handleTrackClick}
                onContextMenu={handleRightClick}
                className={`flex items-center justify-between p-4 bg-[#161616] bg-linear-to-r ${theme.gradient
                    } border ${isPinned ? 'border-emerald-500/60 shadow-md shadow-emerald-900/20' : 'border-gray-800/80'
                    } rounded-2xl transition-all duration-300 hover:-translate-y-1.5 ${theme.border
                    } hover:shadow-xl ${theme.shadow} backdrop-blur-sm`}
            >
                <div className="flex items-center gap-4">
                    {/* Icon Badge */}
                    <div
                        className={`p-3 rounded-xl border ${theme.badge} group-hover:scale-110 transition-transform duration-300 shadow-inner shrink-0`}
                    >
                        <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Label & Category */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span className="text-white font-bold text-sm tracking-wide group-hover:text-white transition-colors">
                                {name}
                            </span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                            {category}
                        </span>
                    </div>
                </div>

                {/* Hover External Indicator */}
                <div className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 p-1">
                    <ExternalLink className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                </div>
            </a>

            {/* Floating Action Buttons */}
            <div className="absolute -top-2 right-2 flex items-center gap-1.5 z-10">
                {/* Floating Pin Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(id);
                    }}
                    className={`action-btn p-1.5 border rounded-full transition-all duration-200 shadow-lg ${isPinned
                        ? 'bg-emerald-950/90 border-emerald-500/80 text-emerald-400 opacity-100 scale-100'
                        : 'bg-gray-900/90 border-gray-700/80 text-gray-400 hover:text-emerald-400 hover:border-emerald-500/50 opacity-0 group-hover:opacity-100'
                        }`}
                    title={isPinned ? 'Unpin Shortcut' : 'Pin Shortcut'}
                >
                    <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-emerald-400' : ''}`} />
                </button>

                {/* Floating Trash Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(id);
                    }}
                    className="action-btn p-1.5 bg-red-950/90 border border-red-800/80 text-red-400 hover:bg-red-900 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                    title="Delete Shortcut"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}