// js/dashboard.js

document.addEventListener('DOMContentLoaded', async function () {
    const data = await fetchData();
    await renderDashboard(data);
});


async function renderDashboard(data) {
    // Load search bar template into the <search> element
    await renderTemplate('#workers-panel search', '/templates/search.html');

    // Render worker list from data.workers
    await renderList('#worker-list', '/templates/lists/worker-row.html', data.workers);
}