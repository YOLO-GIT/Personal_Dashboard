import React from "react";
import AmbientPlayer from "./AmbientPlayer";
import {
    Home,
    BarChart3,
    User,
    Activity,
    Code2,
    Wifi,
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab }) {
    // --- Quick Stats Readout ---
    const logs = JSON.parse(localStorage.getItem("dashboard_analytics")) || [];
    const todayStr = new Date().toDateString();
    const todayClicks = logs.filter(
        (l) => new Date(l.timestamp).toDateString() === todayStr,
    ).length;

    return (
        <aside className="relative w-64 p-5 bg-[#0a0a0a] flex flex-col justify-between shrink-0 border-r border-gray-900/80 h-screen top-0 overflow-hidden select-none">
            {/* Subtle Gradient Mask for Text Contrast */}
            <div className="absolute inset-0 bg-linear-to-b from-[#0a0a0a]/85 via-[#0a0a0a]/60 to-[#0a0a0a]/90 pointer-events-none" />

            {/* SCROLLABLE MAIN CONTENT AREA */}
            <div className="relative z-10 flex-1 flex flex-col min-h-0 space-y-3 overflow-y-auto my_scroll pr-0.5">
                {/* Brand / Header Link */}
                <a
                    href="https://github.com/YOLO-GIT/Personal_Dashboard.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group flex items-center px-4 py-2.5 bg-[#161616] border border-gray-800/80 hover:border-emerald-500/50 rounded-xl transition-all duration-300 active:translate-y-0 cursor-pointer overflow-hidden shrink-0"
                    title="View source on GitHub"
                >
                    <img
                        src="/dashy.gif"
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-90 transition-all duration-500 pointer-events-none"
                        onError={(e) => {
                            e.target.style.display = "none";
                        }}
                    />

                    <div className="relative z-10 flex items-center justify-between w-full">
                        <h1 className="text-xl font-bold text-white tracking-wide group-hover:text-emerald-400 transition-colors drop-shadow-md">
                            Dashboard
                        </h1>

                        <div className="p-1.5 rounded-lg bg-gray-800/60 group-hover:bg-emerald-500/20 text-gray-300 group-hover:text-emerald-400 border border-gray-700/50 group-hover:border-emerald-500/40 transition-all duration-300 group-hover:rotate-12 backdrop-blur-sm">
                            <Code2 className="w-3.5 h-3.5" />
                        </div>
                    </div>
                </a>

                {/* Navigation Links */}
                <nav className="space-y-1 bg-[#121212]/60 backdrop-blur-md border border-white/10 p-1 rounded-xl shrink-0">
                    <button
                        onClick={() => setActiveTab("home")}
                        className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "home"
                            ? "bg-emerald-600/90 text-white shadow-md shadow-emerald-950/50 border border-emerald-500/30"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <Home className="w-3.5 h-3.5" /> Home
                    </button>
                    <button
                        onClick={() => setActiveTab("personal")}
                        className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "personal"
                            ? "bg-emerald-600/90 text-white shadow-md shadow-emerald-950/50 border border-emerald-500/30"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <User className="w-3.5 h-3.5" /> Personal
                    </button>
                    <button
                        onClick={() => setActiveTab("analytics")}
                        className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "analytics"
                            ? "bg-emerald-600/90 text-white shadow-md shadow-emerald-950/50 border border-emerald-500/30"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <BarChart3 className="w-3.5 h-3.5" /> Analytics
                    </button>
                </nav>

                {/* Widgets Container */}
                <div className="space-y-2.5 pt-0.5">
                    {/* Ambient Sound Player */}
                    <div className="bg-[#121212]/70 backdrop-blur-md border border-white/10 rounded-xl p-1 shadow-lg">
                        <AmbientPlayer />
                    </div>

                    {/* Today's Activity Badge */}
                    <div className="bg-[#121212]/70 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5 shadow-lg">
                        <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 shrink-0">
                            <Activity className="w-3.5 h-3.5" />
                        </div>
                        <div>
                            <p className="text-[8px] text-gray-400 uppercase font-bold tracking-wider">
                                Today's Activity
                            </p>
                            <p className="text-xs font-bold text-white">
                                {todayClicks} {todayClicks === 1 ? "click" : "clicks"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FIXED FOOTER SYSTEM WIDGET */}
            <div className="relative z-10 pt-2 shrink-0">
                <div className="relative overflow-hidden bg-[#161616] border border-gray-800/80 rounded-xl p-3 space-y-1.5 shadow-lg group">
                    {/* Animated Wave / Pulse GIF in Bottom Card */}
                    <img
                        src="/dashy_3.gif"
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-90 transition-opacity pointer-events-none"
                        onError={(e) => (e.target.style.display = "none")}
                    />

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[11px] font-mono font-bold text-gray-200">
                                System Normal
                            </span>
                        </div>
                        <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" />
                    </div>

                    <div className="relative z-10 pt-1 border-t border-gray-800/60 flex justify-between items-center text-[9px] text-gray-400 font-mono">
                        <span>Port: 5000</span>
                        <span className="text-emerald-400/80 font-bold">Online</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}