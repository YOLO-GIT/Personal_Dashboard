import React, { useState, useEffect } from 'react';
import { Edit3, Copy, Check, Trash2 } from 'lucide-react';

export default function Scratchpad() {
    const [text, setText] = useState(() => {
        return localStorage.getItem('dashboard_scratchpad') || '';
    });
    const [copied, setCopied] = useState(false);

    // Auto-save to localStorage whenever text changes
    useEffect(() => {
        localStorage.setItem('dashboard_scratchpad', text);
    }, [text]);

    const handleCopy = () => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        if (text && window.confirm('Clear all scratchpad notes?')) {
            setText('');
        }
    };

    return (
        <div className="bg-[#1E1E1E] border border-gray-800 rounded-2xl p-5 flex flex-col h-72 shadow-lg">
            {/* Widget Header */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                    <Edit3 className="w-4 h-4 text-emerald-400" />
                    <span>Quick Scratchpad</span>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={handleCopy}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
                        title="Copy Note"
                    >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={handleClear}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition"
                        title="Clear Note"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Note Input Area */}
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste code snippets, terminal commands, or temporary notes here..."
                className="w-full flex-1 bg-[#121212] border border-gray-800/80 rounded-xl p-3.5 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-emerald-500/60 font-mono transition"
            />

            {/* Footer Status */}
            <div className="flex justify-between items-center mt-2 text-[10px] text-gray-500 font-medium">
                <span>Auto-saved locally</span>
                <span>{text.length} characters</span>
            </div>
        </div>
    );
}