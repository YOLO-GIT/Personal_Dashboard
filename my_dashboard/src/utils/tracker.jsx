export function logClick(siteName, category) {
    const logs = JSON.parse(localStorage.getItem('dashboard_analytics')) || [];

    logs.push({
        site: siteName,
        category: category,
        timestamp: new Date().toISOString()
    });

    localStorage.setItem('dashboard_analytics', JSON.stringify(logs));
}