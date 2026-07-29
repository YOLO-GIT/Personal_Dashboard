import React, { useState } from 'react';
import {
  Play,
  Flame,
  Code2,
  Send,
  Bird,
  MessageSquare,
  GraduationCap,
  Archive,
  BarChart3,
  Home
} from 'lucide-react';
import ShortcutCard from './components/ShortcutCards';
import AnalyticsView from './components/AnalyticsView';

// List of your dashboard links
const SHORTCUTS = [
  { name: 'YouTube', url: 'https://youtube.com', icon: Play, category: 'Leisure', accentColor: 'hover:shadow-red-500/10' },
  { name: 'GitHub', url: 'https://github.com', icon: Flame, category: 'Dev', accentColor: 'hover:shadow-gray-500/10' },
  { name: 'LeetCode', url: 'https://leetcode.com', icon: Code2, category: 'Dev', accentColor: 'hover:shadow-yellow-500/10' },
  { name: 'Telegram', url: 'https://web.telegram.org', icon: Send, category: 'Social', accentColor: 'hover:shadow-blue-500/10' },
  { name: 'Twitter', url: 'https://twitter.com', icon: Bird, category: 'Social', accentColor: 'hover:shadow-sky-500/10' },
  { name: 'WhatsApp', url: 'https://web.whatsapp.com', icon: MessageSquare, category: 'Social', accentColor: 'hover:shadow-green-500/10' },
  { name: 'OSi UniMAP', url: 'https://osi.unimap.edu.my', icon: GraduationCap, category: 'Academic', accentColor: 'hover:shadow-cyan-500/10' },
  { name: 'Web Archive', url: '#', icon: Archive, category: 'Tools', accentColor: 'hover:shadow-amber-500/10' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="bg-[#121212] text-gray-200 min-h-screen flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 p-6 bg-black flex flex-col justify-between shrink-0 border-r border-gray-900">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Dashboard</h1>
          <nav className="mt-8 space-y-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'home' ? 'bg-[#1E1E1E] text-white' : 'text-gray-400 hover:text-white'
                }`}
            >
              <Home className="w-4 h-4" /> Home
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'analytics' ? 'bg-[#1E1E1E] text-white' : 'text-gray-400 hover:text-white'
                }`}
            >
              <BarChart3 className="w-4 h-4" /> Analytics
            </button>
          </nav>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        {activeTab === 'home' ? (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Good Day!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SHORTCUTS.map((shortcut) => (
                <ShortcutCard key={shortcut.name} {...shortcut} />
              ))}
            </div>
          </div>
        ) : (
          <AnalyticsView />
        )}
      </main>
    </div>
  );
}