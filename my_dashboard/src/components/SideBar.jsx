import React, { useState, useEffect } from 'react';
import AmbientPlayer from './AmbientPlayer';
import { Home, BarChart3, Timer, User, Play, Pause, RotateCcw, Activity, HardDrive } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
    // --- Pomodoro Timer State ---
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState('work'); // 'work' or 'break'

    useEffect(() => {
        let interval = null;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
            if (mode === 'work') {
                setMode('break');
                setTimeLeft(5 * 60);
                alert('Focus session completed! Take a 5-minute break.');
            } else {
                setMode('work');
                setTimeLeft(25 * 60);
                alert('Break is over! Time to focus.');
            }
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft, mode]);

    const toggleTimer = () => setIsRunning(!isRunning);
    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // --- Quick Stats Readout ---
    const logs = JSON.parse(localStorage.getItem('dashboard_analytics')) || [];
    const todayStr = new Date().toDateString();
    const todayClicks = logs.filter(l => new Date(l.timestamp).toDateString() === todayStr).length;

    return (
        <aside className="w-64 p-6 bg-black flex flex-col justify-between shrink-0 border-r border-gray-900 h-screen sticky top-0">
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white tracking-wide">Dashboard</h1>

                {/* Navigation */}
                <nav className="space-y-2">
                    <button
                        onClick={() => setActiveTab('home')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'home' ? 'bg-[#1E1E1E] text-white' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Home className="w-4 h-4" /> Home
                    </button>
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'personal' ? 'bg-[#1E1E1E] text-white' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <User className="w-4 h-4" /> Personal
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'analytics' ? 'bg-[#1E1E1E] text-white' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <BarChart3 className="w-4 h-4" /> Analytics
                    </button>
                </nav>

                <div className="border-t border-gray-900 pt-6 space-y-4">
                    {/* Pomodoro Timer Widget */}
                    <div className="bg-[#181818] border border-gray-800/80 rounded-2xl p-4 space-y-3 shadow-inner">
                        <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">
                                <Timer className="w-3.5 h-3.5" /> {mode === 'work' ? 'Focus Session' : 'Break Time'}
                            </span>
                            <span className="text-[10px] text-gray-500 font-mono">{mode === 'work' ? '25m' : '5m'}</span>
                        </div>

                        <div className="text-center py-1">
                            <div className="text-3xl font-mono font-bold text-white tracking-widest">
                                {formatTime(timeLeft)}
                            </div>
                        </div>

                        <div className="flex justify-center gap-2">
                            <button
                                onClick={toggleTimer}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition ${isRunning
                                    ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                                    : 'bg-emerald-600 text-white hover:bg-emerald-500'
                                    }`}
                            >
                                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                {isRunning ? 'Pause' : 'Start'}
                            </button>
                            <button
                                onClick={resetTimer}
                                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
                                title="Reset Timer"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    <AmbientPlayer />

                    {/* Today's Activity Badge */}
                    <div className="bg-[#181818] border border-gray-800/80 rounded-2xl p-4 flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-950/50 border border-emerald-800/50 rounded-xl text-emerald-400 shrink-0">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Today's Activity</p>
                            <p className="text-sm font-bold text-white mt-0.5">{todayClicks} {todayClicks === 1 ? 'click' : 'clicks'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Storage Indicator */}
            <div className="pt-4 border-t border-gray-900 text-xs text-gray-500 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-emerald-500" /> Local Storage
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-semibold">ONLINE</span>
            </div>
        </aside>
    );
}