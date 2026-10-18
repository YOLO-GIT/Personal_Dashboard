import React, { useState, useEffect } from 'react';
import { loadDashboardData, syncDashboardData } from '../api';
import {
    Gamepad2, Globe, UserCheck, Plus, Trash2, ExternalLink,
    Copy, Check, Search, Star, Sparkles, Code2, ShieldCheck,
    Eye, EyeOff, Lock, Pencil, X, Save
} from 'lucide-react';

// Platform Theme Helper for Account Cards
const getAccountTheme = (platform) => {
    const lower = platform.toLowerCase();
    if (lower.includes('discord')) return { gradient: 'from-indigo-500/15 via-indigo-600/5 to-transparent', border: 'hover:border-indigo-500/50', text: 'text-indigo-400', badge: 'bg-indigo-500/10 border-indigo-500/20' };
    if (lower.includes('steam')) return { gradient: 'from-cyan-500/15 via-blue-600/5 to-transparent', border: 'hover:border-cyan-500/50', text: 'text-cyan-400', badge: 'bg-cyan-500/10 border-cyan-500/20' };
    if (lower.includes('github')) return { gradient: 'from-purple-500/15 via-slate-600/5 to-transparent', border: 'hover:border-purple-500/50', text: 'text-purple-400', badge: 'bg-purple-500/10 border-purple-500/20' };
    if (lower.includes('twitter') || lower.includes('x')) return { gradient: 'from-sky-500/15 via-slate-600/5 to-transparent', border: 'hover:border-sky-400/50', text: 'text-sky-400', badge: 'bg-sky-500/10 border-sky-500/20' };
    if (lower.includes('spotify')) return { gradient: 'from-emerald-500/15 via-green-600/5 to-transparent', border: 'hover:border-emerald-500/50', text: 'text-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/20' };
    return { gradient: 'from-emerald-500/10 via-emerald-600/5 to-transparent', border: 'hover:border-emerald-500/50', text: 'text-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/20' };
};

