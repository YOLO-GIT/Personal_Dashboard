import React, { useState, useEffect } from 'react';
import { Gamepad2, Globe, UserCheck, Plus, Trash2, ExternalLink, ShieldAlert } from 'lucide-react';

export default function PersonalHub() {
    const [subTab, setSubTab] = useState('games'); // 'games' | 'projects' | 'accounts'

    // --- 1. Games State & LocalStorage ---
    const [games, setGames] = useState(() => {
        const saved = localStorage.getItem('dashboard_games');
        return saved ? JSON.parse(saved) : [
            { id: '1', title: 'Elden Ring', platform: 'PC', status: 'Completed', rating: '5/5' },
            { id: '2', title: 'Cyberpunk 2077', platform: 'PC', status: 'Playing', rating: '4/5' },
        ];
    });
    const [newGame, setNewGame] = useState({ title: '', platform: 'PC', status: 'Playing', rating: '5/5' });

    // --- 2. Projects State & LocalStorage ---
    const [projects, setProjects] = useState(() => {
        const saved = localStorage.getItem('dashboard_projects');
        return saved ? JSON.parse(saved) : [
            { id: '1', name: 'My Dashboard', url: 'http://localhost:5173', desc: 'React + Vite personal hub', tech: 'React, Tailwind' },
        ];
    });
    const [newProject, setNewProject] = useState({ name: '', url: '', desc: '', tech: '' });

    // --- 3. Accounts State & LocalStorage ---
    const [accounts, setAccounts] = useState(() => {
        const saved = localStorage.getItem('dashboard_accounts');
        return saved ? JSON.parse(saved) : [
            { id: '1', platform: 'GitHub', identifier: 'username', category: 'Dev' },
            { id: '2', platform: 'Steam', identifier: 'GamerTag123', category: 'Gaming' },
        ];
    });
    const [newAccount, setNewAccount] = useState({ platform: '', identifier: '', category: 'General' });

    // Persistence Syncs
    useEffect(() => localStorage.setItem('dashboard_games', JSON.stringify(games)), [games]);
    useEffect(() => localStorage.setItem('dashboard_projects', JSON.stringify(projects)), [projects]);
    useEffect(() => localStorage.setItem('dashboard_accounts', JSON.stringify(accounts)), [accounts]);

    // Add & Delete Handlers
    const addGame = (e) => {
        e.preventDefault();
        if (!newGame.title) return;
        setGames([...games, { ...newGame, id: Date.now().toString() }]);
        setNewGame({ title: '', platform: 'PC', status: 'Playing', rating: '5/5' });
    };

    const addProject = (e) => {
        e.preventDefault();
        if (!newProject.name || !newProject.url) return;
        let url = newProject.url;
        if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
        setProjects([...projects, { ...newProject, url, id: Date.now().toString() }]);
        setNewProject({ name: '', url: '', desc: '', tech: '' });
    };

    const addAccount = (e) => {
        e.preventDefault();
        if (!newAccount.platform || !newAccount.identifier) return;
        setAccounts([...accounts, { ...newAccount, id: Date.now().toString() }]);
        setNewAccount({ platform: '', identifier: '', category: 'General' });
    };

    return (
        <div className="space-y-6">
            {/* Page Title & Sub-Tab Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white">Personal Hub</h2>
                    <p className="text-sm text-gray-400 mt-1">Manage your games log, web pages, and personal profiles.</p>
                </div>

                <div className="flex bg-[#1E1E1E] p-1 rounded-xl border border-gray-800 self-start md:self-auto">
                    <button
                        onClick={() => setSubTab('games')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${subTab === 'games' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Gamepad2 className="w-4 h-4" /> Games Played
                    </button>
                    <button
                        onClick={() => setSubTab('projects')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${subTab === 'projects' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Globe className="w-4 h-4" /> Web Pages
                    </button>
                    <button
                        onClick={() => setSubTab('accounts')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${subTab === 'accounts' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <UserCheck className="w-4 h-4" /> Account List
                    </button>
                </div>
            </div>

            {/* SUB-TAB 1: GAMES PLAYED */}
            {subTab === 'games' && (
                <div className="space-y-6">
                    <form onSubmit={addGame} className="bg-[#1E1E1E] border border-gray-800 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
                        <input
                            type="text"
                            placeholder="Game Title"
                            value={newGame.title}
                            onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
                            className="bg-[#121212] border border-gray-800 px-3 py-2 rounded-lg text-sm text-white flex-1 min-w-45 focus:outline-none focus:border-emerald-500"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Platform (PC, PS5, Switch)"
                            value={newGame.platform}
                            onChange={(e) => setNewGame({ ...newGame, platform: e.target.value })}
                            className="bg-[#121212] border border-gray-800 px-3 py-2 rounded-lg text-sm text-white w-32 focus:outline-none focus:border-emerald-500"
                        />
                        <select
                            value={newGame.status}
                            onChange={(e) => setNewGame({ ...newGame, status: e.target.value })}
                            className="bg-[#121212] border border-gray-800 px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                        >
                            <option value="Playing">Playing</option>
                            <option value="Completed">Completed</option>
                            <option value="Backlog">Backlog</option>
                            <option value="Abandoned">Abandoned</option>
                        </select>
                        <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium flex items-center gap-1">
                            <Plus className="w-4 h-4" /> Add Game
                        </button>
                    </form>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {games.map((g) => (
                            <div key={g.id} className="bg-[#1E1E1E] border border-gray-800 rounded-2xl p-4 flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-white text-base">{g.title}</h4>
                                    <div className="flex gap-2 items-center mt-2">
                                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gray-800 text-gray-300">{g.platform}</span>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${g.status === 'Completed' ? 'bg-emerald-950 text-emerald-400' :
                                            g.status === 'Playing' ? 'bg-blue-950 text-blue-400' : 'bg-amber-950 text-amber-400'
                                            }`}>{g.status}</span>
                                    </div>
                                </div>
                                <button onClick={() => setGames(games.filter(x => x.id !== g.id))} className="text-gray-500 hover:text-red-400">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SUB-TAB 2: WEB PAGES / PROJECTS */}
            {subTab === 'projects' && (
                <div className="space-y-6">
                    <form onSubmit={addProject} className="bg-[#1E1E1E] border border-gray-800 rounded-2xl p-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="Project Name"
                                value={newProject.name}
                                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                className="bg-[#121212] border border-gray-800 px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                                required
                            />
                            <input
                                type="text"
                                placeholder="URL (e.g. my-app.vercel.app)"
                                value={newProject.url}
                                onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                                className="bg-[#121212] border border-gray-800 px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="Short Description"
                                value={newProject.desc}
                                onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })}
                                className="bg-[#121212] border border-gray-800 px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                            />
                            <input
                                type="text"
                                placeholder="Tech Stack (e.g. React, Node.js)"
                                value={newProject.tech}
                                onChange={(e) => setNewProject({ ...newProject, tech: e.target.value })}
                                className="bg-[#121212] border border-gray-800 px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                        <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium flex items-center gap-1">
                            <Plus className="w-4 h-4" /> Add Web Project
                        </button>
                    </form>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projects.map((p) => (
                            <div key={p.id} className="bg-[#1E1E1E] border border-gray-800 rounded-2xl p-5 flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-white text-lg">{p.name}</h4>
                                        <a href={p.url} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300">
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                    {p.desc && <p className="text-xs text-gray-400">{p.desc}</p>}
                                    {p.tech && <span className="inline-block text-[10px] font-mono bg-gray-800 text-gray-300 px-2 py-0.5 rounded">{p.tech}</span>}
                                </div>
                                <button onClick={() => setProjects(projects.filter(x => x.id !== p.id))} className="text-gray-500 hover:text-red-400">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SUB-TAB 3: ACCOUNTS DIRECTORY */}
            {subTab === 'accounts' && (
                <div className="space-y-6">
                    <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-3 flex items-center gap-2 text-amber-400 text-xs">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>Note: Keep sensitive passwords in a password manager. Use this only for tracking usernames, emails, or account IDs!</span>
                    </div>

                    <form onSubmit={addAccount} className="bg-[#1E1E1E] border border-gray-800 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
                        <input
                            type="text"
                            placeholder="Service/Platform (e.g. Steam, Discord)"
                            value={newAccount.platform}
                            onChange={(e) => setNewAccount({ ...newAccount, platform: e.target.value })}
                            className="bg-[#121212] border border-gray-800 px-3 py-2 rounded-lg text-sm text-white flex-1 min-w-45 focus:outline-none focus:border-emerald-500"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Username / Email / Tag"
                            value={newAccount.identifier}
                            onChange={(e) => setNewAccount({ ...newAccount, identifier: e.target.value })}
                            className="bg-[#121212] border border-gray-800 px-3 py-2 rounded-lg text-sm text-white flex-1 min-w-45 focus:outline-none focus:border-emerald-500"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Category (Dev, Gaming, Social)"
                            value={newAccount.category}
                            onChange={(e) => setNewAccount({ ...newAccount, category: e.target.value })}
                            className="bg-[#121212] border border-gray-800 px-3 py-2 rounded-lg text-sm text-white w-36 focus:outline-none focus:border-emerald-500"
                        />
                        <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium flex items-center gap-1">
                            <Plus className="w-4 h-4" /> Add Account
                        </button>
                    </form>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {accounts.map((a) => (
                            <div key={a.id} className="bg-[#1E1E1E] border border-gray-800 rounded-2xl p-4 flex justify-between items-center">
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">{a.category}</span>
                                    <h4 className="font-bold text-white text-base mt-0.5">{a.platform}</h4>
                                    <p className="text-xs text-gray-400 font-mono mt-1">{a.identifier}</p>
                                </div>
                                <button onClick={() => setAccounts(accounts.filter(x => x.id !== a.id))} className="text-gray-500 hover:text-red-400">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}