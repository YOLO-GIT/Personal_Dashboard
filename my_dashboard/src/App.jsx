import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import ShortcutCard from './components/ShortcutCards';
import AddShortcutModal from './components/AddShortCutsModal';
import AnalyticsView from './components/AnalyticsView';
import Header from './components/Header';
import Scratchpad from './components/ScratchPad';
import Sidebar from './components/SideBar';
import PersonalHub from './components/PersonalHub';
import { loadDashboardData, syncDashboardData } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [shortcuts, setShortcuts] = useState([]);

  // Load server data on boot
  useEffect(() => {
    loadDashboardData().then((data) => {
      if (data?.shortcuts) {
        setShortcuts(data.shortcuts);
      }
    });
  }, []);

  // Sync shortcuts whenever they change
  const updateShortcuts = (newShortcuts) => {
    setShortcuts(newShortcuts);
    syncDashboardData({ shortcuts: newShortcuts });
  };

  const handleAddShortcut = (newShortcut) => {
    updateShortcuts([...shortcuts, newShortcut]);
  };

  const handleDeleteShortcut = (id) => {
    updateShortcuts(shortcuts.filter((s) => s.id !== id));
  };

  // Toggle pinned status for a shortcut
  const handleTogglePin = (id) => {
    const updated = shortcuts.map((s) =>
      s.id === id ? { ...s, isPinned: !s.isPinned } : s
    );
    updateShortcuts(updated);
  };

  const categories = useMemo(() => {
    const unique = new Set(shortcuts.map((s) => s.category));
    return ['All', ...Array.from(unique)];
  }, [shortcuts]);

  // Filter by category + search query, and sort pinned items to the top
  const filteredShortcuts = useMemo(() => {
    return shortcuts
      .filter((s) => {
        const matchesCategory =
          selectedCategory === 'All' || s.category === selectedCategory;
        const matchesSearch =
          (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.category || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => Number(Boolean(b.isPinned)) - Number(Boolean(a.isPinned)));
  }, [shortcuts, selectedCategory, searchQuery]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-10 overflow-y-auto">
        {activeTab === 'home' ? (
          <div>
            <Header />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h3 className="text-xl font-bold text-white">Shortcuts</h3>

              {/* Search Bar & Add Button */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search shortcuts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#1A1A1A] text-sm text-white placeholder-gray-500 rounded-xl pl-9 pr-4 py-2 border border-gray-800 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl transition whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Add Shortcut
                </button>
              </div>
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {filteredShortcuts.map((shortcut) => (
                <ShortcutCard
                  key={shortcut.id}
                  {...shortcut}
                  onDelete={handleDeleteShortcut}
                  onTogglePin={handleTogglePin}
                />
              ))}

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-gray-800/80 hover:border-emerald-500/50 rounded-2xl transition-all duration-200 group text-gray-500 hover:text-emerald-400 bg-[#141414]/50 hover:bg-[#161616]"
              >
                <div className="p-2.5 rounded-xl border border-gray-800 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-all">
                  <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <span className="font-semibold text-sm">Add New Tile</span>
              </button>
            </div>

            <Scratchpad />
          </div>
        ) : activeTab === 'personal' ? (
          <PersonalHub />
        ) : (
          <AnalyticsView />
        )}
      </main>

      <AddShortcutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddShortcut}
      />
    </div>
  );
}