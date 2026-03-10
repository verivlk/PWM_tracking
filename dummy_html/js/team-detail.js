// js/team-detail.js

document.addEventListener('DOMContentLoaded', async function () {
    const data = await fetchData();
    await renderTeamDetail(data);
});


async function renderTeamDetail(data) {
    // Render worker list from data.workers
    await renderList('#worker-list', '/templates/lists/worker-row.html', data.workers);
}