// Game Status Theme Helper
const getGameStatusTheme = (status) => {
    switch (status) {
        case 'Completed': return { gradient: 'from-emerald-500/15 via-emerald-600/5 to-transparent', border: 'hover:border-emerald-500/50', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
        case 'Playing': return { gradient: 'from-blue-500/15 via-indigo-600/5 to-transparent', border: 'hover:border-blue-500/50', badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30' };
        case 'Backlog': return { gradient: 'from-amber-500/15 via-orange-600/5 to-transparent', border: 'hover:border-amber-500/50', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30' };
        case 'Abandoned': return { gradient: 'from-red-500/15 via-rose-600/5 to-transparent', border: 'hover:border-red-500/50', badge: 'bg-red-500/15 text-red-400 border-red-500/30' };
        default: return { gradient: 'from-gray-500/10 to-transparent', border: 'hover:border-gray-500/50', badge: 'bg-gray-500/15 text-gray-400 border-gray-500/30' };
    }
};

export default function PersonalHub() {
    const [subTab, setSubTab] = useState('games'); // 'games' | 'projects' | 'accounts'
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedKey, setCopiedKey] = useState(null);
    const [visiblePasswords, setVisiblePasswords] = useState({});

    // States
    const [games, setGames] = useState([]);
    const [projects, setProjects] = useState([]);
    const [accounts, setAccounts] = useState([]);

    // Account Editing State
    const [editingAccountId, setEditingAccountId] = useState(null);
    const [editAccountData, setEditAccountData] = useState({ platform: '', identifier: '', password: '', category: '' });

    // Form Inputs
    const [newGame, setNewGame] = useState({ title: '', platform: 'PC', status: 'Playing', rating: '5' });
    const [newProject, setNewProject] = useState({ name: '', url: '', desc: '', tech: '' });
    const [newAccount, setNewAccount] = useState({ platform: '', identifier: '', password: '', category: 'General' });

    // Load Initial Data from Backend
    useEffect(() => {
        loadDashboardData().then((data) => {
            if (data) {
                if (data.games) setGames(data.games);
                if (data.projects) setProjects(data.projects);
                if (data.accounts) setAccounts(data.accounts);
            }
        });
    }, []);

    // Handlers & Backend Sync
    const addGame = (e) => {
        e.preventDefault();
        if (!newGame.title) return;
        const updated = [...games, { ...newGame, id: Date.now().toString() }];
        setGames(updated);
        syncDashboardData({ games: updated });
        setNewGame({ title: '', platform: 'PC', status: 'Playing', rating: '5' });
    };

    const deleteGame = (id) => {
        const updated = games.filter(g => g.id !== id);
        setGames(updated);
        syncDashboardData({ games: updated });
    };

    const addProject = (e) => {
        e.preventDefault();
        if (!newProject.name || !newProject.url) return;
        let url = newProject.url;
        if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
        const updated = [...projects, { ...newProject, url, id: Date.now().toString() }];
        setProjects(updated);
        syncDashboardData({ projects: updated });
        setNewProject({ name: '', url: '', desc: '', tech: '' });
    };

    const deleteProject = (id) => {
        const updated = projects.filter(p => p.id !== id);
        setProjects(updated);
        syncDashboardData({ projects: updated });
    };

    const addAccount = (e) => {
        e.preventDefault();
        if (!newAccount.platform || !newAccount.identifier) return;
        const updated = [...accounts, { ...newAccount, id: Date.now().toString() }];
        setAccounts(updated);
        syncDashboardData({ accounts: updated });
        setNewAccount({ platform: '', identifier: '', password: '', category: 'General' });
    };

    const deleteAccount = (id) => {
        const updated = accounts.filter(a => a.id !== id);
        setAccounts(updated);
        syncDashboardData({ accounts: updated });
    };

    // Account Edit Handlers
    const startEditingAccount = (account) => {
        setEditingAccountId(account.id);
        setEditAccountData({
            platform: account.platform || '',
            identifier: account.identifier || '',
            password: account.password || '',
            category: account.category || 'General'
        });
    };

    const cancelEditAccount = () => {
        setEditingAccountId(null);
        setEditAccountData({ platform: '', identifier: '', password: '', category: '' });
    };

    const saveEditedAccount = (id) => {
        if (!editAccountData.platform || !editAccountData.identifier) return;
        const updated = accounts.map((a) => (a.id === id ? { ...a, ...editAccountData } : a));
        setAccounts(updated);
        syncDashboardData({ accounts: updated });
        setEditingAccountId(null);
    };

    const handleCopy = (text, key) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const togglePasswordVisibility = (id) => {
        setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const getFaviconUrl = (url) => {
        try {
            const domain = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        } catch {
            return null;
        }
    };

    // Filtered Lists
    const filteredGames = games.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredAccounts = accounts.filter(a =>
        a.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Derived Stats
    const completedGamesCount = games.filter(g => g.status === 'Completed').length;

    return (
        <div className="space-y-8">
            {/* 1. HERO STATS BANNER */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-linear-to-br from-emerald-950/40 via-[#161616] to-[#121212] border border-emerald-900/40 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 shrink-0">
                        <Gamepad2 className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Gaming HQ</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-white">{games.length}</span>
                            <span className="text-xs text-gray-400">Logged ({completedGamesCount} Beat)</span>
                        </div>
                    </div>
                </div>

                <div className="bg-linear-to-br from-blue-950/40 via-[#161616] to-[#121212] border border-blue-900/40 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 shrink-0">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Web Deployment</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-white">{projects.length}</span>
                            <span className="text-xs text-gray-400">Live Apps Showcase</span>
                        </div>
                    </div>
                </div>

                <div className="bg-linear-to-br from-purple-950/40 via-[#161616] to-[#121212] border border-purple-900/40 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
                    <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 shrink-0">
                        <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Account Vault</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-white">{accounts.length}</span>
                            <span className="text-xs text-gray-400">Profiles Linked</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. SUB-TAB BAR & SEARCH */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800/80 pb-5">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-2xl font-bold text-white tracking-tight">Personal Directory</h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search directory..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#161616] border border-gray-800 text-xs text-white pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 w-48 shadow-inner"
                        />
                    </div>

                    <div className="flex bg-[#161616] p-1 rounded-xl border border-gray-800/80 shadow-inner">
                        <button
                            onClick={() => setSubTab('games')}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${subTab === 'games' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Gamepad2 className="w-3.5 h-3.5" /> Games ({games.length})
                        </button>
                        <button
                            onClick={() => setSubTab('projects')}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${subTab === 'projects' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Globe className="w-3.5 h-3.5" /> Web Pages ({projects.length})
                        </button>
                        <button
                            onClick={() => setSubTab('accounts')}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${subTab === 'accounts' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                        >
                            <UserCheck className="w-3.5 h-3.5" /> Accounts ({accounts.length})
                        </button>
                    </div>
                </div>
            </div>

            {/* --- SUB-TAB 1: GAMES PLAYED --- */}
            {subTab === 'games' && (
                <div className="space-y-6">
                    <form onSubmit={addGame} className="bg-[#161616] border border-gray-800/80 rounded-2xl p-4 flex flex-wrap gap-3 items-center shadow-lg">
                        <input
                            type="text"
                            placeholder="Game Title (e.g., Elden Ring)"
                            value={newGame.title}
                            onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
                            className="bg-[#101010] border border-gray-800 px-3.5 py-2 rounded-xl text-xs text-white flex-1 min-w-50 focus:outline-none focus:border-emerald-500"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Platform (PC, PS5)"
                            value={newGame.platform}
                            onChange={(e) => setNewGame({ ...newGame, platform: e.target.value })}
                            className="bg-[#101010] border border-gray-800 px-3.5 py-2 rounded-xl text-xs text-white w-28 focus:outline-none focus:border-emerald-500"
                        />
                        <select
                            value={newGame.status}
                            onChange={(e) => setNewGame({ ...newGame, status: e.target.value })}
                            className="bg-[#101010] border border-gray-800 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                        >
                            <option value="Playing">Playing</option>
                            <option value="Completed">Completed</option>
                            <option value="Backlog">Backlog</option>
                            <option value="Abandoned">Abandoned</option>
                        </select>
                        <select
                            value={newGame.rating}
                            onChange={(e) => setNewGame({ ...newGame, rating: e.target.value })}
                            className="bg-[#101010] border border-gray-800 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                        >
                            <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                            <option value="4">⭐⭐⭐⭐ (4/5)</option>
                            <option value="3">⭐⭐⭐ (3/5)</option>
                            <option value="2">⭐⭐ (2/5)</option>
                            <option value="1">⭐ (1/5)</option>
                        </select>
                        <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-lg shadow-emerald-950/50">
                            <Plus className="w-4 h-4" /> Add Game
                        </button>
                    </form>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredGames.map((g) => {
                            const theme = getGameStatusTheme(g.status);
                            const score = Number(g.rating) || 5;

                            return (
                                <div
                                    key={g.id}
                                    className={`bg-[#161616] bg-linear-to-r ${theme.gradient} border border-gray-800/80 ${theme.border} rounded-2xl p-5 flex justify-between items-start transition-all duration-300 hover:-translate-y-1 shadow-lg group relative overflow-hidden`}
                                >
                                    <div className="space-y-3 z-10">
                                        <div>
                                            <h4 className="font-bold text-white text-lg tracking-wide group-hover:text-white transition">{g.title}</h4>
                                            <div className="flex gap-2 items-center mt-2">
                                                <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md bg-gray-800/80 border border-gray-700/50 text-gray-300">
                                                    {g.platform}
                                                </span>
                                                <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md border ${theme.badge}`}>
                                                    {g.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 pt-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-3.5 h-3.5 ${i < score ? 'fill-amber-400 text-amber-400' : 'text-gray-800'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => deleteGame(g.id)}
                                        className="text-gray-600 hover:text-red-400 transition p-1.5 rounded-lg hover:bg-red-950/40 z-10"
                                        title="Delete Game"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* --- SUB-TAB 2: WEB PAGES SHOWCASE --- */}
            {subTab === 'projects' && (
                <div className="space-y-6">
                    <form onSubmit={addProject} className="bg-[#161616] border border-gray-800/80 rounded-2xl p-4 space-y-3 shadow-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="Project Name (e.g., Portfolio Site)"
                                value={newProject.name}
                                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                className="bg-[#101010] border border-gray-800 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                                required
                            />
                            <input
                                type="text"
                                placeholder="URL (e.g. my-app.vercel.app)"
                                value={newProject.url}
                                onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                                className="bg-[#101010] border border-gray-800 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="Short Description"
                                value={newProject.desc}
                                onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })}
                                className="bg-[#101010] border border-gray-800 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                            />
                            <input
                                type="text"
                                placeholder="Tech Stack (e.g. React, Node.js)"
                                value={newProject.tech}
                                onChange={(e) => setNewProject({ ...newProject, tech: e.target.value })}
                                className="bg-[#101010] border border-gray-800 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                        <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-lg shadow-emerald-950/50">
                            <Plus className="w-4 h-4" /> Save Web Page
                        </button>
                    </form>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {filteredProjects.map((p) => {
                            const favicon = getFaviconUrl(p.url);
                            return (
                                <div
                                    key={p.id}
                                    className="bg-[#161616] bg-linear-to-r from-blue-500/10 via-indigo-600/5 to-transparent border border-gray-800/80 hover:border-blue-500/50 rounded-2xl p-5 flex justify-between items-start transition-all duration-300 hover:-translate-y-1 shadow-lg group"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-[#101010] border border-gray-800 rounded-xl group-hover:scale-110 transition-transform shrink-0">
                                                {favicon ? (
                                                    <img src={favicon} alt="" className="w-5 h-5 rounded" onError={(e) => e.target.style.display = 'none'} />
                                                ) : (
                                                    <Code2 className="w-5 h-5 text-blue-400" />
                                                )}
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-white text-lg group-hover:text-blue-400 transition">{p.name}</h4>
                                                    <a href={p.url} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-blue-400 transition">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </div>
                                                <span className="text-[10px] text-gray-500 font-mono">{p.url}</span>
                                            </div>
                                        </div>

                                        {p.desc && <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>}

                                        {p.tech && (
                                            <div className="pt-1">
                                                <span className="inline-block text-[10px] font-mono bg-blue-950/60 text-blue-400 border border-blue-800/50 px-2.5 py-0.5 rounded-lg shadow-inner">
                                                    {p.tech}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => deleteProject(p.id)}
                                        className="text-gray-600 hover:text-red-400 transition p-1.5 rounded-lg hover:bg-red-950/40"
                                        title="Delete Web Page"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* --- SUB-TAB 3: ACCOUNTS DIRECTORY & VAULT --- */}
            {subTab === 'accounts' && (
                <div className="space-y-6">
                    <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-2xl p-3.5 flex items-center gap-3 text-emerald-400 text-xs shadow-inner">
                        <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400" />
                        <span>Safely organize public IDs, dev usernames, and passwords. Passwords stay hidden by default and are visible only when toggled.</span>
                    </div>

                    <form onSubmit={addAccount} className="bg-[#161616] border border-gray-800/80 rounded-2xl p-4 flex flex-wrap gap-3 items-center shadow-lg">
                        <input
                            type="text"
                            placeholder="Platform (e.g. Discord, Steam)"
                            value={newAccount.platform}
                            onChange={(e) => setNewAccount({ ...newAccount, platform: e.target.value })}
                            className="bg-[#101010] border border-gray-800 px-3.5 py-2 rounded-xl text-xs text-white flex-1 min-w-36 focus:outline-none focus:border-emerald-500"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Username / Email"
                            value={newAccount.identifier}
                            onChange={(e) => setNewAccount({ ...newAccount, identifier: e.target.value })}
                            className="bg-[#101010] border border-gray-800 px-3.5 py-2 rounded-xl text-xs text-white flex-1 min-w-40 focus:outline-none focus:border-emerald-500"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password (Optional)"
                            value={newAccount.password}
                            onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                            className="bg-[#101010] border border-gray-800 px-3.5 py-2 rounded-xl text-xs text-white flex-1 min-w-36 focus:outline-none focus:border-emerald-500"
                        />
                        <input
                            type="text"
                            placeholder="Category (Gaming, Dev)"
                            value={newAccount.category}
                            onChange={(e) => setNewAccount({ ...newAccount, category: e.target.value })}
                            className="bg-[#101010] border border-gray-800 px-3.5 py-2 rounded-xl text-xs text-white w-28 focus:outline-none focus:border-emerald-500"
                        />
                        <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-lg shadow-emerald-950/50">
                            <Plus className="w-4 h-4" /> Save Account
                        </button>
                    </form>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredAccounts.map((a) => {
                            const theme = getAccountTheme(a.platform);
                            const isPasswordShown = !!visiblePasswords[a.id];
                            const isEditing = editingAccountId === a.id;

                            if (isEditing) {
                                return (
                                    <div
                                        key={a.id}
                                        className="bg-[#161616] border border-emerald-500/50 rounded-2xl p-5 space-y-3 shadow-lg"
                                    >
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                                            <span className="text-xs font-bold text-emerald-400">Edit Account</span>
                                            <button onClick={cancelEditAccount} className="text-gray-400 hover:text-white">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                value={editAccountData.platform}
                                                onChange={(e) => setEditAccountData({ ...editAccountData, platform: e.target.value })}
                                                className="bg-[#101010] border border-gray-800 text-xs text-white p-2 rounded-lg focus:outline-none focus:border-emerald-500"
                                                placeholder="Platform"
                                            />
                                            <input
                                                type="text"
                                                value={editAccountData.category}
                                                onChange={(e) => setEditAccountData({ ...editAccountData, category: e.target.value })}
                                                className="bg-[#101010] border border-gray-800 text-xs text-white p-2 rounded-lg focus:outline-none focus:border-emerald-500"
                                                placeholder="Category"
                                            />
                                        </div>

                                        <input
                                            type="text"
                                            value={editAccountData.identifier}
                                            onChange={(e) => setEditAccountData({ ...editAccountData, identifier: e.target.value })}
                                            className="w-full bg-[#101010] border border-gray-800 text-xs text-white p-2 rounded-lg focus:outline-none focus:border-emerald-500"
                                            placeholder="Username / Email"
                                        />

                                        <input
                                            type="text"
                                            value={editAccountData.password}
                                            onChange={(e) => setEditAccountData({ ...editAccountData, password: e.target.value })}
                                            className="w-full bg-[#101010] border border-gray-800 text-xs text-white p-2 rounded-lg focus:outline-none focus:border-emerald-500"
                                            placeholder="Password (Optional)"
                                        />

                                        <div className="flex justify-end gap-2 pt-2">
                                            <button
                                                onClick={cancelEditAccount}
                                                className="px-3 py-1.5 text-xs text-gray-400 hover:text-white rounded-lg border border-gray-800 hover:bg-gray-800 transition"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => saveEditedAccount(a.id)}
                                                className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1 transition shadow-md"
                                            >
                                                <Save className="w-3.5 h-3.5" /> Save Changes
                                            </button>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div
                                    key={a.id}
                                    className={`bg-[#161616] bg-linear-to-r ${theme.gradient} border border-gray-800/80 ${theme.border} rounded-2xl p-5 flex justify-between items-start gap-3 transition-all duration-300 hover:-translate-y-1 shadow-lg group`}
                                >
                                    {/* Left Content Column (flex-1 min-w-0 prevents text from pushing card boundaries) */}
                                    <div className="space-y-2 flex-1 min-w-0">
                                        <span className="text-[9px] uppercase font-mono font-bold text-gray-400 tracking-widest block truncate">
                                            {a.category}
                                        </span>
                                        <h4 className="font-bold text-white text-lg tracking-wide group-hover:text-white transition truncate">
                                            {a.platform}
                                        </h4>

                                        {/* Username Pill */}
                                        <div className="flex items-center gap-2 pt-1 max-w-full">
                                            <span className="text-xs text-gray-200 font-mono bg-[#101010] px-3 py-1 rounded-lg border border-gray-800 shadow-inner truncate max-w-[85%]">
                                                {a.identifier}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(a.identifier, `${a.id}-user`)}
                                                className="text-gray-500 hover:text-emerald-400 transition p-1 shrink-0"
                                                title="Copy Username"
                                            >
                                                {copiedKey === `${a.id}-user` ? (
                                                    <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>

                                        {/* Safe Password Pill */}
                                        {a.password && (
                                            <div className="flex items-center gap-2 pt-0.5 max-w-full">
                                                <div className="flex items-center gap-1.5 bg-[#101010] px-3 py-1 rounded-lg border border-gray-800 shadow-inner text-xs font-mono text-amber-300 max-w-[70%]">
                                                    <Lock className="w-3 h-3 text-amber-400/80 shrink-0" />
                                                    <span className="truncate">{isPasswordShown ? a.password : '••••••••'}</span>
                                                </div>

                                                {/* Toggle Password Visibility */}
                                                <button
                                                    type="button"
                                                    onClick={() => togglePasswordVisibility(a.id)}
                                                    className="text-gray-500 hover:text-amber-400 transition p-1 shrink-0"
                                                    title={isPasswordShown ? "Hide Password" : "Show Password"}
                                                >
                                                    {isPasswordShown ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>

                                                {/* Copy Password */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(a.password, `${a.id}-pass`)}
                                                    className="text-gray-500 hover:text-emerald-400 transition p-1 shrink-0"
                                                    title="Copy Password"
                                                >
                                                    {copiedKey === `${a.id}-pass` ? (
                                                        <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons: Edit & Delete (shrink-0 prevents them from getting pushed out) */}
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button
                                            onClick={() => startEditingAccount(a)}
                                            className="text-gray-600 hover:text-emerald-400 transition p-1.5 rounded-lg hover:bg-emerald-950/40"
                                            title="Edit Account"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteAccount(a.id)}
                                            className="text-gray-600 hover:text-red-400 transition p-1.5 rounded-lg hover:bg-red-950/40"
                                            title="Delete Account"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}