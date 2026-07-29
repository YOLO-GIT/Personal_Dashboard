import React, { useState, useEffect, useMemo } from 'react';
import ShortcutCard from './components/ShortcutCards';
import AddShortcutModal from './components/AddShortCutsModal';
import AnalyticsView from './components/AnalyticsView';
import Header from './components/Header';
import Scratchpad from './components/ScratchPad';
import Sidebar from './components/SideBar';
import PersonalHub from './components/PersonalHub';

const DEFAULT_SHORTCUTS = [
  { id: '1', name: 'YouTube', url: 'https://youtube.com', iconName: 'Play', category: 'Leisure' },
  { id: '2', name: 'GitHub', url: 'https://github.com', iconName: 'Flame', category: 'Dev' },
  { id: '3', name: 'LeetCode', url: 'https://leetcode.com', iconName: 'Code2', category: 'Dev' },
  { id: '4', name: 'Telegram', url: 'https://web.telegram.org', iconName: 'Send', category: 'Social' },
  { id: '5', name: 'Twitter', url: 'https://twitter.com', iconName: 'Bird', category: 'Social' },
  { id: '6', name: 'WhatsApp', url: 'https://web.whatsapp.com', iconName: 'MessageSquare', category: 'Social' },
  { id: '7', name: 'OSi UniMAP', url: 'https://osi.unimap.edu.my', iconName: 'GraduationCap', category: 'Academic' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Load initial shortcuts from localStorage or fallback to defaults
  const [shortcuts, setShortcuts] = useState(() => {
    const saved = localStorage.getItem('dashboard_shortcuts');
    return saved ? JSON.parse(saved) : DEFAULT_SHORTCUTS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('dashboard_shortcuts', JSON.stringify(shortcuts));
  }, [shortcuts]);

  // Dynamically extract unique categories for the filter bar
  const categories = useMemo(() => {
    const unique = new Set(shortcuts.map(s => s.category));
    return ['All', ...Array.from(unique)];
  }, [shortcuts]);

  // Filter shortcuts according to the selected category pill
  const filteredShortcuts = useMemo(() => {
    if (selectedCategory === 'All') return shortcuts;
    return shortcuts.filter(s => s.category === selectedCategory);
  }, [shortcuts, selectedCategory]);

  const handleAddShortcut = (newShortcut) => {
    setShortcuts(prev => [...prev, newShortcut]);
  };

  const handleDeleteShortcut = (id) => {
    setShortcuts(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="bg-[#121212] text-gray-200 min-h-screen flex font-sans">
      {/* 1. Dynamic Sidebar (Handles navigation, timer, and stats internally) */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Main View Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        {activeTab === 'home' ? (
          <div>
            <Header />

            {/* Shortcut Grid Section */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Shortcuts</h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl transition"
              >
                Add Shortcut
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                    : 'bg-[#1E1E1E] text-gray-400 hover:text-white border border-gray-800'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {filteredShortcuts.map((shortcut) => (
                <ShortcutCard
                  key={shortcut.id}
                  {...shortcut}
                  onDelete={handleDeleteShortcut}
                />
              ))}

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-800 hover:border-emerald-500/50 rounded-2xl transition group text-gray-500 hover:text-emerald-400 min-h-30"
              >
                <span className="font-medium text-sm">+ Add New Tile</span>
              </button>
            </div>

            {/* Quick Scratchpad Widget */}
            <Scratchpad />
          </div>
        ) : activeTab === 'personal' ? (
          <PersonalHub /> // <-- Render Personal Hub View
        ) : activeTab === 'personal' ? (
          <PersonalHub /> // <-- Render Personal Hub View
        ) : (
          <AnalyticsView />
        )}
      </main>

      {/* 3. Add Shortcut Modal */}
      <AddShortcutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddShortcut}
      />
    </div>
  );
}