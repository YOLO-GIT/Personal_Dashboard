import React, { useState } from 'react';
import { X } from 'lucide-react';

const AVAILABLE_ICONS = [
    'Globe', 'Play', 'Flame', 'Code2', 'Send', 'Bird',
    'MessageSquare', 'GraduationCap', 'BookOpen', 'Terminal', 'Tv', 'Gamepad2', 'Music', 'ShoppingBag'
];

const AVAILABLE_CATEGORIES = ['Dev', 'Social', 'Leisure', 'Academic', 'Tools'];

export default function AddShortcutModal({ isOpen, onClose, onAdd }) {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [category, setCategory] = useState('Tools');
    const [iconName, setIconName] = useState('Globe');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !url) return;

        // Ensure URL has protocol prefix
        let formattedUrl = url;
        if (!/^https?:\/\//i.test(url)) {
            formattedUrl = `https://${url}`;
        }

        onAdd({
            id: Date.now().toString(),
            name,
            url: formattedUrl,
            category,
            iconName
        });

        // Reset Form
        setName('');
        setUrl('');
        setCategory('Tools');
        setIconName('Globe');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#1E1E1E] border border-gray-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-bold text-white mb-6">Add New Shortcut</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Reddit"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#121212] border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 uppercase mb-1">URL</label>
                        <input
                            type="text"
                            placeholder="e.g. reddit.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full bg-[#121212] border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-[#121212] border border-gray-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                            >
                                {AVAILABLE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Icon</label>
                            <select
                                value={iconName}
                                onChange={(e) => setIconName(e.target.value)}
                                className="w-full bg-[#121212] border border-gray-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                            >
                                {AVAILABLE_ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
                        >
                            Save Shortcut
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}