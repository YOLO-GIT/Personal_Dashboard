const API_URL = 'http://localhost:5000/api/data';

export async function loadDashboardData() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Backend offline');
        return await res.json();
    } catch (err) {
        console.warn('Local server offline. Falling back to localStorage.');
        return {
            shortcuts: JSON.parse(localStorage.getItem('dashboard_shortcuts')) || null,
            scratchpad: localStorage.getItem('dashboard_scratchpad') || '',
            analytics: JSON.parse(localStorage.getItem('dashboard_analytics')) || [],
            games: JSON.parse(localStorage.getItem('dashboard_games')) || [],
            projects: JSON.parse(localStorage.getItem('dashboard_projects')) || [],
            accounts: JSON.parse(localStorage.getItem('dashboard_accounts')) || [],
        };
    }
}

export async function syncDashboardData(partialUpdate) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(partialUpdate),
        });
    } catch (err) {
        console.warn('Failed to sync to server. Saving locally instead.');
        Object.entries(partialUpdate).forEach(([key, val]) => {
            const storageKey = `dashboard_${key}`;
            localStorage.setItem(storageKey, typeof val === 'string' ? val : JSON.stringify(val));
        });
    }
}