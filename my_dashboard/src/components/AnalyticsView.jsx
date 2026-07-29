import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Trash2 } from 'lucide-react';

const CATEGORY_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AnalyticsView() {
    const logs = JSON.parse(localStorage.getItem('dashboard_analytics')) || [];

    // Aggregate stats using useMemo so data updates cleanly
    const { topSitesData, categoryData, hourlyData, kpis } = useMemo(() => {
        if (!logs.length) {
            return {
                topSitesData: [],
                categoryData: [],
                hourlyData: [],
                kpis: { today: 0, topSite: 'N/A', peakHour: 'N/A' }
            };
        }

        // 1. KPI: Clicks Today
        const todayStr = new Date().toDateString();
        const todayClicks = logs.filter(l => new Date(l.timestamp).toDateString() === todayStr).length;

        // 2. Bar Chart Data (Top Sites)
        const siteCounts = {};
        logs.forEach(l => siteCounts[l.site] = (siteCounts[l.site] || 0) + 1);
        const topSitesData = Object.entries(siteCounts)
            .map(([site, clicks]) => ({ name: site, clicks }))
            .sort((a, b) => b.clicks - a.clicks);

        const topSite = topSitesData[0]?.name || 'N/A';

        // 3. Donut Chart Data (Categories)
        const catCounts = {};
        logs.forEach(l => catCounts[l.category] = (catCounts[l.category] || 0) + 1);
        const categoryData = Object.entries(catCounts).map(([category, value]) => ({ name: category, value }));

        // 4. Area Chart Data (24h Activity)
        const hours = Array(24).fill(0);
        logs.forEach(l => {
            const h = new Date(l.timestamp).getHours();
            hours[h]++;
        });
        const hourlyData = hours.map((clicks, hour) => ({ hour: `${hour}:00`, clicks }));
        const maxClicks = Math.max(...hours);
        const peakHr = hours.indexOf(maxClicks);
        const peakHour = maxClicks > 0 ? `${peakHr}:00 - ${peakHr + 1}:00` : 'N/A';

        return {
            topSitesData,
            categoryData,
            hourlyData,
            kpis: { today: todayClicks, topSite, peakHour }
        };
    }, [logs.length]);

    const handleClear = () => {
        if (window.confirm("Are you sure you want to reset all click history?")) {
            localStorage.removeItem('dashboard_analytics');
            window.location.reload();
        }
    };

    // State when no click data exists yet
    if (!logs.length) {
        return (
            <div className="bg-[#1E1E1E] border border-gray-800 rounded-2xl p-12 text-center my-8">
                <h3 className="text-xl font-bold text-white mb-2">No Analytics Data Yet</h3>
                <p className="text-gray-400 text-sm">
                    Head back to the Home tab and click on a few shortcut cards to start logging usage!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header & Reset Button */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Usage Analytics</h2>
                <button
                    onClick={handleClear}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 border border-red-900/40 hover:bg-red-950/30 rounded-lg transition"
                >
                    <Trash2 className="w-3.5 h-3.5" /> Reset Data
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1E1E1E] border border-gray-800 p-5 rounded-xl">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Clicks Today</p>
                    <p className="text-3xl font-bold text-emerald-400">{kpis.today}</p>
                </div>
                <div className="bg-[#1E1E1E] border border-gray-800 p-5 rounded-xl">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Top Shortcut</p>
                    <p className="text-3xl font-bold text-white truncate">{kpis.topSite}</p>
                </div>
                <div className="bg-[#1E1E1E] border border-gray-800 p-5 rounded-xl">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Peak Activity Window</p>
                    <p className="text-3xl font-bold text-blue-400">{kpis.peakHour}</p>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart: Shortcut Popularity */}
                <div className="bg-[#1E1E1E] border border-gray-800 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-white mb-4">Shortcut Popularity</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topSitesData}>
                                <XAxis dataKey="name" stroke="#6B7280" tick={{ fill: '#9CA3AF' }} />
                                <YAxis stroke="#6B7280" tick={{ fill: '#9CA3AF' }} allowDecimals={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }} />
                                <Bar dataKey="clicks" fill="#10B981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut Chart: Category Breakdown */}
                <div className="bg-[#1E1E1E] border border-gray-800 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-white mb-4">Category Breakdown</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={5}>
                                    {categoryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Area Chart: 24h Rhythm */}
            <div className="bg-[#1E1E1E] border border-gray-800 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-white mb-4">Daily Activity Rhythm (24h)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={hourlyData}>
                            <XAxis dataKey="hour" stroke="#6B7280" tick={{ fill: '#9CA3AF' }} />
                            <YAxis stroke="#6B7280" tick={{ fill: '#9CA3AF' }} allowDecimals={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }} />
                            <Area type="monotone" dataKey="clicks" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}